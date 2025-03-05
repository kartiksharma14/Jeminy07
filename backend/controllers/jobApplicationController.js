/*const { Op } = require('sequelize');
const JobPost = require('../models/jobpost');
const Company = require('../models/company');
const RecruiterProfile = require('../models/recruiterProfile');
const CandidateProfile = require('../models/candidateProfile');
const JobApplication = require('../models/jobApplications');
const SavedJob = require('../models/savedJob');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
    // Configure your email service here
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Job search functionality
const searchJobs = async (req, res) => {
    try {
        const {
            keyword,
            location,
            company,
            experience,
            jobTitle,
            page = 1,
            limit = 10
        } = req.query;

        const offset = (page - 1) * limit;
        const whereClause = {};
        const companyWhereClause = {};

        if (keyword) {
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${keyword}%` } },
                { description: { [Op.like]: `%${keyword}%` } },
                { skills_required: { [Op.like]: `%${keyword}%` } }
            ];
        }

        if (location) {
            whereClause.location = { [Op.like]: `%${location}%` };
        }

        if (company) {
            companyWhereClause.company_name = { [Op.like]: `%${company}%` };
        }

        if (experience) {
            const expValues = experience.split('-');
            if (expValues.length === 2) {
                const [minExp, maxExp] = expValues;
                whereClause.experience_required = {
                    [Op.between]: [parseInt(minExp), parseInt(maxExp)]
                };
            } else {
                whereClause.experience_required = { [Op.like]: `%${experience}%` };
            }
        }

        if (jobTitle) {
            whereClause.title = { [Op.like]: `%${jobTitle}%` };
        }

        const { count, rows } = await JobPost.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Company,
                    where: companyWhereClause,
                    required: Object.keys(companyWhereClause).length > 0
                },
                {
                    model: RecruiterProfile,
                    attributes: ['recruiter_id', 'first_name', 'last_name'],
                    required: false
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['posted_date', 'DESC']]
        });

        // Check if jobs are saved by the candidate
        if (req.user && req.user.candidate_id) {
            const candidateId = req.user.candidate_id;
            const savedJobs = await SavedJob.findAll({
                where: { candidate_id: candidateId },
                attributes: ['job_id']
            });

            const savedJobIds = savedJobs.map(job => job.job_id);

            // Add isSaved property to each job
            rows.forEach(job => {
                job.dataValues.isSaved = savedJobIds.includes(job.job_id);
            });
        }

        return res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            jobs: rows
        });
    } catch (error) {
        console.error('Error searching jobs:', error);
        return res.status(500).json({
            success: false,
            message: 'Error searching jobs',
            error: error.message
        });
    }
};

// Get job details
const getJobDetails = async (req, res) => {
    try {
        const { jobId } = req.params;
        
        const job = await JobPost.findByPk(jobId, {
            include: [
                {
                    model: Company,
                    attributes: ['company_id', 'company_name', 'logo', 'company_website', 'industry']
                },
                {
                    model: RecruiterProfile,
                    attributes: ['recruiter_id', 'first_name', 'last_name', 'profile_picture']
                }
            ]
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if job is saved by the candidate
        if (req.user && req.user.candidate_id) {
            const candidateId = req.user.candidate_id;
            const savedJob = await SavedJob.findOne({
                where: {
                    job_id: jobId,
                    candidate_id: candidateId
                }
            });

            job.dataValues.isSaved = !!savedJob;

            // Check if the candidate has already applied
            const application = await JobApplication.findOne({
                where: {
                    job_id: jobId,
                    candidate_id: candidateId
                }
            });

            job.dataValues.hasApplied = !!application;
            if (application) {
                job.dataValues.applicationStatus = application.status;
            }
        }

        return res.status(200).json({
            success: true,
            job
        });
    } catch (error) {
        console.error('Error getting job details:', error);
        return res.status(500).json({
            success: false,
            message: 'Error getting job details',
            error: error.message
        });
    }
};

// Apply for a job
const applyForJob = async (req, res) => {
    try {
        const { job_id } = req.params;
        const candidateId = req.user.candidate_id;

        // Check if job exists
        const job = await JobPost.findByPk(job_id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if already applied
        const existingApplication = await JobApplication.findOne({
            where: {
                job_id: job_id,
                candidate_id: candidateId
            }
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }

        // Create job application
        const application = await JobApplication.create({
            job_id: job_id,
            candidate_id: candidateId,
            status: 'pending'
        });

        // Get candidate and job details for email
        const candidate = await CandidateProfile.findByPk(candidateId);
        const recruiter = await RecruiterProfile.findByPk(job.recruiter_id);

        // Send email notification to recruiter
        if (recruiter && recruiter.email) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: recruiter.email,
                subject: `New Job Application: ${job.title}`,
                html: `
                    <h2>New Job Application</h2>
                    <p><strong>Job Title:</strong> ${job.title}</p>
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

        return res.status(201).json({
            success: true,
            message: 'Job application submitted successfully',
            application
        });
    } catch (error) {
        console.error('Error applying for job:', error);
        return res.status(500).json({
            success: false,
            message: 'Error applying for job',
            error: error.message
        });
    }
};

// Get candidate's job applications
const getMyApplications = async (req, res) => {
    try {
        const candidateId = req.user.candidate_id;
        const { status, page = 1, limit = 10 } = req.query;
        
        const offset = (page - 1) * limit;
        const whereClause = { candidate_id: candidateId };
        
        if (status && ['pending', 'reviewing', 'selected', 'rejected'].includes(status)) {
            whereClause.status = status;
        }

        const { count, rows } = await JobApplication.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: JobPost,
                    include: [
                        {
                            model: Company,
                            attributes: ['company_id', 'company_name', 'logo']
                        }
                    ]
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
        console.error('Error getting applications:', error);
        return res.status(500).json({
            success: false,
            message: 'Error getting applications',
            error: error.message
        });
    }
};

// Get application details
const getApplicationDetails = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const candidateId = req.user.candidate_id;

        const application = await JobApplication.findOne({
            where: {
                application_id: applicationId,
                candidate_id: candidateId
            },
            include: [
                {
                    model: JobPost,
                    include: [
                        {
                            model: Company,
                            attributes: ['company_id', 'company_name', 'logo', 'company_website', 'industry']
                        },
                        {
                            model: RecruiterProfile,
                            attributes: ['recruiter_id', 'first_name', 'last_name', 'email', 'profile_picture']
                        }
                    ]
                }
            ]
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
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

// Save a job for later
const saveJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const candidateId = req.user.candidate_id;

        // Check if job exists
        const job = await JobPost.findByPk(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if already saved
        const existingSave = await SavedJob.findOne({
            where: {
                job_id: jobId,
                candidate_id: candidateId
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
            job_id: jobId,
            candidate_id: candidateId
        });

        return res.status(201).json({
            success: true,
            message: 'Job saved successfully',
            savedJob
        });
    } catch (error) {
        console.error('Error saving job:', error);
        return res.status(500).json({
            success: false,
            message: 'Error saving job',
            error: error.message
        });
    }
};

// Unsave a job
const unsaveJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const candidateId = req.user.candidate_id;

        const result = await SavedJob.destroy({
            where: {
                job_id: jobId,
                candidate_id: candidateId
            }
        });

        if (result === 0) {
            return res.status(404).json({
                success: false,
                message: 'Saved job not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Job removed from saved jobs'
        });
    } catch (error) {
        console.error('Error removing saved job:', error);
        return res.status(500).json({
            success: false,
            message: 'Error removing saved job',
            error: error.message
        });
    }
};

// Get saved jobs
const getSavedJobs = async (req, res) => {
    try {
        const candidateId = req.user.candidate_id;
        const { page = 1, limit = 10 } = req.query;
        
        const offset = (page - 1) * limit;

        const { count, rows } = await SavedJob.findAndCountAll({
            where: { candidate_id: candidateId },
            include: [
                {
                    model: JobPost,
                    include: [
                        {
                            model: Company,
                            attributes: ['company_id', 'company_name', 'logo']
                        }
                    ]
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['saved_at', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            savedJobs: rows
        });
    } catch (error) {
        console.error('Error getting saved jobs:', error);
        return res.status(500).json({
            success: false,
            message: 'Error getting saved jobs',
            error: error.message
        });
    }
};

// Function to send email notifications based on application status changes
const sendApplicationStatusEmail = async (application, status) => {
    try {
        const candidate = await CandidateProfile.findByPk(application.candidate_id);
        const job = await JobPost.findByPk(application.job_id, {
            include: [
                {
                    model: Company,
                    attributes: ['company_name']
                }
            ]
        });

        if (!candidate || !candidate.email || !job) return;

        const isSelected = status === 'selected';
        const subject = isSelected 
            ? `Congratulations! You've been selected for ${job.title}`
            : `Update on your application for ${job.title}`;
        
        const content = isSelected
            ? `
                <h2>Congratulations!</h2>
                <p>Dear ${candidate.first_name} ${candidate.last_name},</p>
                <p>We are pleased to inform you that you have been selected for the position of <strong>${job.title}</strong> at <strong>${job.Company?.company_name || 'our company'}</strong>.</p>
                <p>Our HR team will contact you shortly with the next steps.</p>
                <p>Thank you for your interest in joining our team!</p>
            `
            : `
                <h2>Application Update</h2>
                <p>Dear ${candidate.first_name} ${candidate.last_name},</p>
                <p>Thank you for applying for the position of <strong>${job.title}</strong> at <strong>${job.Company?.company_name || 'our company'}</strong>.</p>
                <p>After careful consideration, we regret to inform you that we have decided to move forward with other candidates whose qualifications better match our current needs.</p>
                <p>We appreciate your interest in our company and wish you success in your job search.</p>
            `;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: candidate.email,
            subject,
            html: content
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending application status email:', error);
            } else {
                console.log('Application status email sent:', info.response);
            }
        });
    } catch (error) {
        console.error('Error sending status email:', error);
    }
};

module.exports = {
    searchJobs,
    getJobDetails,
    applyForJob,
    getMyApplications,
    getApplicationDetails,
    saveJob,
    unsaveJob,
    getSavedJobs,
    sendApplicationStatusEmail
};*/

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

        res.status(201).json({ 
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

// Get candidate's job applications
exports.getMyApplications = async (req, res) => {
    try {
        const candidate_id = req.user.candidate_id;
        const { status, page = 1, limit = 10 } = req.query;
        
        const offset = (page - 1) * limit;
        const whereClause = { candidate_id };
        
        if (status && ['pending', 'reviewing', 'selected', 'rejected'].includes(status)) {
            whereClause.status = status;
        }

        const { count, rows } = await JobApplication.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: JobPost,
                    attributes: ['job_id', 'jobTitle', 'locations', 'companyName']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['applied_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            applications: rows
        });
    } catch (error) {
        console.error('Error getting applications:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting applications',
            error: error.message
        });
    }
};

// Get application details
exports.getApplicationDetails = async (req, res) => {
    try {
        const { application_id } = req.params;
        const candidate_id = req.user.candidate_id;

        const application = await JobApplication.findOne({
            where: {
                application_id,
                candidate_id
            },
            include: [
                {
                    model: JobPost,
                    attributes: ['job_id', 'jobTitle', 'description', 'locations', 'companyName', 'salary_range', 'job_creation_date'],
                    include: [
                        {
                            model: require('../models/recruiterProfile'),
                            attributes: ['recruiter_id', 'first_name', 'last_name', 'email', 'profile_picture']
                        }
                    ]
                }
            ]
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.status(200).json({
            success: true,
            application
        });
    } catch (error) {
        console.error('Error getting application details:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting application details',
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
                    attributes: ['job_id', 'jobTitle', 'locations', 'companyName', 'salary_range', 'description']
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
          key_skills: {
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
        const { company } = req.query;
        if (!company) {
            return res.status(400).json({
                success: false,
                message: 'Company parameter is required'
            });
        }

        const jobs = await JobPost.findAll({
            where: {
                companyName: { [Op.like]: `%${company}%` },
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