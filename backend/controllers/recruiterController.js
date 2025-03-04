const OTP = require('../models/otp');
const RecruiterSignin = require('../models/recruiterSignin');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const JobPost = require('../models/jobpost');  // Ensure the correct lowercase file name
const { JobApplication } = require('../models/jobApplications');
const TempJobPost = require('../models/TempJobPost'); // Adjust the path if needed
const { sequelize } = require('../db');  // New import
const { Op } = require('sequelize'); // Import for operators

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
    
    const isPasswordValid = await bcrypt.compare(password, recruiter.password);
    console.log('Password comparison result:', isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

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
    
    // Get the recruiter details after OTP verification
    const recruiter = await RecruiterSignin.findOne({ where: { email } });
    
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found. Please contact your admin.' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        recruiter_id: recruiter.recruiter_id, 
        email 
      },
      JWT_SECRET,
      { expiresIn: '2400h' }
    );
    
    // Clean up - delete the OTP
    await OTP.destroy({ where: { email } });
    
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

// Get job draft preview
exports.getJobDraftPreview = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required"
      });
    }
    
    const jobDraft = await TempJobPost.findOne({
      where: { session_id: sessionId }
    });
    
    if (!jobDraft) {
      return res.status(404).json({
        success: false,
        message: "Job draft not found or expired"
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
  
// Create a new job from draft
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

        // Get recruiter_id from the authenticated user
        const recruiter_id = req.recruiter.recruiter_id;
        if (!recruiter_id) {
            await transaction.rollback();
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please log in again."
            });
        }

        // Create the permanent job post
        const newJob = await JobPost.create({
            recruiter_id,
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
            status: "pending"  // Set default status to pending
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

// Create a job draft
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

        // Get the recruiter_id from the authenticated user
        const recruiter_id = req.recruiter.recruiter_id;
        if (!recruiter_id) {
            await transaction.rollback();
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please log in again."
            });
        }

        // Generate a new session ID
        const sessionId = generateUniqueSessionId();

        // Create new draft
        const jobDraft = await TempJobPost.create({
            session_id: sessionId,
            recruiter_id,
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
            session_id, jobTitle, employmentType, keySkills, department, workMode, locations, industry, 
            diversityHiring, jobDescription, multipleVacancies, companyName, companyInfo,
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

        // Get the recruiter_id from the authenticated user
        const recruiter_id = req.recruiter.recruiter_id;
        if (!recruiter_id) {
            await transaction.rollback();
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please log in again."
            });
        }

        // Update draft
        const updatedDraft = await existingDraft.update({
            jobTitle, employmentType, keySkills, department, workMode, locations, industry,
            diversityHiring, jobDescription, multipleVacancies, companyName, companyInfo,
            companyAddress, min_salary, max_salary, min_experience, max_experience,
            created_by: recruiter_id,
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
            jobTitle, employmentType, keySkills, department, workMode, locations, industry, diversityHiring, jobDescription,
            multipleVacancies, companyName, companyInfo, companyAddress, min_salary, max_salary, min_experience, max_experience
        } = req.body;

        // Validate required fields
        if (!jobTitle || !employmentType || !keySkills || !department || !workMode || !locations || !jobDescription) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Get the recruiter_id from the authenticated user
        const recruiter_id = req.recruiter.recruiter_id;
        if (!recruiter_id) {
            await transaction.rollback();
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please log in again."
            });
        }

        // Create the job post
        const newJob = await JobPost.create({
            recruiter_id,
            jobTitle, employmentType, keySkills, department, workMode, locations, industry, diversityHiring, jobDescription,
            multipleVacancies, companyName, companyInfo, companyAddress, min_salary, max_salary, min_experience, max_experience,
            job_creation_date: new Date(),
            is_active: true,
            status: "pending",  // Set default status to 'pending'
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
        // Get the recruiter_id from the authenticated user
        const recruiter_id = req.recruiter.recruiter_id;
        if (!recruiter_id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please log in again."
            });
        }

        const jobs = await JobPost.findAll({
            where: { 
                recruiter_id,
                is_active: true 
            },
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
        const recruiter_id = req.recruiter.recruiter_id;

        const job = await JobPost.findOne({
            where: {
                job_id: jobId,
                recruiter_id: recruiter_id  // Ensure the job belongs to this recruiter
            }
        });
        
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job post not found or not authorized to view"
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
        const recruiter_id = req.recruiter.recruiter_id;

        // Find the job ensuring it belongs to this recruiter
        const job = await JobPost.findOne({
            where: {
                job_id: jobId,
                recruiter_id: recruiter_id
            }
        });
        
        if (!job) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Job post not found or not authorized to update"
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
        const recruiter_id = req.recruiter.recruiter_id;

        // Find the job ensuring it belongs to this recruiter
        const job = await JobPost.findOne({
            where: {
                job_id: jobId,
                recruiter_id: recruiter_id
            }
        });
        
        if (!job) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Job post not found or not authorized to delete"
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

// Get all jobs created by the recruiter with their status
exports.getAllJobsWithStatus = async (req, res) => {
    try {
        // Ensure req.recruiter exists and has recruiter_id
        if (!req.recruiter || !req.recruiter.recruiter_id) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication required. Please log in again." 
            });
        }

        const recruiterId = req.recruiter.recruiter_id;

        const jobs = await JobPost.findAll({
            where: { recruiter_id: recruiterId },
            attributes: ["job_id", "jobTitle", "status", "job_creation_date", "is_active"],
            order: [['job_creation_date', 'DESC']]
        });

        return res.status(200).json({ 
            success: true, 
            count: jobs.length,
            jobs 
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch jobs", 
            error: error.message 
        });
    }
};

