// controllers/recruiterController.js
const OTP = require('../models/otp');
const RecruiterSignin = require('../models/recruiterSignin');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const JobPost = require('../models/jobpost');
const JobApplication = require('../models/jobApplications');
const CandidateProfile = require('../models/candidateProfile');
const User = require('../models/user');
const TempJobPost = require('../models/TempJobPost');
const ClientSubscription = require('../models/clientSubscription');
const ClientLoginDevice = require('../models/clientLoginDevice');
const CVDownloadTracker = require('../models/cvDownloadTracker');
const MasterClient = require('../models/masterClient'); 
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { sequelize } = require('../db');
const { Op } = require('sequelize');
const cities = require('../data/cities.json');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD.replace(/\s+/g, '') // Remove any spaces in the password
  },
  secure: true,
  tls: {
    rejectUnauthorized: false
  },
  debug: true // Show debug output for troubleshooting
});

const { JWT_SECRET } = process.env;

// Validation function for cities
function validateCity(cityName) {
  if (!cityName) return null;
  
  // Extract just the city name if format contains a comma
  const cityToCheck = cityName.split(',')[0].trim().toLowerCase();
  
  // Check if the city exists in cities.json
  const cityFound = cities.cities.find(
    city => city.City.toLowerCase() === cityToCheck
  );
  
  if (cityFound) {
    // Return just the city name
    return cityFound.City;
  }
  
  return null;
}


exports.loginRecruiter = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find the recruiter with the provided email and include client information
    const recruiter = await RecruiterSignin.findOne({ 
      where: { email },
      include: [
        {
          model: MasterClient,
          as: 'client',
          attributes: ['client_id', 'client_name']
        }
      ]
    });
    
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
    
    // Check if client has active subscription
    if (recruiter.client_id) {
      const subscription = await ClientSubscription.findOne({
        where: {
          client_id: recruiter.client_id,
          is_active: true
        }
      });

      if (!subscription) {
        return res.status(403).json({
          message: 'Your client does not have an active subscription. Please contact admin.'
        });
      }
      
      // Check if client has reached the allowed number of recruiters/logins
      const activeRecruiters = await RecruiterSignin.count({
        where: { 
          client_id: recruiter.client_id,
          is_active: true
        }
      });
      
      if (activeRecruiters > subscription.login_allowed) {
        return res.status(403).json({ 
          message: `Maximum number of allowed logins reached for your company. Please contact admin.`
        });
      }
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
      // Include client info in response
      client: recruiter.client ? {
        client_id: recruiter.client.client_id,
        client_name: recruiter.client.client_name
      } : null
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Error during login', error: error.message });
  }
};

// Get candidate profile details with user information and track the view
exports.getCandidateProfile = async (req, res) => {
  try {
    const { candidate_id } = req.params;
    const recruiterId = req.recruiter.recruiter_id;
    const { job_id } = req.query; // Optional job_id parameter
    
    if (!candidate_id) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required"
      });
    }

    // First, check if this recruiter has any jobs that the candidate has applied to
    const candidateApplications = await JobApplication.findOne({
      where: { candidate_id },
      include: [
        {
          model: JobPost,
          where: { recruiter_id: recruiterId },
          attributes: ['job_id']
        }
      ]
    });

    if (!candidateApplications) {
      return res.status(403).json({
        success: false,
        message: "You can only view profiles of candidates who have applied to your job postings"
      });
    }

    // Get the candidate profile data
    const candidateProfile = await CandidateProfile.findOne({
      where: { candidate_id }
    });

    if (!candidateProfile) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found"
      });
    }

    // Get user information from signin table
    const userInfo = await User.findOne({
      where: { candidate_id },
      attributes: ['name', 'email']
    });

    // Combine the candidate profile with user information
    const profileData = candidateProfile.toJSON();
    
    if (userInfo) {
      // Add user info from signin table
      profileData.name = userInfo.name;
      profileData.email = userInfo.email;
    }

    // Check if recruiter has an active subscription with CV quota
    const subscription = await ClientSubscription.findOne({
      where: {
        client_id: recruiterId,
        is_active: true,
        start_date: { [Op.lte]: new Date() },
        end_date: { 
          [Op.or]: [
            { [Op.is]: null }, // No end date (unlimited)
            { [Op.gte]: new Date() } // End date is in the future
          ]
        }
      }
    });

    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: "You don't have an active subscription. Please contact admin.",
        errorCode: 'NO_ACTIVE_SUBSCRIPTION'
      });
    }

    // Check if recruiter has exceeded their CV view quota
    // First, count how many CVs they've viewed this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const viewsThisMonth = await CVViewTracker.count({
      where: {
        recruiter_id: recruiterId,
        view_date: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      }
    });

    // Check if already viewed this CV this month to avoid double counting
    const alreadyViewedThisMonth = await CVViewTracker.findOne({
      where: {
        recruiter_id: recruiterId,
        candidate_id,
        view_date: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      }
    });

    if (!alreadyViewedThisMonth) {
      // If haven't viewed this CV this month, check quota
      if (viewsThisMonth >= subscription.cv_download_quota && subscription.cv_download_quota > 0) {
        return res.status(403).json({
          success: false,
          message: `You have reached your CV view limit (${subscription.cv_download_quota}) for this month. Please contact admin to increase your quota.`,
          errorCode: 'CV_QUOTA_EXCEEDED',
          quota: {
            total: subscription.cv_download_quota,
            used: viewsThisMonth,
            remaining: 0
          }
        });
      }

      // Track this CV view
      await CVViewTracker.create({
        recruiter_id: recruiterId,
        candidate_id,
        job_id: job_id || candidateApplications.JobPost.job_id,
        view_date: new Date()
      });
    }

    // Calculate remaining quota
    const remainingQuota = subscription.cv_download_quota > 0 
      ? subscription.cv_download_quota - viewsThisMonth 
      : null; // null means unlimited

    // Return combined profile with quota information
    return res.status(200).json({
      success: true,
      candidateProfile: profileData,
      quota: {
        total: subscription.cv_download_quota,
        used: viewsThisMonth,
        remaining: remainingQuota
      }
    });
  } catch (error) {
    console.error('Error fetching candidate profile:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching candidate profile",
      error: error.message
    });
  }
};

// Get candidate profile details with user information and track the view
exports.getCandidateProfile = async (req, res) => {
  try {
    const { candidate_id } = req.params;
    const recruiterId = req.recruiter.recruiter_id;
    const { job_id } = req.query; // Optional job_id parameter
    
    if (!candidate_id) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required"
      });
    }

    // First, check if this recruiter has any jobs that the candidate has applied to
    const candidateApplications = await JobApplication.findOne({
      where: { candidate_id },
      include: [
        {
          model: JobPost,
          where: { recruiter_id: recruiterId },
          attributes: ['job_id']
        }
      ]
    });

    if (!candidateApplications) {
      return res.status(403).json({
        success: false,
        message: "You can only view profiles of candidates who have applied to your job postings"
      });
    }

    // Get the candidate profile data
    const candidateProfile = await CandidateProfile.findOne({
      where: { candidate_id }
    });

    if (!candidateProfile) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found"
      });
    }

    // Get user information from signin table
    const userInfo = await User.findOne({
      where: { candidate_id },
      attributes: ['name', 'email']
    });

    // Combine the candidate profile with user information
    const profileData = candidateProfile.toJSON();
    
    if (userInfo) {
      // Add user info from signin table
      profileData.name = userInfo.name;
      profileData.email = userInfo.email;
    }

    // Check if recruiter has an active subscription with CV quota
    const subscription = await ClientSubscription.findOne({
      where: {
        client_id: recruiterId,
        is_active: true,
        start_date: { [Op.lte]: new Date() },
        end_date: { 
          [Op.or]: [
            { [Op.is]: null }, // No end date (unlimited)
            { [Op.gte]: new Date() } // End date is in the future
          ]
        }
      }
    });

    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: "You don't have an active subscription. Please contact admin.",
        errorCode: 'NO_ACTIVE_SUBSCRIPTION'
      });
    }

    // Check if recruiter has exceeded their CV view quota
    // First, count how many CVs they've viewed this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const viewsThisMonth = await CVViewTracker.count({
      where: {
        recruiter_id: recruiterId,
        view_date: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      }
    });

    // Check if already viewed this CV this month to avoid double counting
    const alreadyViewedThisMonth = await CVViewTracker.findOne({
      where: {
        recruiter_id: recruiterId,
        candidate_id,
        view_date: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      }
    });

    if (!alreadyViewedThisMonth) {
      // If haven't viewed this CV this month, check quota
      if (viewsThisMonth >= subscription.cv_download_quota && subscription.cv_download_quota > 0) {
        return res.status(403).json({
          success: false,
          message: `You have reached your CV view limit (${subscription.cv_download_quota}) for this month. Please contact admin to increase your quota.`,
          errorCode: 'CV_QUOTA_EXCEEDED',
          quota: {
            total: subscription.cv_download_quota,
            used: viewsThisMonth,
            remaining: 0
          }
        });
      }

      // Track this CV view
      await CVViewTracker.create({
        recruiter_id: recruiterId,
        candidate_id,
        job_id: job_id || candidateApplications.JobPost.job_id,
        view_date: new Date()
      });
    }

    // Calculate remaining quota
    const remainingQuota = subscription.cv_download_quota > 0 
      ? subscription.cv_download_quota - viewsThisMonth 
      : null; // null means unlimited

    // Return combined profile with quota information
    return res.status(200).json({
      success: true,
      candidateProfile: profileData,
      quota: {
        total: subscription.cv_download_quota,
        used: viewsThisMonth,
        remaining: remainingQuota
      }
    });
  } catch (error) {
    console.error('Error fetching candidate profile:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching candidate profile",
      error: error.message
    });
  }
};

// Add middleware for tracking device activity and refreshing last_login timestamp
exports.refreshDeviceActivity = async (req, res, next) => {
  try {
    if (!req.recruiter || !req.recruiter.login_id) {
      return next();
    }
    
    const recruiterId = req.recruiter.recruiter_id;
    const loginId = req.recruiter.login_id;
    
    // Update the last_login timestamp for this device
    await ClientLoginDevice.update(
      { last_login: new Date() },
      { 
        where: { 
          client_id: recruiterId,
          login_id: loginId,
          is_active: true
        }
      }
    );
    
    next();
  } catch (error) {
    console.error('Error refreshing device activity:', error);
    next(); // Continue to the next middleware even if this fails
  }
};

