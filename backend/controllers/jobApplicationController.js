const { Op } = require('sequelize');
const CandidateProfile = require('../models/candidateProfile');
const JobApplication = require('../models/jobApplications');
const SavedJob = require('../models/savedJob');
const JobPost = require('../models/jobpost.js');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});

// Candidate applies for a job
exports.applyForJob = async (req, res) => {
    try {
        const candidate_id = req.user.candidate_id; // Extracted from token
        const { job_id } = req.params;

        // Check if job exists
        const jobExists = await JobPost.findByPk(job_id);
        if (!jobExists) return res.status(404).json({ 
            success: false,
            message: "Job not found" 
        });

        // Check if already applied
        const existingApplication = await JobApplication.findOne({ 
            where: { candidate_id, job_id } 
        });
        
        if (existingApplication) {
            return res.status(400).json({ 
                success: false,
                message: "Already applied to this job" 
            });
        }

        // Apply for the job
        const application = await JobApplication.create({ 
            candidate_id, 
            job_id,
            status: 'pending'
        });

        // Get candidate details for notification
        const candidate = await CandidateProfile.findByPk(candidate_id);
        
        // Notify recruiter
        try {
            const recruiter_id = jobExists.recruiter_id;
            if (recruiter_id) {
                const RecruiterProfile = require('../models/recruiterProfile');
                const recruiter = await RecruiterProfile.findByPk(recruiter_id);
                
                if (recruiter && recruiter.email) {
                    const mailOptions = {
                        from: process.env.MAIL_USERNAME,
                        to: recruiter.email,
                        subject: `New Job Application: ${jobExists.jobTitle}`,
                        html: `
                            <h2>New Job Application</h2>
                            <p><strong>Job Title:</strong> ${jobExists.jobTitle}</p>
                            <p><strong>Company:</strong> ${jobExists.companyName || 'N/A'}</p>
                            <p><strong>Candidate:</strong> ${candidate.first_name} ${candidate.last_name}</p>
                            <p><strong>Email:</strong> ${candidate.email}</p>
                            <p><strong>Applied on:</strong> ${new Date().toLocaleDateString()}</p>
                            <p>Login to the dashboard to review this application.</p>
                        `
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error('Error sending email to recruiter:', error);
                        } else {
                            console.log('Email sent to recruiter:', info.response);
                        }
                    });
                }
            }
        } catch (emailError) {
            console.error('Error sending notification to recruiter:', emailError);
        }

        res.status(200).json({ 
            success: true, 
            message: "Job application submitted successfully",
            application 
        });
    } catch (error) {
        console.error('Error applying for job:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error applying for job',
            error: error.message 
        });
    }
};


// Save a job for later
exports.saveJob = async (req, res) => {
    try {
        const { job_id } = req.params;
        const candidate_id = req.user.candidate_id;

        // Check if job exists
        const job = await JobPost.findByPk(job_id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if already saved
        const existingSave = await SavedJob.findOne({
            where: {
                job_id,
                candidate_id
            }
        });

        if (existingSave) {
            return res.status(400).json({
                success: false,
                message: 'Job already saved'
            });
        }

        // Save the job
        const savedJob = await SavedJob.create({
            job_id,
            candidate_id
        });

        res.status(201).json({
            success: true,
            message: 'Job saved successfully',
            savedJob
        });
    } catch (error) {
        console.error('Error saving job:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving job',
            error: error.message
        });
    }
};

// Unsave a job
exports.unsaveJob = async (req, res) => {
    try {
        const { job_id } = req.params;
        const candidate_id = req.user.candidate_id;

        const result = await SavedJob.destroy({
            where: {
                job_id,
                candidate_id
            }
        });

        if (result === 0) {
            return res.status(404).json({
                success: false,
                message: 'Saved job not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Job removed from saved jobs'
        });
    } catch (error) {
        console.error('Error removing saved job:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing saved job',
            error: error.message
        });
    }
};

