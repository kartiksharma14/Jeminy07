// controllers/recruiterController.js
/*const OTP = require('../models/otp');
const TemporaryRecruiter = require('../models/temporaryRecruiter');
const RecruiterSignin = require('../models/recruiterSignin');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const jobPost = require('../models/jobPost');
const { JobApplication } = require('../models/jobApplications');
const { sequelize } = require('../db');  // New import
const cities = require('../data/cities.json');


// Configure nodemailer

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});

const { JWT_SECRET } = process.env;
// POST: Recruiter Sign-In (Send OTP)
// Step 1: Login with admin-provided credentials and send OTP
exports.loginRecruiter = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the recruiter with the provided email
      const recruiter = await RecruiterSignin.findOne({ where: { email } });
      
      // If recruiter doesn't exist
      if (!recruiter) {
        return res.status(404).json({ message: 'Recruiter not found. Please contact your admin.' });
      }
      
      // Compare the password
      const isPasswordValid = await bcrypt.compare(password, recruiter.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Store recruiter ID temporarily for OTP verification
      // We'll use this to generate the JWT after OTP verification
      await TemporaryRecruiter.upsert({ 
        email, 
        recruiter_id: recruiter.recruiter_id,
        // Don't store password here as we've already verified it
        password: 'VERIFIED' // Just a placeholder
      });
      
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
      
      // Save OTP in otpstore table
      await OTP.upsert({ email, otp, otp_expiry: otpExpiry });
      
      // Send OTP via email
      const mailOptions = {
        from: process.env.MAIL_DEFAULT_SENDER || process.env.MAIL_USERNAME,
        to: email,
        subject: 'Login Verification OTP',
        text: `Your login verification OTP is: ${otp}`
      };
      
      await transporter.sendMail(mailOptions);
      
      return res.status(200).json({
        message: 'Credentials verified. OTP sent to your email.',
        email,
        otpSent: true
      });
      
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Error during login', error: error.message });
    }
  };
  
  // Step 2: Verify OTP and generate JWT token
  exports.verifyLoginOtp = async (req, res) => {
    const { email, otp } = req.body;
    
    try {
      // Validate OTP
      const otpEntry = await OTP.findOne({ where: { email, otp } });
      
      if (!otpEntry || new Date() > otpEntry.otp_expiry) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
      
      // Retrieve the temporary stored recruiter information
      const tempRecruiter = await TemporaryRecruiter.findOne({ where: { email } });
      
      if (!tempRecruiter) {
        return res.status(400).json({ message: 'Login session expired. Please login again.' });
      }
      
      // Generate JWT token now that OTP is verified
      const token = jwt.sign(
        { recruiter_id: tempRecruiter.recruiter_id, email },
        JWT_SECRET,
        { expiresIn: '240h' }
      );
      
      // Clean up - delete the OTP and temp recruiter data
      await OTP.destroy({ where: { email } });
      await TemporaryRecruiter.destroy({ where: { email } });
      
      return res.status(200).json({
        message: 'Login successful!',
        token,
        verified: true
      });
      
    } catch (error) {
      console.error('OTP verification error:', error);
      return res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
  };

// Create Job Post
exports.createJobPost = async (req, res) => {
    const { questions, location, ...jobDetails } = req.body;
    const transaction = await sequelize.transaction();

    try {
        // Validate location
        if (location) {
            const cityExists = cities.cities.some(
                (city) => city.City.toLowerCase() === location.toLowerCase()
            );

            if (!cityExists) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: "Invalid city",
                });
            }
        }

        // Step 1: Create the Job Post
        const newJob = await jobPost.create({ ...jobDetails, location }, { transaction });

        
        // Commit the Transaction
        await transaction.commit();
        return res.status(200).json({ message: "Job post created successfully.", job: newJob });
    } catch (error) {
        // Rollback Transaction in Case of Error
        await transaction.rollback();
        console.error('Error creating job post:', error.message);
        return res.status(500).json({ message: "Failed to create job post.", error: error.message });
    }
};  


// Update Job Post (Edit Any Field)
exports.updateJobPost = async (req, res) => {
    try {
        const { job_id } = req.params;
        const { location, ...updatedData } = req.body;

        // Validate location
        if (location) {
            const cityExists = cities.cities.some(
                (city) => city.City.toLowerCase() === location.toLowerCase()
            );

            if (!cityExists) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid city",
                });
            }
        }

        // Find the job post by ID
    
        const job = await jobPost.findByPk(job_id);

        if (!job) {
            return res.status(404).json({ error: 'Job post not found' });
        }

        // Update the job post with the provided data
        await job.update({ ...updatedData, location });

        return res.status(200).json({
            message: 'Job post updated successfully',
            job,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update job post', details: error.message });
    }
};
  

// Delete Job Post
exports.deleteJobPost = async (req, res) => {
    try {
      const { job_id } = req.params;
  
      const job = await jobPost.findByPk(job_id);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
  
      await job.destroy();
      return res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete job', details: error.message });
    }
  };
  

  // Get All Job Posts
exports.getAllJobs = async (req, res) => {
    try {
      const jobs = await jobPost.findAll();
      return res.status(200).json({ jobs });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch jobs', details: error.message });
    }
  };


  // Recruiter gets candidates for a job
exports.getCandidatesByJob = async (req, res) => {
    try {
        const { job_id } = req.params;
        
        // Fetch candidates who applied
        const applications = await JobApplication.findAll({
            where: { job_id },
            include: [{ model: CandidateProfile, attributes: ['candidate_id', 'name', 'email', 'phone'] }]
        });

        if (applications.length === 0) {
            return res.status(404).json({ message: "No candidates have applied yet" });
        }

        res.status(200).json({ job_id, applicants: applications });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};*/