// Helper function to format dates
function formatDate(date) {
  if (!date) return null;
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

// Update Recruiter Password (by recruiter themselves)
exports.updateRecruiterPassword = async (req, res) => {
    const recruiterId = req.recruiter.recruiter_id; // Get recruiter ID from JWT token
    const { currentPassword, newPassword } = req.body;
  
    try {
      // Input validation
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required"
        });
      }
  
      // Password strength validation
      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 8 characters long"
        });
      }
  
      // Find the recruiter by ID - using RecruiterSignin model, not Recruiter
      const recruiter = await RecruiterSignin.findByPk(recruiterId);
      if (!recruiter) {
        return res.status(404).json({ 
          success: false, 
          message: "Recruiter not found" 
        });
      }
  
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, recruiter.password);
      if (!isMatch) {
        return res.status(400).json({ 
          success: false, 
          message: "Current password is incorrect" 
        });
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update password
      recruiter.password = hashedPassword;
      await recruiter.save();
  
      res.status(200).json({
        success: true,
        message: "Password updated successfully"
      });
    } catch (err) {
      console.error('Error updating recruiter password:', err);
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
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
  

exports.getAllJobDrafts = async (req, res) => {
  try {
    // Get recruiter ID from the token
    const recruiter_id = req.recruiter.recruiter_id;
    
    if (!recruiter_id) {
      return res.status(400).json({
        success: false,
        message: 'Recruiter ID is required'
      });
    }
    
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await TempJobPost.count({
      where: {
        recruiter_id: recruiter_id
      }
    });
    
    // Fetch all draft jobs for this recruiter with pagination
    // Assuming drafts are stored in TempJobPost while published jobs are in JobPost
    const draftJobs = await TempJobPost.findAll({
      where: {
        recruiter_id: recruiter_id
      },
      order: [['updatedAt', 'DESC']],
      limit: limit,
      offset: offset
    });
    
    if (draftJobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No draft jobs found'
      });
    }
    
    return res.status(200).json({
      success: true,
      count: draftJobs.length,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      draftJobs: draftJobs
    });
  } catch (error) {
    console.error('Error fetching draft jobs:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching draft jobs',
      error: error.message
    });
  }
};


// Helper function to format date in DD/MM/YY format
const formatDateToDDMMYY = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

// Helper function to validate text length
const validateTextLength = (text, fieldName, maxLength = 3000) => {
  if (!text) return { valid: true };
  
  if (text.length > maxLength) {
    return { 
      valid: false, 
      message: `${fieldName} cannot exceed ${maxLength} characters. Current length: ${text.length} characters.`
    };
  }
  
  return { valid: true };
};