// Get pending jobs
exports.getPendingJobs = async (req, res) => {
    try {
        if (!req.recruiter || !req.recruiter.recruiter_id) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication required. Please log in again." 
            });
        }

        const recruiterId = req.recruiter.recruiter_id;

        const pendingJobs = await JobPost.findAll({
            where: { 
                recruiter_id: recruiterId, 
                status: "pending",
                is_active: true 
            },
            order: [['job_creation_date', 'DESC']]
        });

        return res.status(200).json({ 
            success: true, 
            count: pendingJobs.length,
            jobs: pendingJobs 
        });
    } catch (error) {
        console.error("Error fetching pending jobs:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch pending jobs", 
            error: error.message 
        });
    }
};

// Get approved jobs
exports.getApprovedJobs = async (req, res) => {
    try {
        if (!req.recruiter || !req.recruiter.recruiter_id) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication required. Please log in again." 
            });
        }

        const recruiterId = req.recruiter.recruiter_id;

        const approvedJobs = await JobPost.findAll({
            where: { 
                recruiter_id: recruiterId, 
                status: "approved",
                is_active: true 
            },
            order: [['job_creation_date', 'DESC']]
        });

        return res.status(200).json({ 
            success: true, 
            count: approvedJobs.length,
            jobs: approvedJobs 
        });
    } catch (error) {
        console.error("Error fetching approved jobs:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch approved jobs", 
            error: error.message 
        });
    }
};

// Get rejected jobs
exports.getRejectedJobs = async (req, res) => {
    try {
        if (!req.recruiter || !req.recruiter.recruiter_id) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication required. Please log in again." 
            });
        }

        const recruiterId = req.recruiter.recruiter_id;

        const rejectedJobs = await JobPost.findAll({
            where: { 
                recruiter_id: recruiterId, 
                status: "rejected",
                is_active: true
            },
            order: [['job_creation_date', 'DESC']]
        });

        return res.status(200).json({ 
            success: true,
            count: rejectedJobs.length, 
            jobs: rejectedJobs 
        });
    } catch (error) {
        console.error("Error fetching rejected jobs:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch rejected jobs", 
            error: error.message 
        });
    }
};