// controllers/recruiterController.js
const OTP = require('../models/otp');
const TemporaryRecruiter = require('../models/temporaryRecruiter');
const RecruiterSignin = require('../models/recruiterSignin');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const jobPost = require('../models/jobpost');  // Ensure the correct lowercase file name
const { JobApplication } = require('../models/jobApplications');
const TempJobPost = require('../models/TempJobPost'); // Adjust the path if needed
const { sequelize } = require('../db');  // New import
const cities = require('../data/cities.json');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});

const { JWT_SECRET } = process.env;

// POST: Recruiter Sign-In (Send OTP)
// Login with admin-provided credentials and send OTP
exports.loginRecruiter = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the recruiter with the provided email
      const recruiter = await RecruiterSignin.findOne({ where: { email } });
  
      // If recruiter doesn't exist
      if (!recruiter) {
        return res.status(404).json({ message: 'Recruiter not found. Please contact your admin.' });
      }
  
      // Debug: Log input password and hashed password
      console.log('Input Password:', password);
      console.log('Hashed Password in DB:', recruiter.password);
 
      const bcrypt = require('bcryptjs'); 
      
      const isPasswordValid = await bcrypt.compare(password, recruiter.password);
      console.log('Password comparison result:', isPasswordValid);
      
      if (!isPasswordValid) {
        return res.status(404).json({ message: 'Invalid credentials' });
      }
  
      // Rest of your code remains the same...
      await TemporaryRecruiter.upsert({
        email,
        recruiter_id: recruiter.recruiter_id,
        password: 'VERIFIED', // Just a placeholder
      });
  
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
      const otpExpiry = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes expiry
  
      // Save OTP in otpstore table
      await OTP.upsert({ email, otp, otp_expiry: otpExpiry });
  
      // Send OTP via email
      const mailOptions = {
        from: process.env.MAIL_DEFAULT_SENDER || process.env.MAIL_USERNAME,
        to: email,
        subject: 'Login Verification OTP',
        text: `Your login verification OTP is: ${otp}`,
      };
  
      await transporter.sendMail(mailOptions);
  
      return res.status(200).json({
        message: 'Credentials verified. OTP sent to your email.',
        email,
        otpSent: true,
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Error during login', error: error.message });
    }
};  
// Step 2: Verify OTP and generate JWT token
exports.verifyLoginOtp = async (req, res) => {
    const { email, otp } = req.body;
    
    try {
      // Validate OTP
      const otpEntry = await OTP.findOne({ where: { email, otp } });
      
      if (!otpEntry || new Date() > otpEntry.otp_expiry) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
      
      // Retrieve the temporary stored recruiter information
      const tempRecruiter = await TemporaryRecruiter.findOne({ where: { email } });
      
      if (!tempRecruiter) {
        return res.status(400).json({ message: 'Login session expired. Please login again.' });
      }
      
      // Generate JWT token now that OTP is verified
      const token = jwt.sign(
        { recruiter_id: tempRecruiter.recruiter_id, email },
        JWT_SECRET,
        { expiresIn: '2400h' }
      );
      
      // Clean up - delete the OTP and temp recruiter data
      await OTP.destroy({ where: { email } });
      await TemporaryRecruiter.destroy({ where: { email } });
      
      return res.status(200).json({
        message: 'Login successful!',
        token,
        verified: true
      });
      
    } catch (error) {
      console.error('OTP verification error:', error);
      return res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
  };

const JobPost = require('../models/jobpost');
  
  //Get a job draft preview by session ID
  exports.getJobDraftPreview = async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const jobDraft = await TempJobPost.findOne({
        where: { session_id: sessionId }
      });
      
      if (!jobDraft) {
        return res.status(404).json({
          success: false,
          message: "Job draft not found"
        });
      }
      
      return res.status(200).json({
        success: true,
        draft: jobDraft
      });
    } catch (error) {
      console.error('Error fetching job draft:', error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch job draft.",
        error: error.message
      });
    }
  };
  
  // Create a permanent job post from the draft
  /*exports.createJobFromDraft = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { session_id } = req.body;
      
      if (!session_id) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Session ID is required"
        });
      }
      
      // Find the job draft
      const jobDraft = await TempJobPost.findOne({
        where: { session_id }
      });
      
      if (!jobDraft) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: "Job draft not found"
        });
      }

      // Ensure recruiter_id is present
      const recruiter_id = req.user?.id; // Assuming recruiter ID is stored in `req.user.id`
      if (!recruiter_id) {
          await transaction.rollback();
          return res.status(400).json({
              success: false,
              message: "Recruiter ID is required"
          });
      }
      
      // Create the permanent job post
      const newJob = await JobPost.create({
        jobTitle: jobDraft.jobTitle,
        employmentType: jobDraft.employmentType,
        keySkills: jobDraft.keySkills,
        department: jobDraft.department,
        workMode: jobDraft.workMode,
        locations: jobDraft.locations,
        industry: jobDraft.industry,
        diversityHiring: jobDraft.diversityHiring,
        jobDescription: jobDraft.jobDescription,
        multipleVacancies: jobDraft.multipleVacancies,
        companyName: jobDraft.companyName,
        companyInfo: jobDraft.companyInfo,
        companyAddress: jobDraft.companyAddress,
        min_salary: jobDraft.min_salary,
        max_salary: jobDraft.max_salary,
        min_experience: jobDraft.min_experience,
        max_experience: jobDraft.max_experience,
        job_creation_date: new Date(),
        is_active: true,
        recruiter_id: recruiter_id  
      }, { transaction });
      
      // Delete the draft after creating the permanent job
      await jobDraft.destroy({ transaction });
      
      // Commit the transaction
      await transaction.commit();
      
      return res.status(200).json({
        success: true,
        message: "Job posted successfully from draft!",
        job: newJob
      });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      console.error('Error creating job from draft:', error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to create job from draft.",
        error: error.message
      });
    }
  };*/

  exports.createJobFromDraft = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { session_id } = req.body;
        
        if (!session_id) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Session ID is required"
            });
        }
        
        // Find the job draft
        const jobDraft = await TempJobPost.findOne({
            where: { session_id }
        });
        
        if (!jobDraft) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Job draft not found"
            });
        }

        // ✅ Fetch recruiter_id from the draft instead of req.user.id
        const recruiter_id = jobDraft.recruiter_id;
        if (!recruiter_id) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Recruiter ID is missing in the job draft"
            });
        }

        // Create the permanent job post
        const newJob = await JobPost.create({
            recruiter_id,  // ✅ Using recruiter_id from the draft
            jobTitle: jobDraft.jobTitle,
            employmentType: jobDraft.employmentType,
            keySkills: jobDraft.keySkills,
            department: jobDraft.department,
            workMode: jobDraft.workMode,
            locations: jobDraft.locations,
            industry: jobDraft.industry,
            diversityHiring: jobDraft.diversityHiring,
            jobDescription: jobDraft.jobDescription,
            multipleVacancies: jobDraft.multipleVacancies,
            companyName: jobDraft.companyName,
            companyInfo: jobDraft.companyInfo,
            companyAddress: jobDraft.companyAddress,
            min_salary: jobDraft.min_salary,
            max_salary: jobDraft.max_salary,
            min_experience: jobDraft.min_experience,
            max_experience: jobDraft.max_experience,
            job_creation_date: new Date(),
            is_active: true
        }, { transaction });

        // Delete the draft after creating the permanent job
        await jobDraft.destroy({ transaction });
        
        // Commit the transaction
        await transaction.commit();
        
        return res.status(200).json({
            success: true,
            message: "Job created successfully from draft!",
            job: newJob
        });
    } catch (error) {
        // Rollback transaction in case of error
        await transaction.rollback();
        console.error('Error creating job from draft:', error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to create job from draft.",
            error: error.message
        });
    }
};


  // Create a new job draft (POST)