exports.createJobFromDraft = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { session_id, end_date } = req.body;
    
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

    // Validate location against cities.json
    const validatedLocation = validateCity(jobDraft.locations);
    if (!validatedLocation) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid location in draft. Please provide a valid city name."
      });
    }

    // Validate character limits
    const jobDescriptionValidation = validateTextLength(
      jobDraft.jobDescription, 
      'Job description'
    );
    
    if (!jobDescriptionValidation.valid) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: jobDescriptionValidation.message
      });
    }
    
    const companyInfoValidation = validateTextLength(
      jobDraft.companyInfo, 
      'Company information'
    );
    
    if (!companyInfoValidation.valid) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: companyInfoValidation.message
      });
    }

    // Format the end date or use default (30 days from now)
    let formattedEndDate;
    if (end_date) {
      formattedEndDate = formatDateToDDMMYY(end_date);
    } else {
      const defaultEndDate = new Date();
      defaultEndDate.setDate(defaultEndDate.getDate() + 30); // Default 30 days from now
      formattedEndDate = formatDateToDDMMYY(defaultEndDate);
    }

    // Create the permanent job post
    const newJob = await JobPost.create({
      recruiter_id,
      jobTitle: jobDraft.jobTitle,
      employmentType: jobDraft.employmentType,
      keySkills: jobDraft.keySkills,
      department: jobDraft.department,
      workMode: jobDraft.workMode,
      locations: validatedLocation, // Use the validated location
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
      end_date: formattedEndDate, // Add the end_date field
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
      companyAddress, min_salary, max_salary, min_experience, max_experience, end_date
    } = req.body;

    // Validate required fields
    if (!jobTitle || !employmentType || !keySkills || !department || !workMode || !locations || !jobDescription) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Missing required fields for job draft"
      });
    }

    // Validate character limits
    const jobDescriptionValidation = validateTextLength(
      jobDescription, 
      'Job description'
    );
    
    if (!jobDescriptionValidation.valid) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: jobDescriptionValidation.message
      });
    }
    
    const companyInfoValidation = validateTextLength(
      companyInfo, 
      'Company information'
    );
    
    if (!companyInfoValidation.valid) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: companyInfoValidation.message
      });
    }

    // Validate location against cities.json
    const validatedLocation = validateCity(locations);
    if (!validatedLocation) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid location. Please provide a valid city name."
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

    // Format the end date or use default (30 days from now)
    let formattedEndDate;
    if (end_date) {
      formattedEndDate = formatDateToDDMMYY(end_date);
    } else {
      const defaultEndDate = new Date();
      defaultEndDate.setDate(defaultEndDate.getDate() + 30); // Default 30 days from now
      formattedEndDate = formatDateToDDMMYY(defaultEndDate);
    }

    // Create new draft
    const jobDraft = await TempJobPost.create({
      session_id: sessionId,
      recruiter_id,
      jobTitle, 
      employmentType, 
      keySkills, 
      department, 
      workMode, 
      locations: validatedLocation, // Use the validated location
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
      end_date: formattedEndDate, // Add the end_date field
      created_by: recruiter_id,
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
      companyAddress, min_salary, max_salary, min_experience, max_experience, end_date
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

    // Validate character limits if fields are being updated
    if (jobDescription) {
      const jobDescriptionValidation = validateTextLength(
        jobDescription, 
        'Job description'
      );
      
      if (!jobDescriptionValidation.valid) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: jobDescriptionValidation.message
        });
      }
    }
    
    if (companyInfo) {
      const companyInfoValidation = validateTextLength(
        companyInfo, 
        'Company information'
      );
      
      if (!companyInfoValidation.valid) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: companyInfoValidation.message
        });
      }
    }

    // Validate location against cities.json if location field is being updated
    let validatedLocation = existingDraft.locations; // Keep existing if not updating
    if (locations) {
      validatedLocation = validateCity(locations);
      if (!validatedLocation) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Invalid location. Please provide a valid city name."
        });
      }
    }

    // Format the end date if provided
    let formattedEndDate = existingDraft.end_date; // Keep existing if not updating
    if (end_date) {
      formattedEndDate = formatDateToDDMMYY(end_date);
    }

    // Update draft
    const updatedDraft = await existingDraft.update({
      jobTitle: jobTitle || existingDraft.jobTitle, 
      employmentType: employmentType || existingDraft.employmentType, 
      keySkills: keySkills || existingDraft.keySkills, 
      department: department || existingDraft.department, 
      workMode: workMode || existingDraft.workMode, 
      locations: validatedLocation,
      industry: industry || existingDraft.industry,
      diversityHiring: diversityHiring !== undefined ? diversityHiring : existingDraft.diversityHiring, 
      jobDescription: jobDescription || existingDraft.jobDescription, 
      multipleVacancies: multipleVacancies !== undefined ? multipleVacancies : existingDraft.multipleVacancies, 
      companyName: companyName || existingDraft.companyName, 
      companyInfo: companyInfo || existingDraft.companyInfo,
      companyAddress: companyAddress || existingDraft.companyAddress, 
      min_salary: min_salary || existingDraft.min_salary, 
      max_salary: max_salary || existingDraft.max_salary, 
      min_experience: min_experience !== undefined ? min_experience : existingDraft.min_experience, 
      max_experience: max_experience !== undefined ? max_experience : existingDraft.max_experience,
      end_date: formattedEndDate, // Add the end_date field
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

        // Validate location against cities.json
        const validatedLocation = validateCity(locations);
        if (!validatedLocation) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Invalid location. Please provide a valid city name."
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
            jobTitle, 
            employmentType, 
            keySkills, 
            department, 
            workMode, 
            locations: validatedLocation, // Use the validated location
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
      
      // Pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Get total count for pagination
      const totalCount = await JobPost.count({
          where: { 
              recruiter_id,
              is_active: true 
          }
      });

      const jobs = await JobPost.findAll({
          where: { 
              recruiter_id,
              is_active: true 
          },
          order: [['job_creation_date', 'DESC']],
          limit: limit,
          offset: offset
      });
      
      return res.status(200).json({
          success: true,
          count: jobs.length,
          totalCount: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
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
        
        // Check if locations is being updated
        const { locations } = req.body;
        let updatedData = { ...req.body };
        
        if (locations) {
            // Validate location against cities.json
            const validatedLocation = validateCity(locations);
            if (!validatedLocation) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: "Invalid location. Please provide a valid city name."
                });
            }
            updatedData.locations = validatedLocation;
        }
        
        // Update job post with new data
        await job.update(updatedData, { transaction });
        
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
      
      // Pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Get total count for pagination
      const totalCount = await JobPost.count({
          where: { recruiter_id: recruiterId }
      });

      const jobs = await JobPost.findAll({
          where: { recruiter_id: recruiterId },
          attributes: ["job_id", "jobTitle", "status", "job_creation_date", "is_active", "locations"],
          order: [['job_creation_date', 'DESC']],
          limit: limit,
          offset: offset
      });

      return res.status(200).json({ 
          success: true, 
          count: jobs.length,
          totalCount: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
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



exports.getPendingJobs = async (req, res) => {
  try {
      if (!req.recruiter || !req.recruiter.recruiter_id) {
          return res.status(401).json({ 
              success: false, 
              message: "Authentication required. Please log in again." 
          });
      }

      const recruiterId = req.recruiter.recruiter_id;
      
      // Pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Get total count for pagination
      const totalCount = await JobPost.count({
          where: { 
              recruiter_id: recruiterId, 
              status: "pending",
              is_active: true 
          }
      });

      const pendingJobs = await JobPost.findAll({
          where: { 
              recruiter_id: recruiterId, 
              status: "pending",
              is_active: true 
          },
          order: [['job_creation_date', 'DESC']],
          limit: limit,
          offset: offset
      });

      return res.status(200).json({ 
          success: true, 
          count: pendingJobs.length,
          totalCount: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
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


exports.getApprovedJobs = async (req, res) => {
  try {
      if (!req.recruiter || !req.recruiter.recruiter_id) {
          return res.status(401).json({ 
              success: false, 
              message: "Authentication required. Please log in again." 
          });
      }

      const recruiterId = req.recruiter.recruiter_id;
      
      // Pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Get total count for pagination
      const totalCount = await JobPost.count({
          where: { 
              recruiter_id: recruiterId, 
              status: "approved",
              is_active: true 
          }
      });

      const approvedJobs = await JobPost.findAll({
          where: { 
              recruiter_id: recruiterId, 
              status: "approved",
              is_active: true 
          },
          order: [['job_creation_date', 'DESC']],
          limit: limit,
          offset: offset
      });

      return res.status(200).json({ 
          success: true, 
          count: approvedJobs.length,
          totalCount: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
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


exports.getRejectedJobs = async (req, res) => {
  try {
      if (!req.recruiter || !req.recruiter.recruiter_id) {
          return res.status(401).json({ 
              success: false, 
              message: "Authentication required. Please log in again." 
          });
      }

      const recruiterId = req.recruiter.recruiter_id;
      
      // Pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Get total count for pagination
      const totalCount = await JobPost.count({
          where: { 
              recruiter_id: recruiterId, 
              status: "rejected",
              is_active: true
          }
      });

      const rejectedJobs = await JobPost.findAll({
          where: { 
              recruiter_id: recruiterId, 
              status: "rejected",
              is_active: true
          },
          order: [['job_creation_date', 'DESC']],
          limit: limit,
          offset: offset
      });

      return res.status(200).json({ 
          success: true,
          count: rejectedJobs.length,
          totalCount: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
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



// Get the most recent job for a recruiter (regardless of status)
exports.getMostRecentJob = async (req, res) => {
  try {
    console.log("Token Payload: ", req.recruiter);

    // Get recruiter ID from auth token
    const recruiterId = req.recruiter.recruiter_id;
    
    // Find the most recently updated job (both approved and rejected)
    const job = await JobPost.findOne({
      where: {
        recruiter_id: recruiterId,
        status: {
          [Op.or]: ['approved', 'rejected', 'pending'] // Include all possible statuses
        },
        is_active: true
      },
      order: [['updatedAt', 'DESC']], // Most recently updated first
      attributes: [
        'job_id',
        'jobTitle',
        'locations',
        'updatedAt',
        'companyName',
        'status',
        'rejection_reason'
      ]
    });
    
    // If no job found, return appropriate response
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "No recent jobs found"
      });
    }
    
    // Get total number of applications for this job if it's approved
    let applicationCount = 0;
    if (job.status === 'approved') {
      applicationCount = await JobApplication.count({
        where: { job_id: job.job_id }
      });
    }
    
    // Format the date to DD/MM/YY
    const jobData = job.toJSON();
    
    // Format updatedAt date
    const updatedDate = new Date(jobData.updatedAt);
    const formattedDate = `${String(updatedDate.getDate()).padStart(2, '0')}/${String(updatedDate.getMonth() + 1).padStart(2, '0')}/${String(updatedDate.getFullYear()).slice(-2)}`;
    
    // Return the most recent job with application count and formatted date
    return res.status(200).json({
      success: true,
      job: {
        ...jobData,
        updatedAt: formattedDate,
        applicationCount
      }
    });
  } catch (error) {
    console.error('Error fetching most recent job:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching most recent job',
      error: error.message
    });
  }
};


// Get all jobs for a recruiter regardless of status with formatted dates
exports.getAllJobs = async (req, res) => {
  try {
    // Get recruiter ID from auth token
    const recruiterId = req.recruiter.recruiter_id;
    
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await JobPost.count({
      where: {
        recruiter_id: recruiterId,
        is_active: true
      }
    });
    
    // Find all active jobs for this recruiter
    const jobs = await JobPost.findAll({
      where: {
        recruiter_id: recruiterId,
        is_active: true
      },
      order: [['updatedAt', 'DESC']], // Most recently updated first
      attributes: [
        'job_id',
        'jobTitle',
        'locations',
        'updatedAt',
        'companyName',
        'status',
        'rejection_reason'
      ],
      limit: limit,
      offset: offset
    });
    
    // If no jobs found, return appropriate response
    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No jobs found"
      });
    }
    
    // Process each job to add application count and format date
    const processedJobs = await Promise.all(jobs.map(async (job) => {
      const jobData = job.toJSON();
      
      // Format updatedAt date
      const updatedDate = new Date(jobData.updatedAt);
      const formattedDate = `${String(updatedDate.getDate()).padStart(2, '0')}/${String(updatedDate.getMonth() + 1).padStart(2, '0')}/${String(updatedDate.getFullYear()).slice(-2)}`;
      
      // Get application count - only count if job is approved
      let applicationCount = 0;
      if (job.status === 'approved') {
        applicationCount = await JobApplication.count({
          where: { job_id: job.job_id }
        });
      }
      
      return {
        ...jobData,
        updatedAt: formattedDate,
        applicationCount
      };
    }));
    
    // Return all jobs with application counts and formatted dates
    return res.status(200).json({
      success: true,
      count: processedJobs.length,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      jobs: processedJobs
    });
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching all jobs',
      error: error.message
    });
  }
};


// Verify OTP and generate JWT token with session limiting
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
    
    // Check if the account is locked
    if (recruiter.is_locked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been locked. Please contact an administrator.'
      });
    }
    
    // Generate a unique login ID for this session
    const loginId = `login_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    
    // Check for active subscription
    const subscription = await ClientSubscription.findOne({
      where: {
        client_id: recruiter.client_id,
        is_active: true,
        start_date: { [Op.lte]: new Date() },
        end_date: { 
          [Op.or]: [
            { [Op.is]: null }, // No end date (unlimited)
            { [Op.gte]: new Date() } // End date is in the future
          ]
        }
      }
    });
    
    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: 'You do not have an active subscription. Please contact admin.',
        errorCode: 'NO_ACTIVE_SUBSCRIPTION'
      });
    }
    
    // Count active sessions for this recruiter
    const activeSessionCount = await ClientLoginDevice.count({
      where: {
        client_id: recruiter.client_id,
        is_active: true
      }
    });
    
    // Check if recruiter has reached session limit
    if (activeSessionCount >= subscription.login_allowed) {
      // Get list of active sessions for informational purposes
      const activeSessions = await ClientLoginDevice.findAll({
        where: {
          client_id: recruiter.client_id,
          is_active: true
        },
        attributes: ['device_id', 'last_login'],
        order: [['last_login', 'DESC']]
      });
      
      // Format the sessions for display
      const formattedSessions = activeSessions.map(session => {
        const lastLogin = new Date(session.last_login);
        const formattedDate = `${lastLogin.toLocaleDateString()} ${lastLogin.toLocaleTimeString()}`;
        
        return {
          session_id: session.device_id,
          last_login: formattedDate
        };
      });
      
      return res.status(403).json({
        success: false,
        message: `Maximum number of sessions (${subscription.login_allowed}) already active. Please log out from another session or contact admin.`,
        errorCode: 'SESSION_LIMIT_REACHED',
        activeSessions: formattedSessions
      });
    }
    
    // Register new session
    await ClientLoginDevice.create({
      client_id: recruiter.client_id,
      login_id: loginId,
      start_date: new Date(),
      end_date: subscription.end_date,
      last_login: new Date(),
      is_active: true
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        recruiter_id: recruiter.recruiter_id, 
        email,
        name: recruiter.name,
        company_name: recruiter.company_name,
        login_id: loginId // Include login_id in token for session tracking
      },
      JWT_SECRET,
      { expiresIn: '24000h' }
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

// Add middleware for tracking session activity and refreshing last_login timestamp
exports.refreshSessionActivity = async (req, res, next) => {
  try {
    if (!req.recruiter || !req.recruiter.login_id) {
      return next();
    }
    
    const recruiterId = req.recruiter.recruiter_id;
    const loginId = req.recruiter.login_id;
    
    // Update the last_login timestamp for this session
    await ClientLoginDevice.update(
      { last_login: new Date() },
      { 
        where: { 
          client_id: recruiterId,
          login_id: loginId,
          is_active: true
        }
      }
    );
    
    next();
  } catch (error) {
    console.error('Error refreshing session activity:', error);
    next(); // Continue to the next middleware even if this fails
  }
};

// Add a function to handle session logout
exports.logoutSession = async (req, res) => {
  try {
    const recruiterId = req.recruiter.recruiter_id;
    const loginId = req.recruiter.login_id;
    
    // Get the recruiter to find their client_id
    const recruiter = await RecruiterSignin.findByPk(recruiterId);
    if (!recruiter || !recruiter.client_id) {
      return res.status(400).json({
        success: false,
        message: 'Unable to determine client ID for this session'
      });
    }
    
    // Find the current session using the correct client_id
    const session = await ClientLoginDevice.findOne({
      where: {
        client_id: recruiter.client_id,  // Use the client_id from the recruiter
        login_id: loginId,
        is_active: true
      }
    });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    // Deactivate the session
    await session.update({
      is_active: false,
      end_date: new Date()
    });
    
    return res.status(200).json({
      success: true,
      message: 'Successfully logged out'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: error.message
    });
  }
};


// Download candidate resume with CV quota tracking
exports.downloadCandidateResume = async (req, res) => {
  try {
    const { candidate_id } = req.params;
    const recruiterId = req.recruiter.recruiter_id;
    const { job_id } = req.query; // Optional job_id parameter
    
    if (!candidate_id) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required"
      });
    }

    // First, check if this recruiter has any jobs that the candidate has applied to
    const candidateApplications = await JobApplication.findOne({
      where: { candidate_id },
      include: [
        {
          model: JobPost,
          where: { recruiter_id: recruiterId },
          attributes: ['job_id']
        }
      ]
    });

    if (!candidateApplications) {
      return res.status(403).json({
        success: false,
        message: "You can only download resumes of candidates who have applied to your job postings"
      });
    }

    // Get the candidate profile with resume path
    const candidateProfile = await CandidateProfile.findOne({
      where: { candidate_id },
      attributes: ['candidate_id', 'resume']
    });

    if (!candidateProfile || !candidateProfile.resume) {
      return res.status(404).json({
        success: false,
        message: "Candidate resume not found"
      });
    }

    // Check if recruiter has an active subscription with CV quota
    const subscription = await ClientSubscription.findOne({
      where: {
        client_id: recruiterId,
        is_active: true,
        start_date: { [Op.lte]: new Date() },
        end_date: { 
          [Op.or]: [
            { [Op.is]: null }, // No end date (unlimited)
            { [Op.gte]: new Date() } // End date is in the future
          ]
        }
      }
    });

    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: "You don't have an active subscription. Please contact admin.",
        errorCode: 'NO_ACTIVE_SUBSCRIPTION'
      });
    }

    // Check if recruiter has exceeded their CV download quota
    // First, count how many CVs they've downloaded this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const downloadsThisMonth = await CVDownloadTracker.count({
      where: {
        recruiter_id: recruiterId,
        download_date: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      }
    });

    // Check if already downloaded this CV this month to avoid double counting
    const alreadyDownloadedThisMonth = await CVDownloadTracker.findOne({
      where: {
        recruiter_id: recruiterId,
        candidate_id,
        download_date: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      }
    });

    if (!alreadyDownloadedThisMonth) {
      // If haven't downloaded this CV this month, check quota
      if (downloadsThisMonth >= subscription.cv_download_quota && subscription.cv_download_quota > 0) {
        return res.status(403).json({
          success: false,
          message: `You have reached your CV download limit (${subscription.cv_download_quota}) for this month. Please contact admin to increase your quota.`,
          errorCode: 'CV_QUOTA_EXCEEDED',
          quota: {
            total: subscription.cv_download_quota,
            used: downloadsThisMonth,
            remaining: 0
          }
        });
      }

      // Track this CV download
      await CVDownloadTracker.create({
        recruiter_id: recruiterId,
        candidate_id,
        job_id: job_id || candidateApplications.JobPost.job_id,
        download_date: new Date()
      });
    }

    // Calculate remaining quota
    const remainingQuota = subscription.cv_download_quota > 0 
      ? subscription.cv_download_quota - downloadsThisMonth 
      : null; // null means unlimited

    // Here you would actually serve the file for download
    // Since file serving depends on your file storage solution, this is just a placeholder
    // In a real implementation, you would send the file as a response or return a download URL
    
    // For demonstration, just return success with quota information
    return res.status(200).json({
      success: true,
      message: "Resume download successful",
      resumePath: candidateProfile.resume,
      quota: {
        total: subscription.cv_download_quota,
        used: downloadsThisMonth,
        remaining: remainingQuota
      }
    });
  } catch (error) {
    console.error('Error downloading candidate resume:', error);
    return res.status(500).json({
      success: false,
      message: "Error downloading candidate resume",
      error: error.message
    });
  }
};


exports.getMySessions = async (req, res) => {
  try {
    // Add debugging to see what's available in req.recruiter
    console.log('Recruiter object:', req.recruiter);
    
    // Check if client_id exists, if not use recruiter_id
    if (!req.recruiter.client_id) {
      console.log('Warning: client_id is undefined in request, falling back to recruiter_id');
      
      // Try to fetch the recruiter to get their client_id
      const recruiter = await RecruiterSignin.findByPk(req.recruiter.recruiter_id);
      if (!recruiter || !recruiter.client_id) {
        return res.status(400).json({
          success: false,
          message: 'Unable to determine client ID for this session'
        });
      }
      
      // Use the client_id from the database
      req.recruiter.client_id = recruiter.client_id;
    }
    
    const clientId = req.recruiter.client_id;
    
    // Get subscription details
    const subscription = await ClientSubscription.findOne({
      where: {
        client_id: clientId,
        is_active: true
      }
    });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }
    
    // Get all active sessions
    const sessions = await ClientLoginDevice.findAll({
      where: {
        client_id: clientId,
        is_active: true
      },
      order: [['last_login', 'DESC']],
      attributes: [
        'login_id',
        'last_login',
        'start_date',
        'end_date'
      ]
    });
    
    // Process sessions to add readable information
    const processedSessions = sessions.map(session => {
      const sessionData = session.toJSON();
      
      // Format dates for display
      sessionData.last_login_formatted = formatDate(sessionData.last_login);
      sessionData.start_date_formatted = formatDate(sessionData.start_date);
      sessionData.end_date_formatted = sessionData.end_date ? formatDate(sessionData.end_date) : 'No expiry';
      
      // Add current session indicator
      sessionData.is_current_session = (sessionData.login_id === req.recruiter.login_id);
      
      return sessionData;
    });
    
    return res.status(200).json({
      success: true,
      subscription: {
        login_allowed: subscription.login_allowed,
        cv_download_quota: subscription.cv_download_quota,
        start_date: subscription.start_date,
        end_date: subscription.end_date
      },
      sessions: processedSessions,
      stats: {
        total_active_sessions: sessions.length,
        max_allowed: subscription.login_allowed,
        remaining_slots: Math.max(0, subscription.login_allowed - sessions.length)
      }
    });
  } catch (error) {
    console.error('Error fetching active sessions:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching active sessions',
      error: error.message
    });
  }
};

// Helper function to format dates
function formatDate(date) {
  if (!date) return null;
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}


// Update Recruiter Password (by recruiter themselves)
exports.updateRecruiterPassword = async (req, res) => {
  const recruiterId = req.recruiter.recruiter_id; // Get recruiter ID from JWT token
  const { currentPassword, newPassword } = req.body;

  try {
    // Input validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    // Password strength validation
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long"
      });
    }

    // Find the recruiter by ID - using RecruiterSignin model, not Recruiter
    const recruiter = await RecruiterSignin.findByPk(recruiterId);
    if (!recruiter) {
      return res.status(404).json({ 
        success: false, 
        message: "Recruiter not found" 
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, recruiter.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: "Current password is incorrect" 
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    recruiter.password = hashedPassword;
    await recruiter.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (err) {
    console.error('Error updating recruiter password:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};


// Application Management Functions
exports.getJobApplications = async (req, res) => {
  try {
    const recruiterId = req.recruiter.recruiter_id;
    const { job_id, status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    // Special case: If a specific job_id is requested, first check if it exists
    if (job_id) {
      const jobDetails = await JobPost.findOne({
        where: {
          job_id: job_id,
          recruiter_id: recruiterId
        },
        attributes: ['job_id', 'jobTitle', 'locations', 'companyName']
      });
      
      // If the job exists, check for applications
      if (jobDetails) {
        const applicationWhereClause = {
          job_id: job_id
        };
        
        if (status && ['pending', 'selected', 'rejected'].includes(status)) {
          applicationWhereClause.status = status;
        }
        
        const { count, rows } = await JobApplication.findAndCountAll({
          where: applicationWhereClause,
          include: [
            {
              model: JobPost,
              attributes: ['job_id', 'jobTitle', 'locations', 'companyName']
            },
            {
              model: CandidateProfile,
              attributes: ['candidate_id', 'name', 'email', 'phone']
            }
          ],
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: [['applied_at', 'DESC']]
        });
        
        // If no applications found, return job details in a dummy structure
        if (count === 0) {
          return res.status(200).json({
            success: true,
            count: 0,
            totalPages: 0,
            currentPage: parseInt(page),
            applications: [{
              application_id: null,
              job_id: jobDetails.job_id,
              candidate_id: null,
              applied_at: null,
              status: null,
              JobPost: {
                job_id: jobDetails.job_id,
                jobTitle: jobDetails.jobTitle,
                locations: jobDetails.locations,
                companyName: jobDetails.companyName
              },
              candidate_profile: null
            }]
          });
        }
        
        // Fetch user names from User table for all candidates
        const candidateIds = rows.map(app => app.candidate_id);
        const users = await User.findAll({
          where: {
            candidate_id: {
              [Op.in]: candidateIds
            }
          },
          attributes: ['candidate_id', 'name', 'email']
        });
        
        // Create a map of candidate_id to user information
        const userMap = {};
        users.forEach(user => {
          userMap[user.candidate_id] = user;
        });
        
        // Enhance the application rows with user information
        const enhancedRows = rows.map(application => {
          const appJson = application.toJSON();
          
          // If candidate exists in the user table, update the profile info
          if (userMap[appJson.candidate_id]) {
            // If candidate_profile is null, initialize it
            if (!appJson.candidate_profile) {
              appJson.candidate_profile = {
                candidate_id: appJson.candidate_id
              };
            }
            
            // Update name if it's empty in candidate_profile but exists in user
            if ((!appJson.candidate_profile.name || appJson.candidate_profile.name === '') && 
                userMap[appJson.candidate_id].name) {
              appJson.candidate_profile.name = userMap[appJson.candidate_id].name;
            }
            
            // Update email if it's null in candidate_profile but exists in user
            if (appJson.candidate_profile.email === null && userMap[appJson.candidate_id].email) {
              appJson.candidate_profile.email = userMap[appJson.candidate_id].email;
            }
          }
          
          return appJson;
        });
        
        // If applications found, return them with enhanced information
        return res.status(200).json({
          success: true,
          count,
          totalPages: Math.ceil(count / limit),
          currentPage: parseInt(page),
          applications: enhancedRows
        });
      }
    }
    
    // If no specific job_id is requested or job not found, proceed with original logic
    const whereClause = { recruiter_id: recruiterId };
    if (job_id) {
      whereClause.job_id = job_id;
    }
    
    const jobs = await JobPost.findAll({
      where: whereClause,
      attributes: ['job_id']
    });
    
    if (jobs.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        totalPages: 0,
        currentPage: parseInt(page),
        applications: []
      });
    }
    
    const jobIds = jobs.map(job => job.job_id);
    
    const applicationWhereClause = {
      job_id: { [Op.in]: jobIds }
    };
    
    if (status && ['pending', 'selected', 'rejected'].includes(status)) {
      applicationWhereClause.status = status;
    }
    
    const { count, rows } = await JobApplication.findAndCountAll({
      where: applicationWhereClause,
      include: [
        {
          model: JobPost,
          attributes: ['job_id', 'jobTitle', 'locations', 'companyName']
        },
        {
          model: CandidateProfile,
          attributes: ['candidate_id', 'name', 'email', 'phone']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['applied_at', 'DESC']]
    });
    
    // If no applications found, return empty array
    if (count === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        totalPages: 0,
        currentPage: parseInt(page),
        applications: []
      });
    }
    
    // Fetch user names from User table for all candidates
    const candidateIds = rows.map(app => app.candidate_id);
    const users = await User.findAll({
      where: {
        candidate_id: {
          [Op.in]: candidateIds
        }
      },
      attributes: ['candidate_id', 'name', 'email']
    });
    
    // Create a map of candidate_id to user information
    const userMap = {};
    users.forEach(user => {
      userMap[user.candidate_id] = user;
    });
    
    // Enhance the application rows with user information
    const enhancedRows = rows.map(application => {
      const appJson = application.toJSON();
      
      // If candidate exists in the user table, update the profile info
      if (userMap[appJson.candidate_id]) {
        // If candidate_profile is null, initialize it
        if (!appJson.candidate_profile) {
          appJson.candidate_profile = {
            candidate_id: appJson.candidate_id
          };
        }
        
        // Update name if it's empty in candidate_profile but exists in user
        if ((!appJson.candidate_profile.name || appJson.candidate_profile.name === '') && 
            userMap[appJson.candidate_id].name) {
          appJson.candidate_profile.name = userMap[appJson.candidate_id].name;
        }
        
        // Update email if it's null in candidate_profile but exists in user
        if (appJson.candidate_profile.email === null && userMap[appJson.candidate_id].email) {
          appJson.candidate_profile.email = userMap[appJson.candidate_id].email;
        }
      }
      
      return appJson;
    });
    
    return res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      applications: enhancedRows
    });
  } catch (error) {
    console.error('Error getting job applications:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting job applications',
      error: error.message
    });
  }
};

// Get application details with candidate profile
exports.getApplicationDetail = async (req, res) => {
try {
  const recruiterId = req.recruiter.recruiter_id;
  const { application_id } = req.params;
  
  const application = await JobApplication.findOne({
    where: { application_id },
    include: [
      {
        model: JobPost,
        where: { recruiter_id: recruiterId },
        attributes: ['job_id', 'jobTitle', 'jobDescription', 'locations', 'job_creation_date']
      },
      {
        model: CandidateProfile,
        attributes: ['candidate_id', 'name', 'email', 'phone', 'location',
                    'resume_headline', 'profile_summary','expected_salary']
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

// Update application status
exports.updateApplicationStatus = async (req, res) => {
try {
  const recruiterId = req.recruiter.recruiter_id;
  const { application_id } = req.params;
  const { status } = req.body;
  
  if (!status || !['pending', 'selected', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status provided'
    });
  }
  
  // First check if this application belongs to the recruiter's job
  const application = await JobApplication.findOne({
    where: { application_id },
    include: [
      {
        model: JobPost,
        where: { recruiter_id: recruiterId },
        attributes: ['job_id', 'jobTitle', 'recruiter_id']
      },
      {
        model: CandidateProfile,
        attributes: ['candidate_id', 'name', 'email']
      }
    ]
  });
  
  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found or you do not have permission to update it'
    });
  }
  
  // Update the status
  application.status = status;
  await application.save();
  
  // Send email notification to candidate
  const candidate = application.CandidateProfile;
  const job = application.JobPost;
  
  if (candidate && candidate.email && (status === 'selected' || status === 'rejected')) {
    console.log(`Attempting to send email to candidate: ${candidate.email}`);
    
    const subject = status === 'selected' 
      ? `Congratulations! You've been selected for ${job.jobTitle}`
      : `Update on your application for ${job.jobTitle}`;
    
    const content = status === 'selected'
      ? `
        <h2>Congratulations!</h2>
        <p>Dear ${candidate.name},</p>
        <p>We are pleased to inform you that you have been selected for the position of <strong>${job.jobTitle}</strong>.</p>
        <p>Our HR team will contact you shortly with the next steps.</p>
        <p>Thank you for your interest in joining our team!</p>
      `
      : `
        <h2>Application Update</h2>
        <p>Dear ${candidate.name},</p>
        <p>Thank you for applying for the position of <strong>${job.jobTitle}</strong>.</p>
        <p>After careful consideration, we regret to inform you that we have decided to move forward with other candidates whose qualifications better match our current needs.</p>
        <p>We appreciate your interest in our company and wish you success in your job search.</p>
      `;
    
    const mailOptions = {
      from: `"Job Portal" <${process.env.MAIL_USERNAME}>`,
      to: candidate.email,
      subject,
      html: content
    };
    
    try {
      // Use async/await with a Promise wrapper for better error handling
      const emailResult = await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Detailed email error:', error);
            reject(error);
          } else {
            console.log('Email sent successfully:', info.response);
            resolve(info);
          }
        });
      });
      
      console.log(`Email notification sent to ${candidate.email}:`, emailResult.response);
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Continue with the function, don't return here
    }
  }
  
  return res.status(200).json({
    success: true,
    message: `Application status updated to ${status}`,
    application
  });
} catch (error) {
  console.error('Error updating application status:', error);
  return res.status(500).json({
    success: false,
    message: 'Error updating application status',
    error: error.message
  });
}
};