// Get saved jobs
exports.getSavedJobs = async (req, res) => {
    try {
        const candidate_id = req.user.candidate_id;
        const { page = 1, limit = 10 } = req.query;
        
        const offset = (page - 1) * limit;

        const { count, rows } = await SavedJob.findAndCountAll({
            where: { candidate_id },
            include: [
                {
                    model: JobPost,
                    attributes: ['job_id', 'jobTitle', 'locations', 'companyName', 'min_salary', 'max_salary', 'jobDescription']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['saved_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            savedJobs: rows
        });
    } catch (error) {
        console.error('Error getting saved jobs:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting saved jobs',
            error: error.message
        });
    }
};


// Search jobs by location
exports.searchJobsByLocation = async (req, res) => {
    try {
        const { location } = req.query;
        if (!location) {
            return res.status(400).json({
                success: false,
                message: 'Location parameter is required'
            });
        }

        const jobs = await JobPost.findAll({
            where: {
                locations: { [Op.like]: `%${location}%` },
                status: 'approved',
                is_active: true
            },
            order: [['job_creation_date', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs: jobs
        });
    } catch (error) {
        console.error('Error searching jobs by location:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching jobs by location',
            error: error.message
        });
    }
};

// Method 1
exports.searchJobsByKeySkills = async (req, res) => {
    try {
        const { keySkills } = req.query;
        
        if (!keySkills) {
            return res.status(400).json({
                success: false,
                message: 'Key skills parameter is required'
            });
        }

        const jobs = await JobPost.findAll({
            where: {
                // Use keySkills instead of key_skills
                keySkills: {
                    [Op.like]: `%${keySkills}%`
                },
                status: 'approved',
                is_active: true
            },
            order: [['job_creation_date', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs: jobs
        });
    } catch (error) {
        console.error('Error searching jobs by key skills:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching jobs by key skills',
            error: error.message
        });
    }
};


// Search jobs by industry
exports.searchJobsByIndustry = async (req, res) => {
    try {
        const { industry } = req.query;
        if (!industry) {
            return res.status(400).json({
                success: false,
                message: 'Industry parameter is required'
            });
        }

        const jobs = await JobPost.findAll({
            where: {
                industry: { [Op.like]: `%${industry}%` },
                status: 'approved',
                is_active: true
            },
            order: [['job_creation_date', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs: jobs
        });
    } catch (error) {
        console.error('Error searching jobs by industry:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching jobs by industry',
            error: error.message
        });
    }
};

// Search jobs by salary range
exports.searchJobsBySalary = async (req, res) => {
    try {
        const { min_salary, max_salary } = req.query;
        if (!min_salary && !max_salary) {
            return res.status(400).json({
                success: false,
                message: 'At least one salary parameter is required'
            });
        }

        const whereClause = {
            status: 'approved',
            is_active: true
        };

        if (min_salary) {
            whereClause.min_salary = { [Op.gte]: parseFloat(min_salary) };
        }

        if (max_salary) {
            whereClause.max_salary = { [Op.lte]: parseFloat(max_salary) };
        }

        const jobs = await JobPost.findAll({
            where: whereClause,
            order: [['job_creation_date', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs: jobs
        });
    } catch (error) {
        console.error('Error searching jobs by salary:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching jobs by salary',
            error: error.message
        });
    }
};

// Search jobs by experience
exports.searchJobsByExperience = async (req, res) => {
    try {
        const { min_experience, max_experience } = req.query;
        if (!min_experience && !max_experience) {
            return res.status(400).json({
                success: false,
                message: 'At least one experience parameter is required'
            });
        }

        const whereClause = {
            status: 'approved',
            is_active: true
        };

        if (min_experience) {
            whereClause.min_experience = { [Op.gte]: parseInt(min_experience) };
        }

        if (max_experience) {
            whereClause.max_experience = { [Op.lte]: parseInt(max_experience) };
        }

        const jobs = await JobPost.findAll({
            where: whereClause,
            order: [['job_creation_date', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs: jobs
        });
    } catch (error) {
        console.error('Error searching jobs by experience:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching jobs by experience',
            error: error.message
        });
    }
};

// Search jobs by employment type
exports.searchJobsByEmploymentType = async (req, res) => {
    try {
        const { employmentType } = req.query;
        if (!employmentType) {
            return res.status(400).json({
                success: false,
                message: 'Employment type parameter is required'
            });
        }

        const jobs = await JobPost.findAll({
            where: {
                employmentType: { [Op.like]: `%${employmentType}%` },
                status: 'approved',
                is_active: true
            },
            order: [['job_creation_date', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs: jobs
        });
    } catch (error) {
        console.error('Error searching jobs by employment type:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching jobs by employment type',
            error: error.message
        });
    }
};

// Search jobs by company
exports.searchJobsByCompany = async (req, res) => {
    try {
        const { companyName } = req.query;
        if (!companyName) {
            return res.status(400).json({
                success: false,
                message: 'Company parameter is required'
            });
        }

        const jobs = await JobPost.findAll({
            where: {
                companyName: { [Op.like]: `%${companyName}%` },
                status: 'approved',
                is_active: true
            },
            order: [['job_creation_date', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs: jobs
        });
    } catch (error) {
        console.error('Error searching jobs by company:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching jobs by company',
            error: error.message
        });
    }
};

exports.searchJobsByDesignation = async (req, res) => {
    try {
      const { designation } = req.query;
  
      if (!designation) {
        return res.status(400).json({
          success: false,
          message: 'Designation parameter is required'
        });
      }
  
      const jobs = await JobPost.findAll({
        where: {
          jobTitle: {
            [Op.like]: `%${designation}%`
          },
          status: 'approved',
          is_active: true
        },
        order: [['job_creation_date', 'DESC']]
      });
  
      res.status(200).json({
        success: true,
        count: jobs.length,
        jobs: jobs
      });
    } catch (error) {
      console.error('Error searching jobs by designation:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching jobs by designation',
        error: error.message
      });
    }
  };
  // Combined search function
exports.searchJobs = async (req, res) => {
    try {
        const {
            location,
            industry,
            min_salary,
            max_salary,
            min_experience,
            max_experience,
            employmentType,
            company,
            jobTitle
        } = req.query;

        const whereClause = {
            status: 'approved',
            is_active: true
        };

        // Location
        if (location) {
            whereClause.locations = { [Op.like]: `%${location}%` };
        }

        // Industry
        if (industry) {
            whereClause.industry = { [Op.like]: `%${industry}%` };
        }

        // Job Title
        if (jobTitle) {
            whereClause.jobTitle = { [Op.like]: `%${jobTitle}%` };
        }

        // Salary range
        if (min_salary) {
            whereClause.min_salary = { [Op.gte]: parseFloat(min_salary) };
        }
        if (max_salary) {
            whereClause.max_salary = { [Op.lte]: parseFloat(max_salary) };
        }

        // Experience
        if (min_experience) {
            whereClause.min_experience = { [Op.gte]: parseInt(min_experience) };
        }
        if (max_experience) {
            whereClause.max_experience = { [Op.lte]: parseInt(max_experience) };
        }

        // Employment Type
        if (employmentType) {
            whereClause.employmentType = { [Op.like]: `%${employmentType}%` };
        }

        // Company
        if (company) {
            whereClause.companyName = { [Op.like]: `%${company}%` };
        }

        const jobs = await JobPost.findAll({
            where: whereClause,
            order: [['job_creation_date', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs: jobs
        });
    } catch (error) {
        console.error('Error searching jobs:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching jobs',
            error: error.message
        });
    }
};


  // Search jobs based on various criteria for candidates
exports.searchJobsWithAllParameter = async (req, res) => {
      try {
          const {
              keywords,
              //designation,
              //company,
              experience,
              locations
          } = req.query;
  
          const whereClause = {
              status: 'approved',
              is_active: true
          };
  
          // Search by keywords in job description and key skills
          if (keywords) {
            whereClause[Op.or] = [
                { jobDescription: { [Op.like]: `%${keywords}%` } },
                { keySkills: { [Op.like]: `%${keywords}%` } },
                { jobTitle: { [Op.like]: `%${keywords}%` } },
                { companyName: { [Op.like]: `%${keywords}%` } }
            ];
        }
          // Search by designation/job title
          /*if (designation) {
              whereClause.jobTitle = { [Op.like]: `%${designation}%` };
          }
  
          // Search by company
          if (company) {
              whereClause.companyName = { [Op.like]: `%${company}%` };
          }*/
  
          // Search by experience
          // If a specific experience value is provided, find jobs with mixmum experience <= the provided value
          if (experience) {
              const expValue = parseInt(experience);
              if (!isNaN(expValue)) {
                  whereClause.max_experience = { [Op.lte]: expValue };
              }
          }
  
          // Search by location
          if (locations) {
              whereClause.locations = { [Op.like]: `%${locations}%` };
          }
  
          // Find jobs matching the criteria
          const jobs = await JobPost.findAll({
              where: whereClause,
              order: [['createdAt', 'DESC']]
          });
  
          res.status(200).json({
              success: true,
              count: jobs.length,
              jobs: jobs
          });
      } catch (error) {
          console.error('Error searching jobs:', error);
          res.status(500).json({
              success: false,
              message: 'Error searching jobs',
              error: error.message
          });
      }
  };


  exports.getCandidateApplications = async (req, res) => {
    try {
      // Change from req.candidate.candidate_id to req.user.candidate_id
      const candidateId = req.user.candidate_id; 
      const { status, page = 1, limit = 10 } = req.query;
      
      const offset = (page - 1) * limit;
      
      // Build where clause with candidate ID
      const whereClause = { candidate_id: candidateId };
      
      // Add status filter if provided
      if (status && ['pending', 'reviewing', 'selected', 'rejected'].includes(status)) {
        whereClause.status = status;
      }
      
      // Find all applications by this candidate with pagination
      const { count, rows } = await JobApplication.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: JobPost,
            attributes: ['job_id', 'jobTitle', 'locations', 'jobDescription', 'job_creation_date']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['applied_at', 'DESC']]
      });
      
      return res.status(200).json({
        success: true,
        count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        applications: rows
      });
    } catch (error) {
      console.error('Error getting candidate applications:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting applications',
        error: error.message
      });
    }
  };
  
  // Get detailed information about a specific application
  exports.getCandidateApplicationDetail = async (req, res) => {
    try {
      // Change from req.candidate.candidate_id to req.user.candidate_id
      const candidateId = req.user.candidate_id;
      const { application_id } = req.params;
      
      // Find application with joins to job post and recruiter
      const application = await JobApplication.findOne({
        where: { 
          application_id,
          candidate_id: candidateId  // Ensures candidate can only see their own applications
        },
        include: [
          {
            model: JobPost,
            attributes: ['job_id', 'jobTitle', 'jobDescription', 'locations', 'job_creation_date', 'recruiter_id'],
            include: [
              {
                model: RecruiterProfile,
                attributes: ['company_name', 'industry', 'company_website']
              }
            ]
          }
        ]
      });
      
      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found or you do not have permission to view it'
        });
      }
      
      return res.status(200).json({
        success: true,
        application
      });
    } catch (error) {
      console.error('Error getting application details:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting application details',
        error: error.message
      });
    }
  };
  
  // Withdraw an application (candidate cancels their own application)
  exports.withdrawApplication = async (req, res) => {
    try {
      // Change from req.candidate.candidate_id to req.user.candidate_id
      const candidateId = req.user.candidate_id;
      const { application_id } = req.params;
      
      // Find the application
      const application = await JobApplication.findOne({
        where: { 
          application_id,
          candidate_id: candidateId  // Ensures candidate can only withdraw their own applications
        },
        include: [
          {
            model: JobPost,
            attributes: ['jobTitle']
          }
        ]
      });
      
      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found or you do not have permission to withdraw it'
        });
      }
      
      // Check if application can be withdrawn (only pending or reviewing applications)
      if (!['pending', 'reviewing'].includes(application.status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot withdraw application that is already ${application.status}`
        });
      }
      
      // Update application status to 'withdrawn'
      application.status = 'withdrawn';
      await application.save();
      
      return res.status(200).json({
        success: true,
        message: 'Application successfully withdrawn',
        application
      });
    } catch (error) {
      console.error('Error withdrawing application:', error);
      return res.status(500).json({
        success: false,
        message: 'Error withdrawing application',
        error: error.message
      });
    }
  };