/*exports.createJobDraft = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            jobTitle, employmentType, keySkills, department, workMode, locations, industry,
            diversityHiring, jobDescription, multipleVacancies, companyName, companyInfo,
            companyAddress, min_salary, max_salary, min_experience, max_experience
        } = req.body;

        // Validate required fields
        if (!jobTitle || !employmentType || !keySkills || !department || !workMode || !locations || !jobDescription) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Missing required fields for job draft"
            });
        }

        // Generate a new session ID
        const sessionId = generateUniqueSessionId();

        // Create new draft
        const jobDraft = await TempJobPost.create({
            session_id: sessionId,
            jobTitle, employmentType, keySkills, department, workMode, locations, industry,
            diversityHiring, jobDescription, multipleVacancies, companyName, companyInfo,
            companyAddress, min_salary, max_salary, min_experience, max_experience,
            created_by: req.user?.id || null,
            expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expires in 24 hours
        }, { transaction });

        // Commit the transaction
        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: "Job draft created successfully!",
            draft: jobDraft,
            session_id: sessionId
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Error creating job draft:', error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to create job draft.",
            error: error.message
        });
    }
};*/

exports.createJobDraft = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            jobTitle, employmentType, keySkills, department, workMode, locations, industry,
            diversityHiring, jobDescription, multipleVacancies, companyName, companyInfo,
            companyAddress, min_salary, max_salary, min_experience, max_experience
        } = req.body;

        // Validate required fields
        if (!jobTitle || !employmentType || !keySkills || !department || !workMode || !locations || !jobDescription) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Missing required fields for job draft"
            });
        }

        // Ensure recruiter_id is present
        const recruiter_id = req.user?.id;
        if (!recruiter_id) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Recruiter ID is required"
            });
        }

        // Generate a new session ID
        const sessionId = generateUniqueSessionId();

        // Create new draft
        const jobDraft = await TempJobPost.create({
            session_id: sessionId,
            recruiter_id,  // ✅ Storing recruiter_id in the draft
            jobTitle, employmentType, keySkills, department, workMode, locations, industry,
            diversityHiring, jobDescription, multipleVacancies, companyName, companyInfo,
            companyAddress, min_salary, max_salary, min_experience, max_experience,
            created_by: recruiter_id,  // Ensure created_by is also set
            expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expires in 24 hours
        }, { transaction });

        // Commit the transaction
        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: "Job draft created successfully!",
            draft: jobDraft,
            session_id: sessionId
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Error creating job draft:', error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to create job draft.",
            error: error.message
        });
    }
};