// Get CV download quota information
exports.getCVDownloadQuota = async (req, res) => {
  try {
    // Get recruiter info from the request
    const recruiterId = req.recruiter.recruiter_id;

    // Check if client_id exists, if not fetch from database
    if (!req.recruiter.client_id) {
      console.log('Warning: client_id is undefined in request, fetching from database');
      
      // Fetch the recruiter to get their client_id
      const recruiter = await RecruiterSignin.findByPk(recruiterId);
      if (!recruiter || !recruiter.client_id) {
        return res.status(400).json({
          success: false,
          message: 'Unable to determine client ID for this session'
        });
      }
      
      // Use the client_id from the database
      req.recruiter.client_id = recruiter.client_id;
    }
    
    const clientId = req.recruiter.client_id;

    // Check if recruiter has an active subscription with CV quota
    const subscription = await ClientSubscription.findOne({
      where: {
        client_id: clientId, // Use clientId instead of recruiterId
        is_active: true,
        start_date: { [Op.lte]: new Date() },
        end_date: { 
          [Op.or]: [
            { [Op.is]: null }, // No end date (unlimited)
            { [Op.gte]: new Date() } // End date is in the future
          ]
        }
      }
    });
  
    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: "You don't have an active subscription. Please contact admin.",
        errorCode: 'NO_ACTIVE_SUBSCRIPTION'
      });
    }
  
    // Count how many CVs they've downloaded this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
  
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
  
    const downloadsThisMonth = await CVDownloadTracker.count({
      where: {
        recruiter_id: recruiterId, // This is fine as recruiterId
        download_date: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      }
    });
  
    // Calculate remaining quota
    const remainingQuota = subscription.cv_download_quota > 0
      ? subscription.cv_download_quota - downloadsThisMonth
      : null; // null means unlimited
  
    return res.status(200).json({
      success: true,
      quota: {
        total: subscription.cv_download_quota,
        used: downloadsThisMonth,
        remaining: remainingQuota,
        unlimited: subscription.cv_download_quota <= 0
      },
      subscription: {
        start_date: subscription.start_date,
        end_date: subscription.end_date
      }
    });
  } catch (error) {
    console.error('Error getting CV download quota:', error);
    return res.status(500).json({
      success: false,
      message: "Error getting CV download quota",
      error: error.message
    });
  }
};