// Update an existing job draft (PATCH)
exports.updateJobDraft = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            session_id, jobTitle, employmentType, keySkills, department, workMode, locations,
            industry, diversityHiring, jobDescription, multipleVacancies, companyName, companyInfo,
            companyAddress, min_salary, max_salary, min_experience, max_experience
        } = req.body;

        if (!session_id) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Session ID is required for updating the job draft"
            });
        }

        // Check if draft exists
        const existingDraft = await TempJobPost.findOne({
            where: { session_id: session_id }
        });

        if (!existingDraft) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Job draft not found"
            });
        }

        // Update draft
        const updatedDraft = await existingDraft.update({
            jobTitle, employmentType, keySkills, department, workMode, locations, industry,
            diversityHiring, jobDescription, multipleVacancies, companyName, companyInfo,
            companyAddress, min_salary, max_salary, min_experience, max_experience,
            created_by: req.user?.id || null,
            expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000) // Reset expiry to 24 hours
        }, { transaction });

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: "Job draft updated successfully!",
            draft: updatedDraft,
            session_id: session_id
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Error updating job draft:', error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to update job draft.",
            error: error.message
        });
    }
};

  
  // Delete a job draft
  exports.deleteJobDraft = async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const jobDraft = await TempJobPost.findOne({
        where: { session_id: sessionId }
      });
      
      if (!jobDraft) {
        return res.status(404).json({
          success: false,
          message: "Job draft not found"
        });
      }
      
      // Delete the draft
      await jobDraft.destroy();
      
      return res.status(200).json({
        success: true,
        message: "Job draft deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting job draft:', error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to delete job draft.",
        error: error.message
      });
    }
  };
  
  // Helper function to generate a unique session ID
  function generateUniqueSessionId() {
    return 'draft_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
  }
  
  // Clean up expired drafts - can be run via a cron job
  exports.cleanupExpiredDrafts = async () => {
    try {
      const now = new Date();
      const result = await TempJobPost.destroy({
        where: {
          expiry_time: {
            [Op.lt]: now
          }
        }
      });
      
      console.log(`Cleaned up ${result} expired job drafts`);
      return result;
    } catch (error) {
      console.error('Error cleaning up expired drafts:', error.message);
      throw error;
    }
  };