// Test email function to verify your configuration works
exports.testEmail = async (req, res) => {
try {
  // Log email configuration for debugging
  console.log('Email Configuration:', {
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD ? 'Set (value hidden)' : 'Not set'
  });
  
  // Create test email
  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: process.env.MAIL_USERNAME, // Send to yourself for testing
    subject: 'Email Test from Job Portal',
    html: '<h2>Email Configuration Test</h2><p>This is a test email to verify that your email configuration is working correctly.</p>'
  };
  
  // Send email and wait for response
  const info = await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Detailed email error:', error);
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
  
  console.log('Email test successful:', info.response);
  
  return res.status(200).json({
    success: true,
    message: 'Test email sent successfully',
    emailInfo: info.response
  });
} catch (error) {
  console.error('Error sending test email:', error);
  return res.status(500).json({
    success: false,
    message: 'Error sending test email',
    error: error.message
  });
}
};

// Download candidate resume with subscription quota enforcement
/*exports.downloadCandidateCV = async (req, res) => {
  try {
    const { candidate_id } = req.params;
    const recruiterId = req.recruiter.recruiter_id;
    const { job_id } = req.query; // Optional job_id parameter
    
    if (!candidate_id) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required"
      });
    }

    // First, check if this recruiter has any jobs that the candidate has applied to
    const candidateApplications = await JobApplication.findOne({
      where: { candidate_id },
      include: [
        {
          model: JobPost,
          where: { recruiter_id: recruiterId },
          attributes: ['job_id']
        }
      ]
    });

    if (!candidateApplications) {
      return res.status(403).json({
        success: false,
        message: "You can only download CV of candidates who have applied to your job postings"
      });
    }

    // Get the candidate profile with resume path
    const candidateProfile = await CandidateProfile.findOne({
      where: { candidate_id },
      attributes: ['candidate_id', 'name', 'resume_path']
    });

    if (!candidateProfile || !candidateProfile.resume_path) {
      return res.status(404).json({
        success: false,
        message: "Candidate CV not found"
      });
    }

    // Get the recruiter to check client_id
    const recruiter = await RecruiterSignin.findByPk(recruiterId);
    if (!recruiter || !recruiter.client_id) {
      return res.status(400).json({
        success: false,
        message: "Client information not found for this recruiter"
      });
    }

    // Check if recruiter's client has an active subscription with CV quota
    const subscription = await ClientSubscription.findOne({
      where: {
        client_id: recruiter.client_id,
        is_active: true,
        start_date: { [Op.lte]: new Date() },
        end_date: { 
          [Op.or]: [
            { [Op.is]: null }, // No end date (unlimited)
            { [Op.gte]: new Date() } // End date is in the future
          ]
        }
      }
    });

    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: "Your client doesn't have an active subscription. Please contact admin.",
        errorCode: 'NO_ACTIVE_SUBSCRIPTION'
      });
    }

    // Check if recruiter has exceeded their CV download quota
    // First, count how many CVs they've downloaded this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const downloadsThisMonth = await CVDownloadTracker.count({
      where: {
        recruiter_id: recruiterId,
        download_date: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      }
    });

    // Check if already downloaded this CV this month to avoid double counting
    const alreadyDownloadedThisMonth = await CVDownloadTracker.findOne({
      where: {
        recruiter_id: recruiterId,
        candidate_id,
        download_date: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      }
    });

    // If not unlimited (cv_download_quota > 0) and not already downloaded this month, check quota
    if (!alreadyDownloadedThisMonth && subscription.cv_download_quota > 0) {
      if (downloadsThisMonth >= subscription.cv_download_quota) {
        return res.status(403).json({
          success: false,
          message: `You have reached your CV download limit (${subscription.cv_download_quota}) for this month. Please contact admin to increase your quota.`,
          errorCode: 'CV_QUOTA_EXCEEDED',
          quota: {
            total: subscription.cv_download_quota,
            used: downloadsThisMonth,
            remaining: 0
          }
        });
      }
    }

    // If this is the first time downloading this month, track the download
    if (!alreadyDownloadedThisMonth) {
      await CVDownloadTracker.create({
        recruiter_id: recruiterId,
        candidate_id,
        job_id: job_id || candidateApplications.JobPost.job_id,
        download_date: new Date()
      });
    }

    // Calculate remaining quota (null if unlimited)
    const remainingQuota = subscription.cv_download_quota > 0 
      ? subscription.cv_download_quota - downloadsThisMonth - (alreadyDownloadedThisMonth ? 0 : 1)
      : null;

    // Format resume path to get the full URL
    const resumeUrl = candidateProfile.resume_path.startsWith('http') 
      ? candidateProfile.resume_path 
      : `${process.env.BASE_URL || ''}/${candidateProfile.resume_path}`;

    // Return the download URL with quota information
    return res.status(200).json({
      success: true,
      message: alreadyDownloadedThisMonth 
        ? "CV already downloaded this month (not counted toward quota)" 
        : "CV download successful",
      candidate_name: candidateProfile.name,
      resumeUrl: resumeUrl,
      quota: {
        total: subscription.cv_download_quota,
        used: downloadsThisMonth + (alreadyDownloadedThisMonth ? 0 : 1),
        remaining: remainingQuota,
        unlimited: subscription.cv_download_quota <= 0
      }
    });
  } catch (error) {
    console.error('Error downloading candidate CV:', error);
    return res.status(500).json({
      success: false,
      message: "Error downloading candidate CV",
      error: error.message
    });
  }
};*/

exports.downloadCandidateCV = async (req, res) => {
  try {
    const { candidate_id } = req.params;
    const recruiterId = req.recruiter.recruiter_id;
    
    // Get the IP address from the request
    let ip_address = req.ip || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress || 
                     req.headers['x-forwarded-for']?.split(',')[0] || 
                     'Unknown';
    
    // Convert IPv6 loopback to IPv4 format
    if (ip_address === '::1') {
      ip_address = '127.0.0.1';
    }
    
    // For IPv6 addresses that include IPv4 (like ::ffff:127.0.0.1)
    if (ip_address.includes('::ffff:')) {
      ip_address = ip_address.replace('::ffff:', '');
    }
    
    if (!candidate_id) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required"
      });
    }

    // Get the candidate profile basic info
    const candidateProfile = await CandidateProfile.findOne({
      where: { candidate_id },
      attributes: ['candidate_id', 'name']
    });

    if (!candidateProfile) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found"
      });
    }

    // Get the recruiter to check client_id
    const recruiter = await RecruiterSignin.findByPk(recruiterId);
    if (!recruiter || !recruiter.client_id) {
      return res.status(400).json({
        success: false,
        message: "Client information not found for this recruiter"
      });
    }

    const clientId = recruiter.client_id;
    // Check if recruiter's client has an active subscription with CV quota
    const subscription = await ClientSubscription.findOne({
      where: {
        client_id: clientId,
        is_active: true,
        start_date: { [Op.lte]: new Date() },
        end_date: { 
          [Op.or]: [
            { [Op.is]: null }, // No end date (unlimited)
            { [Op.gte]: new Date() } // End date is in the future
          ]
        }
      }
    });
    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: "Your client doesn't have an active subscription. Please contact admin.",
        errorCode: 'NO_ACTIVE_SUBSCRIPTION'
      });
    }
    // Check if recruiter has exceeded their CV download quota
    // First, count how many CVs they've downloaded this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const downloadsThisMonth = await CVDownloadTracker.count({
      where: {
        recruiter_id: recruiterId,
        download_date: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      }
    });

    // Check if already downloaded this CV this month to avoid double counting
    const alreadyDownloadedThisMonth = await CVDownloadTracker.findOne({
      where: {
        recruiter_id: recruiterId,
        candidate_id,
        download_date: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      },
      attributes: ['download_id', 'recruiter_id', 'client_id', 'candidate_id', 'download_date']
    });

    // If not unlimited (cv_download_quota > 0) and not already downloaded this month, check quota
    if (!alreadyDownloadedThisMonth && subscription.cv_download_quota > 0) {
      if (downloadsThisMonth >= subscription.cv_download_quota) {
        return res.status(403).json({
          success: false,
          message: `You have reached your CV download limit (${subscription.cv_download_quota}). Please contact admin to increase your quota.`,
          errorCode: 'CV_QUOTA_EXCEEDED',
          quota: {
            total: subscription.cv_download_quota,
            used: downloadsThisMonth,
            remaining: 0
          }
        });
      }
    }

    // If this is the first time downloading this month, track the download
    if (!alreadyDownloadedThisMonth) {
      await CVDownloadTracker.create({
        recruiter_id: recruiterId,
        client_id: clientId,
        candidate_id,
        download_date: new Date(),
        ip_address: ip_address // Save the IPv4 address
      });
    }

    // Calculate remaining quota (null if unlimited)
    const remainingQuota = subscription.cv_download_quota > 0 
      ? subscription.cv_download_quota - downloadsThisMonth - (alreadyDownloadedThisMonth ? 0 : 1)
      : null;

    // Return success response with quota information
    return res.status(200).json({
      success: true,
      message: alreadyDownloadedThisMonth 
        ? "CV already downloaded this month (not counted toward quota)" 
        : "CV download tracked successfully",
      candidate_name: candidateProfile.name,
      quota: {
        total: subscription.cv_download_quota,
        used: downloadsThisMonth + (alreadyDownloadedThisMonth ? 0 : 1),
        remaining: remainingQuota,
        unlimited: subscription.cv_download_quota <= 0
      }
    });
  } catch (error) {
    console.error('Error tracking CV download:', error);
    return res.status(500).json({
      success: false,
      message: "Error tracking CV download",
      error: error.message
    });
  }
};
// Create directory for storing PDFs if it doesn't exist
const pdfDirectory = path.join(__dirname, '../uploads/pdfs');
if (!fs.existsSync(pdfDirectory)) {
  fs.mkdirSync(pdfDirectory, { recursive: true });
}
// Generate a PDF from candidate profile and return the file for download - with debug info
exports.generateCandidatePDF = async (req, res) => {
  try {
    const { candidate_id } = req.params;
    const recruiterId = req.recruiter.recruiter_id;
    // Get client_id either from the request or from the recruiter record
    let clientId = req.recruiter.client_id;
    // If client_id is not in the request, fetch it from the database
    if (!clientId) {
      const recruiter = await RecruiterSignin.findByPk(recruiterId);
      if (!recruiter || !recruiter.client_id) {
        return res.status(400).json({
          success: false,
          message: "Client information not found for this recruiter"
        });
      }
      clientId = recruiter.client_id;
    }
    if (!candidate_id) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required"
      });
    }
    // Get the candidate profile data with all fields
    const candidateProfile = await CandidateProfile.findOne({
      where: { candidate_id }
    });
    if (!candidateProfile) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found"
      });
    }
    // Log the profile data to see what's available
    console.log("Candidate profile data keys:", Object.keys(candidateProfile.toJSON()));
    console.log("Non-null profile fields:", 
      Object.entries(candidateProfile.toJSON())
        .filter(([key, value]) => value !== null && value !== undefined && value !== '')
        .map(([key]) => key)
    );
    // Get user information from signin table
    const userInfo = await User.findOne({
      where: { candidate_id },
      attributes: ['name', 'email']
    });
    // Check if recruiter has an active subscription with CV quota
    const subscription = await ClientSubscription.findOne({
      where: {
        client_id: clientId,
        is_active: true,
        start_date: { [Op.lte]: new Date() },
        end_date: { 
          [Op.or]: [
            { [Op.is]: null }, // No end date (unlimited)
            { [Op.gte]: new Date() } // End date is in the future
          ]
        }
      }
    });
    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: "You don't have an active subscription. Please contact admin.",
        errorCode: 'NO_ACTIVE_SUBSCRIPTION'
      });
    }
    // Check CV quota
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    const downloadsThisMonth = await CVDownloadTracker.count({
      where: {
        recruiter_id: recruiterId,
        download_date: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      }
    });
    // Check if already downloaded this CV this month to avoid double counting
    const alreadyDownloadedThisMonth = await CVDownloadTracker.findOne({
      where: {
        recruiter_id: recruiterId,
        candidate_id,
        download_date: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      },
      attributes: ['download_id', 'recruiter_id', 'client_id', 'candidate_id', 'download_date'] // Only select columns that exist
    });

    // If not unlimited (cv_download_quota > 0) and not already downloaded this month, check quota
    if (!alreadyDownloadedThisMonth && subscription.cv_download_quota > 0) {
      if (downloadsThisMonth >= subscription.cv_download_quota) {
        return res.status(403).json({
          success: false,
          message: `You have reached your CV download limit (${subscription.cv_download_quota}). Please contact admin to increase your quota.`,
          errorCode: 'CV_QUOTA_EXCEEDED',
          quota: {
            total: subscription.cv_download_quota,
            used: downloadsThisMonth,
            remaining: 0
          }
        });
      }
    }
    // Get IP address for tracking
    let ip_address = req.ip || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress || 
                   req.headers['x-forwarded-for']?.split(',')[0] || 
                   'Unknown';
    
    // Convert IPv6 loopback to IPv4 format
    if (ip_address === '::1') {
      ip_address = '127.0.0.1';
    }
    
    // For IPv6 addresses that include IPv4 (like ::ffff:127.0.0.1)
    if (ip_address.includes('::ffff:')) {
      ip_address = ip_address.replace('::ffff:', '');
    }

    // Try to find a job application if exists for reference (optional)
    const candidateApplication = await JobApplication.findOne({
      where: { candidate_id },
      include: [
        {
          model: JobPost,
          attributes: ['job_id', 'jobTitle']
        }
      ]
    });

    // Track the download if not already downloaded this month
    if (!alreadyDownloadedThisMonth) {
      await CVDownloadTracker.create({
        recruiter_id: recruiterId,
        client_id: clientId,
        candidate_id,
        download_date: new Date(),
        ip_address: ip_address,
        file_type: 'pdf'
      });
    }
    // Create a unique filename
    const timestamp = moment().format('YYYYMMDD_HHmmss');
    const candidateName = (userInfo?.name || candidateProfile.name || 'candidate').replace(/\s+/g, '_');
    const filename = `${candidateName}_${timestamp}.pdf`;
    const filePath = path.join(pdfDirectory, filename);

    // Create PDF document with custom size for better readability
    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4'
    });
    
    // Write to a temporary file
    const stream = fs.createWriteStream(filePath);
    
    // Set up proper error handling for the stream
    stream.on('error', (err) => {
      console.error('Error writing to PDF stream:', err);
      return res.status(500).json({
        success: false,
        message: "Error generating PDF file",
        error: err.message
      });
    });
    
    // Pipe the PDF to the file
    doc.pipe(stream);
    
    // Add header with current date
    doc.fontSize(10).text(`Generated on: ${moment().format('DD-MM-YYYY HH:mm')}`, { align: 'right' });
    
    // Add title
    doc.fontSize(22).text('Candidate Profile', { align: 'center' });
    doc.moveDown();
    
    // Helper function to add section
    const addSection = (title, content) => {
      doc.fontSize(16).fillColor('#000066').text(title, { underline: true });
      doc.fontSize(12).fillColor('black');
      doc.moveDown(0.5);
      
      if (typeof content === 'function') {
        content();
      } else if (content) {
        doc.text(content);
      } else {
        doc.text("[No information available]", { italic: true, color: '#666666' });
      }
      
      doc.moveDown();
    };
    
    // Helper function to display field if exists
    const addField = (label, value, options = {}) => {
      if (value !== undefined && value !== null && value !== '') {
        const fieldText = `${label}: ${value}`;
        doc.text(fieldText, options);
        return true;
      }
      return false;
    };
    
    // Helper function to try parsing JSON
    const tryParseJSON = (jsonString) => {
      if (!jsonString) return null;
      
      try {
        if (typeof jsonString === 'object') return jsonString;
        return JSON.parse(jsonString);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        return jsonString;
      }
    };
    
    // Add job position if available
    if (candidateApplication && candidateApplication.JobPost) {
      doc.fontSize(14).fillColor('#0066cc')
        .text(`Applied For: ${candidateApplication.JobPost.jobTitle}`, { underline: true });
      doc.fillColor('black');
      doc.moveDown();
    }
    
    // Personal Information section
    addSection('Personal Information', () => {
      const profileData = candidateProfile.toJSON();
      const name = userInfo?.name || profileData.name || 'N/A';
      const email = userInfo?.email || profileData.email || 'N/A';
      
      doc.font('Helvetica-Bold').text('Basic Details:').font('Helvetica');
      addField('Name', name);
      addField('Email', email);
      addField('Phone', profileData.phone);
      addField('Location', profileData.location);
      
      // Check if any additional personal details exist
      const hasMoreDetails = 
        profileData.gender || 
        profileData.marital_status || 
        profileData.dob || 
        profileData.permanent_address || 
        profileData.home_town || 
        profileData.pin_code;
      
      if (hasMoreDetails) {
        doc.moveDown(0.5);
        doc.font('Helvetica-Bold').text('Additional Details:').font('Helvetica');
        addField('Gender', profileData.gender);
        addField('Marital Status', profileData.marital_status);
        addField('Date of Birth', profileData.dob ? moment(profileData.dob).format('DD-MM-YYYY') : null);
        addField('Permanent Address', profileData.permanent_address);
        addField('Home Town', profileData.home_town);
        addField('PIN Code', profileData.pin_code);
      }
      
      // Special Categories
      const hasSpecialCategories = profileData.category || profileData.differently_abled;
      if (hasSpecialCategories) {
        doc.moveDown(0.5);
        if (profileData.category) addField('Category', profileData.category);
        if (profileData.differently_abled) addField('Differently Abled', profileData.differently_abled === true ? 'Yes' : 'No');
      }
      
      // Work Permits & Career Information
      const hasWorkInfo = 
        profileData.work_permit_to_usa || 
        profileData.work_permit_to_country || 
        profileData.career_break;
      
      if (hasWorkInfo) {
        doc.moveDown(0.5);
        if (profileData.work_permit_to_usa) addField('Work Permit - USA', profileData.work_permit_to_usa === true ? 'Yes' : 'No');
        if (profileData.work_permit_to_country) addField('Work Permit - Other Countries', profileData.work_permit_to_country);
        if (profileData.career_break) addField('Career Break', profileData.career_break === true ? 'Yes' : 'No');
      }
      
      // Language Proficiency
      if (profileData.language_proficiency) {
        doc.moveDown(0.5);
        const languages = tryParseJSON(profileData.language_proficiency);
        
        if (Array.isArray(languages)) {
          doc.font('Helvetica-Bold').text('Languages:').font('Helvetica');
          languages.forEach(lang => {
            if (typeof lang === 'object') {
              const langText = `${lang.language || ''} ${lang.proficiency ? `(${lang.proficiency})` : ''}`;
              doc.text(`• ${langText}`);
            } else {
              doc.text(`• ${lang}`);
            }
          });
        } else if (typeof languages === 'string') {
          addField('Languages', languages);
        }
      }
    });
    
    // Professional Summary
    if (candidateProfile.resume_headline || candidateProfile.profile_summary) {
      addSection('Professional Summary', () => {
        if (candidateProfile.resume_headline) {
          doc.font('Helvetica-Bold').text('Resume Headline:').font('Helvetica');
          doc.text(candidateProfile.resume_headline);
          doc.moveDown(0.5);
        }
        
        if (candidateProfile.profile_summary) {
          doc.font('Helvetica-Bold').text('Profile Summary:').font('Helvetica');
          doc.text(candidateProfile.profile_summary);
        }
      });
    }
    
    // Career Preferences
    const hasCareerPreferences = 
      candidateProfile.current_industry || 
      candidateProfile.department || 
      candidateProfile.desired_job_type || 
      candidateProfile.desired_employment_type || 
      candidateProfile.preferred_shift || 
      candidateProfile.preferred_work_location || 
      candidateProfile.expected_salary || 
      candidateProfile.availability_to_join ||
      candidateProfile.fresher_experience;
    
    if (hasCareerPreferences) {
      addSection('Career Preferences', () => {
        if (candidateProfile.current_industry) addField('Current Industry', candidateProfile.current_industry);
        if (candidateProfile.department) addField('Department', candidateProfile.department);
        if (candidateProfile.desired_job_type) addField('Desired Job Type', candidateProfile.desired_job_type);
        if (candidateProfile.desired_employment_type) addField('Desired Employment Type', candidateProfile.desired_employment_type);
        if (candidateProfile.preferred_shift) addField('Preferred Shift', candidateProfile.preferred_shift);
        if (candidateProfile.preferred_work_location) addField('Preferred Work Location', candidateProfile.preferred_work_location);
        if (candidateProfile.expected_salary) addField('Expected Salary', candidateProfile.expected_salary);
        if (candidateProfile.availability_to_join) addField('Availability to Join', candidateProfile.availability_to_join);
        if (candidateProfile.fresher_experience) addField('Experience Level', candidateProfile.fresher_experience === 'fresher' ? 'Fresher' : 'Experienced');
      });
    }
    // Education details
    if (candidateProfile.education) {
      addSection('Education', () => {
        const educationData = tryParseJSON(candidateProfile.education);
        
        if (Array.isArray(educationData) && educationData.length > 0) {
          educationData.forEach((edu, index) => {
            if (index > 0) doc.moveDown(0.5);
            
            // Add a separator line between multiple education entries
            if (index > 0) {
              doc.moveTo(50, doc.y)
                 .lineTo(doc.page.width - 50, doc.y)
                 .stroke();
              doc.moveDown(0.5);
            }
            
            if (edu.degree) doc.font('Helvetica-Bold').text(edu.degree).font('Helvetica');
            if (edu.institution) addField('Institution', edu.institution);
            if (edu.specialization) addField('Specialization', edu.specialization);
            if (edu.year) addField('Year', edu.year);
            if (edu.grade) addField('Grade/Percentage', edu.grade);
          });
        } else if (typeof educationData === 'string') {
          doc.text(educationData);
        }
      });
    }
    // Experience details
    if (candidateProfile.experience) {
      addSection('Work Experience', () => {
        const experienceData = tryParseJSON(candidateProfile.experience);
        
        if (Array.isArray(experienceData) && experienceData.length > 0) {
          experienceData.forEach((exp, index) => {
            if (index > 0) doc.moveDown(0.5);
            
            // Add a separator line between multiple experience entries
            if (index > 0) {
              doc.moveTo(50, doc.y)
                 .lineTo(doc.page.width - 50, doc.y)
                 .stroke();
              doc.moveDown(0.5);
            }
            
            // Company and Job title as main bold headings
            if (exp.company) doc.font('Helvetica-Bold').text(exp.company).font('Helvetica');
            if (exp.title) doc.font('Helvetica-Bold').text(exp.title).font('Helvetica');
            
            // Duration and other details
            if (exp.duration) addField('Duration', exp.duration);
            if (exp.location) addField('Location', exp.location);
            if (exp.responsibilities) addField('Responsibilities', exp.responsibilities);
            
            // Description with indentation
            if (exp.description) {
              doc.moveDown(0.3);
              doc.font('Helvetica-Bold').text('Description:').font('Helvetica');
              doc.text(exp.description, { 
                paragraphGap: 5,
                indent: 10
              });
            }
            
            // Skills used
            if (exp.skills) {
              doc.moveDown(0.3);
              doc.font('Helvetica-Bold').text('Skills Used:').font('Helvetica');
              if (Array.isArray(exp.skills)) {
                exp.skills.forEach(skill => {
                  doc.text(`• ${skill}`, { indent: 10 });
                });
              } else {
                doc.text(exp.skills, { indent: 10 });
              }
            }
          });
        } else if (typeof experienceData === 'string') {
          doc.text(experienceData);
        }
      });
    }
    
    // Skills section
    if (candidateProfile.key_skills) {
      addSection('Skills', () => {
        let skills;
        try {
          skills = typeof candidateProfile.key_skills === 'string' 
                  ? candidateProfile.key_skills.split(',').map(s => s.trim()) 
                  : candidateProfile.key_skills;
        } catch (e) {
          skills = [candidateProfile.key_skills];
        }
        
        if (Array.isArray(skills)) {
          const columns = [];
          const skillsPerColumn = Math.ceil(skills.length / 3);
          
          for (let i = 0; i < skills.length; i += skillsPerColumn) {
            columns.push(skills.slice(i, i + skillsPerColumn));
          }
          
          // Calculate column width
          const columnWidth = (doc.page.width - 100) / columns.length;
          
          // Draw skills in columns
          const startY = doc.y;
          let maxY = startY;
          
          columns.forEach((column, colIndex) => {
            doc.y = startY; // Reset Y to top of section
            const xPos = 50 + (colIndex * columnWidth);
            
            column.forEach(skill => {
              doc.text(`• ${skill}`, xPos, doc.y, {
                width: columnWidth - 10,
                continued: false
              });
              
              if (doc.y > maxY) maxY = doc.y;
            });
          });
          
          // Set y position to after the last skill
          doc.y = maxY + 10;
        } else {
          doc.text(candidateProfile.key_skills);
        }
      });
    }
    
    // Software & Technology section
    if (candidateProfile.software_name || candidateProfile.software_version) {
      addSection('Software & Technology', () => {
        const softwareNames = tryParseJSON(candidateProfile.software_name);
        const softwareVersions = tryParseJSON(candidateProfile.software_version);
        
        if (Array.isArray(softwareNames) && softwareNames.length > 0) {
          softwareNames.forEach((software, index) => {
            const version = Array.isArray(softwareVersions) && softwareVersions[index] 
                          ? softwareVersions[index] 
                          : '';
            doc.text(`• ${software}${version ? ` (${version})` : ''}`);
          });
        } else {
          if (candidateProfile.software_name) 
            doc.text(`${candidateProfile.software_name}${candidateProfile.software_version ? ` (${candidateProfile.software_version})` : ''}`);
        }
      });
    }
    
    // Certifications section
    if (candidateProfile.certification_name || candidateProfile.certification_url || candidateProfile.certification) {
      addSection('Certifications', () => {
        const certNames = tryParseJSON(candidateProfile.certification_name);
        const certUrls = tryParseJSON(candidateProfile.certification_url);
        const certifications = tryParseJSON(candidateProfile.certification);
        
        if (Array.isArray(certNames) && certNames.length > 0) {
          certNames.forEach((cert, index) => {
            const url = Array.isArray(certUrls) && certUrls[index] ? certUrls[index] : '';
            doc.text(`• ${cert}`);
            if (url) doc.text(`  URL: ${url}`, { indent: 10 });
          });
        } else if (candidateProfile.certification_name) {
          doc.text(`• ${candidateProfile.certification_name}`);
          if (candidateProfile.certification_url) 
            doc.text(`  URL: ${candidateProfile.certification_url}`, { indent: 10 });
        }
        
        // Additional certification details if present
        if (Array.isArray(certifications) && certifications.length > 0) {
          doc.moveDown(0.5);
          doc.font('Helvetica-Bold').text('Additional Certifications:').font('Helvetica');
          
          certifications.forEach(cert => {
            if (typeof cert === 'object') {
              const certName = cert.name || cert.certification || '';
              doc.text(`• ${certName}`);
              
              if (cert.issuer) doc.text(`  Issuer: ${cert.issuer}`, { indent: 10 });
              if (cert.year) doc.text(`  Year: ${cert.year}`, { indent: 10 });
              if (cert.url) doc.text(`  URL: ${cert.url}`, { indent: 10 });
              
              doc.moveDown(0.2);
            } else if (typeof cert === 'string') {
              doc.text(`• ${cert}`);
            }
          });
        } else if (typeof candidateProfile.certification === 'string' && candidateProfile.certification) {
          doc.moveDown(0.5);
          doc.text(candidateProfile.certification);
        }
      });
    }
    
    // Portfolio / Work Samples section
    if (candidateProfile.work_title || candidateProfile.work_sample_url || 
        candidateProfile.work_sample_description || candidateProfile.work_sample) {
      
      addSection('Portfolio / Work Samples', () => {
        if (candidateProfile.work_title) {
          doc.font('Helvetica-Bold').text(candidateProfile.work_title).font('Helvetica');
        }
        
        if (candidateProfile.work_sample_url) {
          addField('URL', candidateProfile.work_sample_url);
        }
        
        if (candidateProfile.work_sample_description) {
          doc.moveDown(0.3);
          doc.text(candidateProfile.work_sample_description);
        }
        
        // Additional work samples
        const workSamples = tryParseJSON(candidateProfile.work_sample);
        
        if (Array.isArray(workSamples) && workSamples.length > 0) {
          doc.moveDown(0.5);
          doc.font('Helvetica-Bold').text('Additional Work Samples:').font('Helvetica');
          
          workSamples.forEach(sample => {
            if (typeof sample === 'object') {
              const title = sample.title || sample.name || '';
              doc.text(`• ${title}`);
              
              if (sample.url) doc.text(`  URL: ${sample.url}`, { indent: 10 });
              if (sample.description) doc.text(`  Description: ${sample.description}`, { indent: 10 });
              
              doc.moveDown(0.2);
            } else if (typeof sample === 'string') {
              doc.text(`• ${sample}`);
            }
          });
        } else if (typeof candidateProfile.work_sample === 'string' && candidateProfile.work_sample) {
          doc.moveDown(0.5);
          doc.text(candidateProfile.work_sample);
        }
      });
    }
    
    // Additional Documents section
    if (candidateProfile.white_paper || candidateProfile.presentation || candidateProfile.patent) {
      addSection('Additional Documents', () => {
        // White Papers
        const whitePapers = tryParseJSON(candidateProfile.white_paper);
        if (whitePapers) {
          doc.font('Helvetica-Bold').text('White Papers:').font('Helvetica');
          
          if (Array.isArray(whitePapers)) {
            whitePapers.forEach(paper => {
              if (typeof paper === 'object') {
                doc.text(`• ${paper.title || 'Untitled'}`);
                if (paper.url) doc.text(`  URL: ${paper.url}`, { indent: 10 });
              } else {
                doc.text(`• ${paper}`);
              }
            });
          } else {
            doc.text(whitePapers);
          }
          
          doc.moveDown(0.5);
        }
        
        // Presentations
        const presentations = tryParseJSON(candidateProfile.presentation);
        if (presentations) {
          doc.font('Helvetica-Bold').text('Presentations:').font('Helvetica');
          
          if (Array.isArray(presentations)) {
            presentations.forEach(presentation => {
              if (typeof presentation === 'object') {
                doc.text(`• ${presentation.title || 'Untitled'}`);
                if (presentation.url) doc.text(`  URL: ${presentation.url}`, { indent: 10 });
              } else {
                doc.text(`• ${presentation}`);
              }
            });
          } else {
            doc.text(presentations);
          }
          
          doc.moveDown(0.5);
        }
        
        // Patents
        const patents = tryParseJSON(candidateProfile.patent);
        if (patents) {
          doc.font('Helvetica-Bold').text('Patents:').font('Helvetica');
          
          if (Array.isArray(patents)) {
            patents.forEach(patent => {
              if (typeof patent === 'object') {
                doc.text(`• ${patent.title || 'Untitled'}`);
                if (patent.number) doc.text(`  Patent Number: ${patent.number}`, { indent: 10 });
                if (patent.year) doc.text(`  Year: ${patent.year}`, { indent: 10 });
              } else {
                doc.text(`• ${patent}`);
              }
            });
          } else {
            doc.text(patents);
          }
        }
      });
    }
    
    // Online Profiles section
    if (candidateProfile.online_profile) {
      addSection('Online Profiles', () => {
        const profiles = tryParseJSON(candidateProfile.online_profile);
        
        if (Array.isArray(profiles) && profiles.length > 0) {
          profiles.forEach(profile => {
            if (typeof profile === 'object') {
              const platform = profile.platform || profile.name || '';
              const url = profile.url || profile.link || '';
              
              if (platform) doc.text(`• ${platform}${url ? ':' : ''}`);
              if (url) doc.text(`  ${url}`, { indent: platform ? 10 : 0 });
              
              doc.moveDown(0.2);
            } else if (typeof profile === 'string') {
              doc.text(`• ${profile}`);
            }
          });
        } else if (typeof candidateProfile.online_profile === 'string') {
          doc.text(candidateProfile.online_profile);
        }
      });
    }
    
    // Resume / CV link if available
    if (candidateProfile.resume) {
      addSection('Resume / CV', () => {
        doc.text(`The candidate has uploaded a resume. Please access it through the system.`);
        // Don't try to include the actual PDF content
      });
    }
    
    // Add the last updated information
    if (candidateProfile.profile_last_updated) {
      doc.moveDown();
      doc.fontSize(10).fillColor('#666666')
        .text(`Profile last updated: ${moment(candidateProfile.profile_last_updated).format('DD-MM-YYYY')}`, 
              { align: 'right' });
    }
    
    // Add debug info to help troubleshoot
    doc.addPage();
    doc.fontSize(14).fillColor('#000000').text('Debug Information', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).fillColor('#333333');
    
    doc.text('Available Fields in Profile:');
    doc.moveDown(0.5);
    
    // Get all non-empty fields
    const profileData = candidateProfile.toJSON();
    const nonEmptyFields = Object.entries(profileData)
      .filter(([key, value]) => 
        value !== null && 
        value !== undefined && 
        value !== '' &&
        key !== 'resume' // Skip resume field as it's binary
      );
    
    if (nonEmptyFields.length > 0) {
      nonEmptyFields.forEach(([key, value]) => {
        // Truncate long values
        let displayValue = typeof value === 'string' ? 
          (value.length > 50 ? value.substring(0, 47) + '...' : value) : 
          String(value);
        
        doc.text(`${key}: ${displayValue}`);
      });
    } else {
      doc.text('No non-empty fields found in profile data.');
    }
    
    doc.moveDown();
    doc.text('Note: This debug page will not be included in production PDF files.', { italic: true });
    
    // Instead of trying to add footers to all pages at the end, set up page events to add footers as pages are created
    let pageNumber = 1;
    
    // Add footer to first page
    const addFooter = () => {
      const footerY = doc.page.height - doc.page.margins.bottom - 20;
      doc.fontSize(8).fillColor('#666666').text(
        `Generated on ${moment().format('DD/MM/YYYY HH:mm')} | Confidential | For internal use only | Page ${pageNumber}`,
        doc.page.margins.left,
        footerY,
        { align: 'center', width: doc.page.width - doc.page.margins.left - doc.page.margins.right }
      );
    };
    
    // Add footer to the first page
    addFooter();
    
    // Handle new pages as they're created
    doc.on('pageAdded', () => {
      pageNumber++;
      addFooter();
    });
    
    // Finalize PDF
    doc.end();
    
    // Use stream events to handle completion
    stream.on('finish', () => {
      try {
        // Calculate remaining quota (null if unlimited)
        const remainingQuota = subscription.cv_download_quota > 0 
          ? subscription.cv_download_quota - downloadsThisMonth - (alreadyDownloadedThisMonth ? 0 : 1)
          : null;
        
        // Use res.download for more reliable file serving
        res.download(filePath, filename, (err) => {
          if (err) {
            console.error('Error sending file:', err);
          }
          
          // Clean up the file after a delay
          setTimeout(() => {
            fs.unlink(filePath, (unlinkErr) => {
              if (unlinkErr) console.error(`Error deleting temporary PDF file: ${unlinkErr}`);
            });
          }, 60000); // Wait 1 minute before deleting
        });
      } catch (finalError) {
        console.error('Error in stream finish handler:', finalError);
        res.status(500).json({
          success: false,
          message: "Error preparing file for download",
          error: finalError.message
        });
      }
    });
  } catch (error) {
    console.error('Error generating candidate PDF:', error);
    return res.status(500).json({
      success: false,
      message: "Error generating candidate PDF",
      error: error.message
    });
  }
};