// Create a new job post
exports.createJobPost = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Extract data from request body
    const {
      jobTitle,
      employmentType,
      keySkills,
      department,
      workMode,
      locations,
      industry,
      diversityHiring,
      jobDescription,
      multipleVacancies,
      companyName,
      companyInfo,
      companyAddress,
      min_salary,
      max_salary,
      min_experience,
      max_experience
    } = req.body;

    // Validate required fields
    if (!jobTitle || !employmentType || !keySkills || !department || !workMode || !locations || !jobDescription) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Create the job post
    const newJob = await JobPost.create({
      jobTitle,
      employmentType,
      keySkills,
      department,
      workMode,
      locations,
      industry,
      diversityHiring,
      jobDescription,
      multipleVacancies,
      companyName,
      companyInfo,
      companyAddress,
      min_salary,
      max_salary,
      min_experience,
      max_experience,
      job_creation_date: new Date(),
      is_active: true,
      status: "pending",  // ❗ Set default status to 'pending'
    }, { transaction });

    // Commit the transaction
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Job created successfully and pending for Admin approval",
      job: newJob
    });
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback();
    console.error('Error creating job post:', error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create job post.",
      error: error.message
    });
  }
};

// Get all job posts
exports.getJobPosts = async (req, res) => {
  try {
    const jobs = await JobPost.findAll({
      where: { is_active: true },
      order: [['job_creation_date', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Error fetching job posts:', error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job posts.",
      error: error.message
    });
  }
};

exports.getJobPosts = async (req, res) => {
    try {
      const jobs = await JobPost.findAll({
        where: { is_active: true },
        order: [['job_creation_date', 'DESC']]
      });
      
      return res.status(200).json({
        success: true,
        count: jobs.length,
        jobs
      });
    } catch (error) {
      console.error('Error fetching job posts:', error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch job posts.",
        error: error.message
      });
    }
  };

// Get a single job post by ID
exports.getJobPostById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await JobPost.findByPk(jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job post not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Error fetching job post:', error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job post.",
      error: error.message
    });
  }
};

// Update a job post
exports.updateJobPost = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const jobId = req.params.id;
    const job = await JobPost.findByPk(jobId);
    
    if (!job) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Job post not found"
      });
    }
    
    // Update job post with new data
    await job.update(req.body, { transaction });
    
    // Commit the transaction
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: "Job post updated successfully",
      job
    });
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback();
    console.error('Error updating job post:', error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update job post.",
      error: error.message
    });
  }
};

// Delete a job post (soft delete by setting is_active to false)
exports.deleteJobPost = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const jobId = req.params.id;
    const job = await JobPost.findByPk(jobId);
    
    if (!job) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Job post not found"
      });
    }
    
    // Soft delete by setting is_active to false
    await job.update({ is_active: false }, { transaction });
    
    // Commit the transaction
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: "Job post deleted successfully"
    });
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback();
    console.error('Error deleting job post:', error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete job post.",
      error: error.message
    });
  }
};
  
