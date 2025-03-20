const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const XLSX = require('xlsx');
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
const { sequelize } = require('../db');
const { Op } = require('sequelize');
const Admin = require('../models/adminModel');
const Signin = require("../models/user");
const Recruiter = require('../models/recruiterSignin');
const Otp = require('../models/otp');
const JobPost = require('../models/jobpost');
const JobApplication = require('../models/jobApplications');
const TempJobPost = require('../models/TempJobPost'); 
const MasterClient = require('../models/masterClient');
const ClientSubscription = require('../models/clientSubscription');
const ClientLoginDevice = require('../models/clientLoginDevice');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const e = require('express');
require('dotenv').config();

// Helper Functions
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_DEFAULT_SENDER,
    to: email,
    subject: 'OTP for Admin Signup',
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};
// Admin Signup
exports.signup = async (req, res) => {
    const { email, password } = req.body;
    const otp = generateOTP();
  
    try {
      // Create admin without OTP verification
      const admin = await Admin.create({
        email,
        password,
      });
      
      // Store OTP in OTP store table
      await Otp.create({
        email,
        otp,
        otp_expiry: new Date(Date.now() + 600000), // OTP expires in 10 minutes
      });
      
      // Send OTP to admin email
      await sendOTP(email, otp);
      res.status(200).json({ message: 'OTP sent to your email' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  // Verify OTP
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      // Find the OTP associated with the email
      const otpData = await Otp.findOne({
        where: { email },
        order: [['otp_expiry', 'DESC']], // Get the most recent OTP
      });
  
      if (!otpData) {
        return res.status(400).json({ error: 'OTP not found' });
      }
  
      if (otpData.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
      }
  
      if (otpData.otp_expiry < new Date()) {
        return res.status(400).json({ error: 'OTP expired' });
      }
  
      // OTP is valid, delete OTP after successful verification
      await otpData.destroy();
  
      res.status(200).json({ message: 'OTP verified successfully. You can now sign in.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
// Admin Signin
/*exports.signin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const admin = await Admin.findOne({ where: { email } });
      if (!admin) return res.status(404).json({ error: 'Admin not found' });
  
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
  
      const token = jwt.sign({ id: admin.admin_id }, 'your-secret-key', { expiresIn: '10000h' });
      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };*/


  // Admin Signin with Dashboard Metrics using Sequelize ORM
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Get dashboard metrics
    const dashboardMetrics = await getDashboardMetrics();
    
    const token = jwt.sign({ id: admin.admin_id }, 'your-secret-key', { expiresIn: '10000h' });
    
    res.status(200).json({ 
      token,
      admin: {
        id: admin.admin_id,
        email: admin.email
      },
      metrics: dashboardMetrics
    });
  } catch (err) {
    console.error('Error in admin signin:', err);
    res.status(500).json({ error: err.message });
  }
};


/*async function getDashboardMetrics() {
try {
  // Count total recruiters using Sequelize count()
  const totalRecruiters = await Recruiter.count();
  
  // Count total jobs posted
  const totalJobs = await JobPost.count();
  
  // Count total applications
  const totalApplications = await JobApplication.count();
  
  // Count unique candidates who applied
  const uniqueCandidates = await JobApplication.count({
    distinct: true,
    col: 'candidate_id'
  });
  
  // Additional metrics you might want
  
  // Count active jobs
  const activeJobs = await JobPost.count({
    where: { is_active: true }
  });
  
  // Count approved jobs
  const approvedJobs = await JobPost.count({
    where: { status: 'approved' }
  });
  
  // Count pending jobs
  const pendingJobs = await JobPost.count({
    where: { status: 'pending' }
  });
  
  // Count rejected jobs
  const rejectedJobs = await JobPost.count({
    where: { status: 'rejected' }
  });
  
  return {
    totalRecruiters,
    totalJobs,
    totalApplications,
    uniqueCandidates,
    activeJobs,
    approvedJobs,
    pendingJobs,
    rejectedJobs
  };
} catch (error) {
  console.error('Error getting dashboard metrics:', error);
  return {
    totalRecruiters: 0,
    totalJobs: 0,
    totalApplications: 0,
    uniqueCandidates: 0,
    activeJobs: 0,
    approvedJobs: 0,
    pendingJobs: 0,
    rejectedJobs: 0
  };
}
}*/

// Move the getDashboardMetrics function outside of the signin method
// and make it an exported controller method

// Add this to your exports
exports.getDashboardMetrics = async (req, res) => {
  try {
    const metrics = await getDashboardMetrics();
    res.status(200).json({ metrics });
  } catch (err) {
    console.error('Error fetching dashboard metrics:', err);
    res.status(500).json({ error: err.message });
  }
};

// Keep the helper function as it is, but move it outside of the signin method
async function getDashboardMetrics() {
  try {
    // Count total recruiters using Sequelize count()
    const totalRecruiters = await Recruiter.count();
    
    // Count total jobs posted
    const totalJobs = await JobPost.count();
    
    // Count total applications
    const totalApplications = await JobApplication.count();
    
    // Count unique candidates who applied
    const uniqueCandidates = await JobApplication.count({
      distinct: true,
      col: 'candidate_id'
    });
    
    // Additional metrics you might want
    
    // Count active jobs
    const activeJobs = await JobPost.count({
      where: { is_active: true }
    });
    
    // Count approved jobs
    const approvedJobs = await JobPost.count({
      where: { status: 'approved' }
    });
    
    // Count pending jobs
    const pendingJobs = await JobPost.count({
      where: { status: 'pending' }
    });
    
    // Count rejected jobs
    const rejectedJobs = await JobPost.count({
      where: { status: 'rejected' }
    });
    
    return {
      totalRecruiters,
      totalJobs,
      totalApplications,
      uniqueCandidates,
      activeJobs,
      approvedJobs,
      pendingJobs,
      rejectedJobs
    };
  } catch (error) {
    console.error('Error getting dashboard metrics:', error);
    return {
      totalRecruiters: 0,
      totalJobs: 0,
      totalApplications: 0,
      uniqueCandidates: 0,
      activeJobs: 0,
      approvedJobs: 0,
      pendingJobs: 0,
      rejectedJobs: 0
    };
  }
}



// Admin creates recruiter
exports.createRecruiter = async (req, res) => {
  const { email, password, name, company_name } = req.body;
  const adminId = req.admin.id;  // Assuming admin's ID comes from the JWT token

  try {
    // Check if recruiter already exists
    const existingRecruiter = await Recruiter.findOne({ where: { email } });
    if (existingRecruiter) {
      return res.status(400).json({ error: 'Recruiter already exists' });
    }
    
    // Create the recruiter with associated admin_id
    const recruiter = await Recruiter.create({
      name: name || 'Recruiter', // Default if name is not provided
      email,
      password, // The beforeSave hook will handle password hashing
      company_name: company_name || null, // Optional company name
      admin_id: adminId // Associate the recruiter with the admin
    });
    
    // Send email notification to the recruiter
    const mailOptions = {
      from: process.env.MAIL_DEFAULT_SENDER || process.env.MAIL_USERNAME,
      to: email,
      subject: "Your Recruiter Account Credentials",
      text: `Hello ${name || 'Recruiter'},

Your recruiter account${company_name ? ` for ${company_name}` : ''} has been created successfully.

Your login credentials are:
Email: ${email}
Password: ${password}

Please change your password after logging in for security purposes.

Best regards,
The Admin Team`
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to recruiter: ${email}`);
    } catch (emailError) {
      console.error(`Error sending email to ${email}:`, emailError);
      // We still continue as the account creation was successful
    }

    res.status(200).json({ 
      message: 'Recruiter created successfully and notification email sent',
      recruiter: {
        id: recruiter.recruiter_id,
        email: recruiter.email,
        name: recruiter.name,
        company_name: recruiter.company_name
      }
    });
  } catch (err) {
    console.error('Error creating recruiter:', err);
    res.status(500).json({ error: err.message });
  }
};  

// Edit Job
exports.editJob = async (req, res) => {
  const { jobId } = req.params;
  const { title, description } = req.body;

  try {
    const job = await JobPost.findByPk(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    job.title = title || job.title;
    job.description = description || job.description;
    await job.save();
    res.status(200).json({ message: 'Job updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Bulk Data Upload 
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

exports.bulkUploadCandidates = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const results = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        results.push(row);
      })
      .on("end", async () => {
        try {
          const insertedCandidates = [];

          for (let candidate of results) {
            // Generate a random password (8-10 characters)
            const plainPassword = Math.random().toString(36).slice(-10);

            // Hash the password before saving to DB
            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            //Store the resume path 
            const resumePath =
              candidate.resume && candidate.resume.trim() !== ""
                ? path.join("uploads/resumes", candidate.resume)
                : "uploads/resumes/default_resume.pdf"; // Default path if not provided

            // Insert into `signin` table
            const insertedCandidate = await Signin.create({
              name: candidate.name,
              email: candidate.email,
              phone: candidate.phone,
              resume: resumePath, // Now handled properly
              hashed_password: hashedPassword,
            });

            // Send email with the plain password
            const mailOptions = {
              from: process.env.MAIL_DEFAULT_SENDER,
              to: candidate.email,
              subject: "Your Account Credentials",
              text: `Hello ${candidate.name},\n\nYour account has been created successfully.\n\nYour login credentials are:\nEmail: ${candidate.email}\nPassword: ${plainPassword}\n\nPlease change your password after logging in.\n\nBest regards,\nYour Team`,
            };

            try {
              await transporter.sendMail(mailOptions);
              console.log(`Email sent to ${candidate.email}`);
            } catch (emailError) {
              console.error(`Error sending email to ${candidate.email}:`, emailError);
            }

            insertedCandidates.push(insertedCandidate);
          }

          return res.status(200).json({
            message: "Candidates uploaded and emails sent successfully",
            data: insertedCandidates,
          });
        } catch (error) {
          console.error("Error inserting data:", error);
          return res.status(500).json({ message: "Error inserting candidates" });
        }
      });
  } catch (error) {
    console.error("Error processing file:", error);
    return res.status(500).json({ message: "Error processing file" });
  }
};


// Get All Pending Jobs for Approval
/*exports.getPendingJobs = async (req, res) => {
  try {
    const jobs = await JobPost.findAll({
      where: { status: 'pending' },
      include: [{ model: Recruiter, attributes: ['email','name'] }],
    });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};*/


exports.getPendingJobs = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get total count for pagination
    const totalCount = await JobPost.count({
      where: { status: 'pending' }
    });
    
    // Get pending jobs with pagination
    const jobs = await JobPost.findAll({
      where: { status: 'pending' },
      include: [{ model: Recruiter, attributes: ['email', 'name'] }],
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']] // Add an order to ensure consistent pagination
    });
    
    // Return with pagination metadata
    res.status(200).json({
      success: true,
      count: jobs.length,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      jobs: jobs
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching pending jobs',
      error: err.message 
    });
  }
};


// Approve a Job
exports.approveJob = async (req, res) => {
  const { jobId } = req.params;
  const adminId = req.admin.id; // Admin ID from JWT token

  try {
    const job = await JobPost.findByPk(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    if (job.status === "approved") {
        return res.status(400).json({ success: false, message: "Job post is already approved" });
    }

    job.status = 'approved';
    job.approvedBy = adminId; // Use the correct field name
    await job.save();

    res.status(200).json({ message: 'Job approved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.rejectJob = async (req, res) => {
  const { jobId } = req.params;
  const adminId = req.admin.id; // Admin ID from JWT token
  const { rejectionReason } = req.body; // Get rejection reason from request body

  try {
    const job = await JobPost.findByPk(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    if (job.status === "rejected") {
        return res.status(400).json({ success: false, message: "Job post is already rejected" });
    }

    // Update job status
    job.status = 'rejected';
    job.rejectedBy = adminId;
    
    // Use the rejection reason from the request body
    // If no reason is provided, send an error response asking for a reason
    if (!rejectionReason) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a rejection reason in the request body" 
      });
    }
    
    // Set the rejection reason to the one provided in the request
    job.rejection_reason = rejectionReason;
    await job.save();

    res.status(200).json({ 
      success: true,
      message: 'Job rejected successfully', 
      rejectionReason: rejectionReason 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Approved Jobs by Admin
/*exports.getApprovedJobs = async (req, res) => {
  const adminId = req.admin.id; // Admin ID from JWT token

  try {
    const jobs = await JobPost.findAll({
      where: { approvedBy: adminId, status: 'approved' },
      include: [{ model: Recruiter, attributes: ['email','name'] }],
    });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};*/

// Get All Rejected Jobs by Admin
/*exports.getRejectedJobs = async (req, res) => {
  const adminId = req.admin.id; // Admin ID from JWT token

  try {
    const jobs = await JobPost.findAll({
      where: { rejectedBy: adminId, status: 'rejected' },
      include: [{ model: Recruiter, attributes: ['email','name'] }],
    });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};*/


exports.getRejectedJobs = async (req, res) => {
  const adminId = req.admin.id; // Admin ID from JWT token
  
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get total count for pagination
    const totalCount = await JobPost.count({
      where: { rejectedBy: adminId, status: 'rejected' }
    });
    
    // Get rejected jobs with pagination
    const jobs = await JobPost.findAll({
      where: { rejectedBy: adminId, status: 'rejected' },
      include: [{ model: Recruiter, attributes: ['email', 'name'] }],
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']] // Add an order to ensure consistent pagination
    });
    
    // Return with pagination metadata
    res.status(200).json({
      success: true,
      count: jobs.length,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      jobs: jobs
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching rejected jobs',
      error: err.message 
    });
  }
};

exports.getApprovedJobs = async (req, res) => {
  const adminId = req.admin.id; // Admin ID from JWT token
  
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get total count for pagination
    const totalCount = await JobPost.count({
      where: { approvedBy: adminId, status: 'approved' }
    });
    
    // Get approved jobs with pagination
    const jobs = await JobPost.findAll({
      where: { approvedBy: adminId, status: 'approved' },
      include: [{ model: Recruiter, attributes: ['email', 'name'] }],
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']] // Add an order to ensure consistent pagination
    });
    
    // Return with pagination metadata
    res.status(200).json({
      success: true,
      count: jobs.length,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      jobs: jobs
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching approved jobs',
      error: err.message 
    });
  }
};

// Get Job by ID
exports.getJobById = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await JobPost.findByPk(jobId, {
      include: [{ model: Recruiter, attributes: ['email', 'name'] }],
    });
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getAllJobs = async (req, res) => {
  try {
    // Get pagination parameters from query string with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalCount = await JobPost.count({
      include: [{ model: Recruiter, attributes: ['email', 'name'] }]
    });

    // Get paginated jobs
    const jobs = await JobPost.findAll({
      include: [{ model: Recruiter, attributes: ['email', 'name'] }],
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset
    });
    
    // Return jobs with pagination metadata
    res.status(200).json({
      success: true,
      count: jobs.length,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      jobs: jobs
    });
  } catch (err) {
    console.error('Error fetching all jobs:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching all jobs',
      error: err.message 
    });
  }
};

// Delete Job
exports.deleteJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await JobPost.findByPk(jobId);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    await job.destroy();
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Recruiters
/*exports.getRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.findAll({
      attributes: ['recruiter_id', 'name', 'email', 'company_name'],
      order: [['recruiter_id', 'DESC']]
    });
    
    res.status(200).json(recruiters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};*/

// Get All Recruiters with Pagination
exports.getRecruiters = async (req, res) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Get total count for pagination metadata
    const totalCount = await Recruiter.count();
    
    // Get paginated results
    const recruiters = await Recruiter.findAll({
      attributes: ['recruiter_id', 'name', 'email', 'company_name'],
      order: [['recruiter_id', 'DESC']],
      offset: offset,
      limit: limit
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);
    
    // Construct pagination metadata
    const pagination = {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: totalCount,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    };
    
    // Return response with data and pagination metadata
    res.status(200).json({
      success: true,
      data: recruiters,
      pagination: pagination
    });
    
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};


// Get Recent Recruiters for Dashboard
exports.getRecentRecruiters = async (req, res) => {
  try {
    // Get count from query params or default to 5
    const count = parseInt(req.query.count) || 5;
    
    // Fetch the most recently created recruiters
    const recentRecruiters = await Recruiter.findAll({
      attributes: ['recruiter_id', 'name', 'email', 'company_name'],
      order: [['recruiter_id', 'DESC']], // Order by creation date, newest first
      limit: count
    });
    
    res.status(200).json({
      success: true,
      data: recentRecruiters
    });
    
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// Update Recruiter Details (PATCH method)
exports.updateRecruiter = async (req, res) => {
  const { recruiterId } = req.params;
  const { name, password, email, companyName } = req.body;
  
  try {
    // Find the recruiter by ID
    const recruiter = await Recruiter.findByPk(recruiterId);
    if (!recruiter) {
      return res.status(404).json({ 
        success: false, 
        message: "Recruiter not found" 
      });
    }

    // Check if email is being updated and validate it
    if (email && email !== recruiter.email) {
      // Check if email is already in use by another recruiter
      const existingRecruiter = await Recruiter.findOne({ 
        where: { 
          email: email,
          recruiter_id: { [Sequelize.Op.ne]: recruiterId } // Not equal to current recruiter
        } 
      });
      
      if (existingRecruiter) {
        return res.status(400).json({ 
          success: false, 
          message: "Email is already in use by another recruiter" 
        });
      }
    }

    // Create an object to store fields to update
    const updateFields = {};
    
    // Only update fields that are provided in the request
    if (name) updateFields.name = name;
    if (companyName) updateFields.company_name = companyName;
    if (email) updateFields.email = email;
    
    // If password is provided, hash it before saving
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }
    
    console.log('Updating recruiter with fields:', updateFields);
    
    // Update the recruiter with the new values
    await recruiter.update(updateFields);
    
    // Fetch the latest data after update
    const refreshedRecruiter = await Recruiter.findByPk(recruiterId);
    
    // Return the updated recruiter (excluding password)
    const updatedRecruiter = {
      recruiter_id: refreshedRecruiter.recruiter_id,
      name: refreshedRecruiter.name,
      email: refreshedRecruiter.email,
      company_name: refreshedRecruiter.company_name,
    };
    
    res.status(200).json({
      success: true,
      message: "Recruiter details updated successfully",
      data: updatedRecruiter
    });
    
  } catch (err) {
    console.error('Error updating recruiter:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};


exports.bulkUploadJobs = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "No file uploaded" 
      });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let results = [];

    // Process file based on its extension
    if (fileExtension === '.csv') {
      // Process CSV file
      results = await processCSV(filePath);
    } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      // Process Excel file
      results = processExcel(filePath);
    } else {
      // Clean up the uploaded file
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });

      return res.status(400).json({
        success: false,
        message: "Unsupported file format. Please upload CSV, XLSX, or XLS file."
      });
    }

    // Process results and insert into database
    const { insertedJobs, errors } = await insertJobs(results);

    // Clean up the uploaded file
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    return res.status(200).json({
      success: true,
      message: `${insertedJobs.length} jobs uploaded successfully${errors.length > 0 ? ` with ${errors.length} errors` : ''}`,
      data: insertedJobs,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error("Error processing file:", error);
    
    // Clean up the uploaded file if it exists
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: "Error processing file",
      error: error.message
    });
  }
};

// Function to process CSV file
function processCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        results.push(row);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// Function to process Excel file
function processExcel(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheet_name_list = workbook.SheetNames;
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    return data;
  } catch (error) {
    throw new Error(`Error processing Excel file: ${error.message}`);
  }
}

// Function to insert jobs into database
async function insertJobs(jobsData) {
  const insertedJobs = [];
  const errors = [];

  for (let [index, job] of jobsData.entries()) {
    try {
      // Prepare job data with proper data types
      const jobData = {
        recruiter_id: parseInt(job.recruiter_id) || null,
        jobTitle: job.jobTitle,
        employmentType: job.employmentType,
        keySkills: job.keySkills,
        department: job.department || null,
        workMode: job.workMode,
        locations: job.locations,
        industry: job.industry || null,
        diversityHiring: job.diversityHiring === 'true' || job.diversityHiring === '1' || job.diversityHiring === true ? true : false,
        jobDescription: job.jobDescription,
        multipleVacancies: job.multipleVacancies === 'true' || job.multipleVacancies === '1' || job.multipleVacancies === true ? true : false,
        companyName: job.companyName,
        companyInfo: job.companyInfo || null,
        companyAddress: job.companyAddress || null,
        min_salary: job.min_salary ? parseFloat(job.min_salary) : null,
        max_salary: job.max_salary ? parseFloat(job.max_salary) : null,
        min_experience: job.min_experience !== undefined ? parseInt(job.min_experience) : null,
        max_experience: job.max_experience !== undefined ? parseInt(job.max_experience) : null,
        is_active: job.is_active === 'true' || job.is_active === '1' || job.is_active === true ? true : false,
        status: job.status || 'pending' // Default to pending if not specified
      };

      // Validate required fields
      const requiredFields = ['jobTitle', 'employmentType', 'keySkills', 'workMode', 'locations', 'jobDescription', 'companyName'];
      const missingFields = requiredFields.filter(field => !jobData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Insert job into database
      const insertedJob = await JobPost.create(jobData);
      insertedJobs.push(insertedJob);
    } catch (jobError) {
      errors.push({
        row: index + 2, // +2 because index is 0-based and we account for header row
        message: jobError.message,
        data: job
      });
      console.error(`Error inserting job at row ${index + 2}:`, jobError);
    }
  }

  return { insertedJobs, errors };
}


// Function to generate and download a job template
exports.downloadJobTemplate = (req, res) => {
  try {
    // Define the template headers and sample data
    const templateHeaders = [
      'recruiter_id',
      'jobTitle',
      'employmentType',
      'keySkills',
      'department',
      'workMode',
      'locations',
      'industry',
      'diversityHiring',
      'jobDescription',
      'multipleVacancies',
      'companyName',
      'companyInfo',
      'companyAddress',
      'min_salary',
      'max_salary',
      'min_experience',
      'max_experience',
      'is_active',
      'status'
    ];

    const sampleData = [
      {
        recruiter_id: '10',
        jobTitle: 'Full Stack Developer',
        employmentType: 'Full-time',
        keySkills: 'React, Node.js, MongoDB',
        department: 'IT',
        workMode: 'Remote',
        locations: 'Bangalore',
        industry: 'Information Technology',
        diversityHiring: '1',
        jobDescription: 'We are looking for a Full Stack Developer to join our team...',
        multipleVacancies: '1',
        companyName: 'ABC Tech',
        companyInfo: 'Leading technology company',
        companyAddress: '123 Tech Park, Bangalore',
        min_salary: '2500000',
        max_salary: '3500000',
        min_experience: '2',
        max_experience: '5',
        is_active: '1',
        status: 'pending'
      },
      {
        recruiter_id: '11',
        jobTitle: 'Data Scientist',
        employmentType: 'Full-time',
        keySkills: 'Python, R, Machine Learning',
        department: 'Data Science',
        workMode: 'Hybrid',
        locations: 'Mumbai',
        industry: 'Information Technology',
        diversityHiring: '0',
        jobDescription: 'Seeking an experienced Data Scientist to work on challenging projects...',
        multipleVacancies: '0',
        companyName: 'XYZ Analytics',
        companyInfo: 'Data analytics firm',
        companyAddress: '456 Business Park, Mumbai',
        min_salary: '3000000',
        max_salary: '4500000',
        min_experience: '3',
        max_experience: '7',
        is_active: '1',
        status: 'pending'
      }
    ];

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sampleData, { header: templateHeaders });

    // Add column widths to improve readability
    const colWidths = [
      { wch: 12 }, // recruiter_id
      { wch: 25 }, // jobTitle
      { wch: 15 }, // employmentType
      { wch: 30 }, // keySkills
      { wch: 15 }, // department
      { wch: 15 }, // workMode
      { wch: 20 }, // locations
      { wch: 20 }, // industry
      { wch: 15 }, // diversityHiring
      { wch: 50 }, // jobDescription
      { wch: 15 }, // multipleVacancies
      { wch: 25 }, // companyName
      { wch: 30 }, // companyInfo
      { wch: 30 }, // companyAddress
      { wch: 15 }, // min_salary
      { wch: 15 }, // max_salary
      { wch: 15 }, // min_experience
      { wch: 15 }, // max_experience
      { wch: 10 }, // is_active
      { wch: 10 }  // status
    ];
    ws['!cols'] = colWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Jobs Template');

    // Create a temporary file path
    const tempFilePath = path.join(__dirname, '../temp', `jobs-template-${Date.now()}.xlsx`);
    
    // Ensure the temp directory exists
    const tempDir = path.dirname(tempFilePath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Write the workbook to a file
    XLSX.writeFile(wb, tempFilePath);

    // Send the file as a download
    res.download(tempFilePath, 'jobs-template.xlsx', (err) => {
      // Delete the temporary file after sending
      fs.unlink(tempFilePath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
      });

      if (err) {
        console.error('Error sending template file:', err);
        if (!res.headersSent) {
          return res.status(500).json({
            success: false,
            message: 'Error sending template file',
            error: err.message
          });
        }
      }
    });
  } catch (error) {
    console.error('Error generating template:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating template',
      error: error.message
    });
  }
};

// Update Admin Password
exports.updatePassword = async (req, res) => {
  const adminId = req.admin.id; // Get admin ID from JWT token
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

    // Find the admin by ID
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: "Admin not found" 
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
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
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (err) {
    console.error('Error updating admin password:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};


// Delete Recruiter by Admin (with all associated data)
exports.deleteRecruiter = async (req, res) => {
  const { recruiterId } = req.params;
  const adminId = req.admin.id; // Admin ID from JWT token
  
  // Start a transaction
  const transaction = await sequelize.transaction();
  
  try {
    // Find the recruiter by ID
    const recruiter = await Recruiter.findByPk(recruiterId, { transaction });
    if (!recruiter) {
      await transaction.rollback();
      return res.status(404).json({ 
        success: false, 
        message: "Recruiter not found" 
      });
    }

    // Get recruiter details for logging and response
    const recruiterDetails = {
      id: recruiter.recruiter_id,
      name: recruiter.name,
      email: recruiter.email,
      company_name: recruiter.company_name
    };

    // Find all associated jobs
    const jobs = await JobPost.findAll({
      where: { recruiter_id: recruiterId },
      transaction
    });

    // Delete all job applications for these jobs
    if (jobs.length > 0) {
      const jobIds = jobs.map(job => job.job_id);
      await JobApplication.destroy({
        where: { 
          job_id: { [Op.in]: jobIds } 
        },
        transaction
      });
      
      console.log(`Deleted applications for ${jobIds.length} jobs`);
    }

    // Delete all jobs
    const deletedJobsCount = await JobPost.destroy({
      where: { recruiter_id: recruiterId },
      transaction
    });
    
    console.log(`Deleted ${deletedJobsCount} jobs`);

    // Delete all draft jobs if using TempJobPost model
    const deletedDraftsCount = await TempJobPost.destroy({
      where: { recruiter_id: recruiterId },
      transaction
    });
    
    console.log(`Deleted ${deletedDraftsCount} job drafts`);

    // Delete the recruiter
    await recruiter.destroy({ transaction });

    // Commit the transaction
    await transaction.commit();

    // Log the deletion
    console.log(`Admin ${adminId} deleted recruiter:`, recruiterDetails);

    // Return success response
    res.status(200).json({
      success: true,
      message: "Recruiter and all associated data deleted successfully",
      deletedRecruiter: recruiterDetails,
      summary: {
        deletedJobs: jobs.length,
        deletedDrafts: deletedDraftsCount
      }
    });
    
  } catch (err) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    console.error('Error deleting recruiter:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};


// Get all recruiters with their device usage
exports.getRecruitersDeviceUsage = async (req, res) => {
  try {
    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get total count
    const totalCount = await Recruiter.count();
    
    // Get recruiters with pagination
    const recruiters = await Recruiter.findAll({
      attributes: ['recruiter_id', 'name', 'email', 'company_name'],
      order: [['recruiter_id', 'DESC']],
      limit,
      offset
    });
    
    // Get device and subscription data for each recruiter
    const recruitersWithData = await Promise.all(recruiters.map(async (recruiter) => {
      const recruiterData = recruiter.toJSON();
      
      // Get subscription data
      const subscription = await ClientSubscription.findOne({
        where: {
          client_id: recruiter.recruiter_id,
          is_active: true
        }
      });
      
      // Count active devices
      const activeDevicesCount = await ClientLoginDevice.count({
        where: {
          client_id: recruiter.recruiter_id,
          is_active: true
        }
      });
      
      // Get most recent login
      const mostRecentDevice = await ClientLoginDevice.findOne({
        where: {
          client_id: recruiter.recruiter_id,
          is_active: true
        },
        order: [['last_login', 'DESC']]
      });
      
      return {
        ...recruiterData,
        subscription: subscription ? {
          id: subscription.subscription_id,
          login_allowed: subscription.login_allowed,
          cv_download_quota: subscription.cv_download_quota,
          start_date: subscription.start_date,
          end_date: subscription.end_date
        } : null,
        device_stats: {
          active_devices: activeDevicesCount,
          max_allowed: subscription ? subscription.login_allowed : 0,
          usage_percentage: subscription ? Math.round((activeDevicesCount / subscription.login_allowed) * 100) : 0,
          last_login: mostRecentDevice ? mostRecentDevice.last_login : null
        }
      };
    }));
    
    return res.status(200).json({
      success: true,
      total: totalCount,
      page,
      total_pages: Math.ceil(totalCount / limit),
      recruiters: recruitersWithData
    });
  } catch (error) {
    console.error('Error fetching recruiters device usage:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching recruiters device usage',
      error: error.message
    });
  }
};

// Get all devices for a specific recruiter
exports.getRecruiterDevices = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    
    // Check if recruiter exists
    const recruiter = await Recruiter.findByPk(recruiterId);
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }
    
    // Get subscription data
    const subscription = await ClientSubscription.findOne({
      where: {
        client_id: recruiterId,
        is_active: true
      }
    });
    
    // Get all devices
    const devices = await ClientLoginDevice.findAll({
      where: {
        client_id: recruiterId
      },
      order: [['last_login', 'DESC']]
    });
    
    // Process devices to add device type information
    const processedDevices = devices.map(device => {
      const deviceData = device.toJSON();
      
      // Format dates
      deviceData.last_login_formatted = formatDate(deviceData.last_login);
      deviceData.start_date_formatted = formatDate(deviceData.start_date);
      deviceData.end_date_formatted = deviceData.end_date ? formatDate(deviceData.end_date) : 'No expiry';
      
      // Parse user agent to get device info
      deviceData.device_info = parseUserAgent(deviceData.user_agent);
      
      return deviceData;
    });
    
    // Count active devices
    const activeDevices = processedDevices.filter(device => device.is_active).length;
    
    return res.status(200).json({
      success: true,
      recruiter: {
        id: recruiter.recruiter_id,
        name: recruiter.name,
        email: recruiter.email,
        company_name: recruiter.company_name
      },
      subscription: subscription ? {
        id: subscription.subscription_id,
        login_allowed: subscription.login_allowed,
        cv_download_quota: subscription.cv_download_quota,
        start_date: subscription.start_date,
        end_date: subscription.end_date
      } : null,
      devices: processedDevices,
      stats: {
        total_devices: devices.length,
        active_devices: activeDevices,
        max_allowed: subscription ? subscription.login_allowed : 0,
        remaining_slots: subscription ? Math.max(0, subscription.login_allowed - activeDevices) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching recruiter devices:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching recruiter devices',
      error: error.message
    });
  }
};

// Remove a device from a recruiter
exports.removeRecruiterDevice = async (req, res) => {
  try {
    const { recruiterId, deviceId } = req.params;
    
    // Check if device exists and belongs to the recruiter
    const device = await ClientLoginDevice.findOne({
      where: {
        device_id: deviceId,
        client_id: recruiterId
      }
    });
    
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found or does not belong to this recruiter'
      });
    }
    
    // Soft delete by deactivating the device
    await device.update({
      is_active: false
    });
    
    return res.status(200).json({
      success: true,
      message: 'Device removed successfully'
    });
  } catch (error) {
    console.error('Error removing device:', error);
    return res.status(500).json({
      success: false,
      message: 'Error removing device',
      error: error.message
    });
  }
};

// Update recruiter subscription
exports.updateRecruiterSubscription = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const { login_allowed, cv_download_quota, start_date, end_date } = req.body;
    
    // Check if recruiter exists
    const recruiter = await Recruiter.findByPk(recruiterId);
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }
    
    // Find existing subscription or create new one
    let subscription = await ClientSubscription.findOne({
      where: {
        client_id: recruiterId,
        is_active: true
      }
    });
    
    if (subscription) {
      // Update existing subscription
      await subscription.update({
        login_allowed: login_allowed !== undefined ? login_allowed : subscription.login_allowed,
        cv_download_quota: cv_download_quota !== undefined ? cv_download_quota : subscription.cv_download_quota,
        start_date: start_date || subscription.start_date,
        end_date: end_date !== undefined ? end_date : subscription.end_date
      });
    } else {
      // Create new subscription
      subscription = await ClientSubscription.create({
        client_id: recruiterId,
        login_allowed: login_allowed || 2,
        cv_download_quota: cv_download_quota || 0,
        start_date: start_date || new Date(),
        end_date: end_date || null,
        is_active: true
      });
    }
    
    // If login_allowed was decreased, deactivate excess devices
    if (login_allowed !== undefined && login_allowed < subscription.login_allowed) {
      const activeDevices = await ClientLoginDevice.findAll({
        where: {
          client_id: recruiterId,
          is_active: true
        },
        order: [['last_login', 'DESC']]
      });
      
      if (activeDevices.length > login_allowed) {
        // Keep the most recently used devices up to login_allowed
        const devicesToDeactivate = activeDevices.slice(login_allowed);
        
        for (const device of devicesToDeactivate) {
          await device.update({
            is_active: false
          });
        }
      }
    }
    
    return res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      subscription
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating subscription',
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

// Helper function to parse user agent string
function parseUserAgent(userAgent) {
  if (!userAgent) return 'Unknown device';
  
  let deviceInfo = {};
  
  // Browser detection
  if (userAgent.includes('Firefox')) {
    deviceInfo.browser = 'Firefox';
  } else if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    deviceInfo.browser = 'Chrome';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    deviceInfo.browser = 'Safari';
  } else if (userAgent.includes('Edg')) {
    deviceInfo.browser = 'Edge';
  } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
    deviceInfo.browser = 'Internet Explorer';
  } else {
    deviceInfo.browser = 'Unknown browser';
  }
  
  // Device type detection
  if (userAgent.includes('Mobile')) {
    deviceInfo.type = 'Mobile';
  } else if (userAgent.includes('Tablet')) {
    deviceInfo.type = 'Tablet';
  } else {
    deviceInfo.type = 'Desktop';
  }
  
  // OS detection
  if (userAgent.includes('Windows')) {
    deviceInfo.os = 'Windows';
  } else if (userAgent.includes('Mac OS')) {
    deviceInfo.os = 'macOS';
  } else if (userAgent.includes('Linux')) {
    deviceInfo.os = 'Linux';
  } else if (userAgent.includes('Android')) {
    deviceInfo.os = 'Android';
  } else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    deviceInfo.os = 'iOS';
  } else {
    deviceInfo.os = 'Unknown OS';
  }
  
  return deviceInfo;
}



// Create a new client
exports.createClient = async (req, res) => {
  const { client_name, address, contact_person, email, phone } = req.body;
  
  try {
    // Validate required fields
    if (!client_name) {
      return res.status(400).json({
        success: false,
        message: "Client name is required"
      });
    }
    
    // Check if client with same email already exists
    if (email) {
      const existingClient = await MasterClient.findOne({ 
        where: { email }
      });
      
      if (existingClient) {
        return res.status(400).json({
          success: false,
          message: "A client with this email already exists"
        });
      }
    }
    
    // Create the client
    const client = await MasterClient.create({
      client_name,
      address,
      contact_person,
      email,
      phone
    });
    
    res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client
    });
  } catch (err) {
    console.error('Error creating client:', err);
    res.status(500).json({
      success: false,
      message: "Error creating client",
      error: err.message
    });
  }
};

// Get all clients with pagination
exports.getAllClients = async (req, res) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Get total count for pagination metadata
    const totalCount = await MasterClient.count();
    
    // Get paginated results
    const clients = await MasterClient.findAll({
      order: [['client_id', 'DESC']],
      offset: offset,
      limit: limit
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);
    
    // Construct pagination metadata
    const pagination = {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: totalCount,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    };
    
    // Return response with data and pagination metadata
    res.status(200).json({
      success: true,
      data: clients,
      pagination: pagination
    });
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({
      success: false,
      message: "Error fetching clients",
      error: err.message
    });
  }
};

// Get a single client by ID
exports.getClientById = async (req, res) => {
  const { clientId } = req.params;
  
  try {
    const client = await MasterClient.findByPk(clientId);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: client
    });
  } catch (err) {
    console.error('Error fetching client:', err);
    res.status(500).json({
      success: false,
      message: "Error fetching client",
      error: err.message
    });
  }
};

// Update client details (PATCH method)
exports.updateClient = async (req, res) => {
  const { clientId } = req.params;
  const { client_name, address, contact_person, email, phone } = req.body;
  
  try {
    // Find the client by ID
    const client = await MasterClient.findByPk(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }
    
    // Check if updating to an email that already exists with another client
    if (email && email !== client.email) {
      const existingClient = await MasterClient.findOne({
        where: {
          email,
          client_id: { [Op.ne]: clientId }
        }
      });
      
      if (existingClient) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another client"
        });
      }
    }
    
    // Prepare update object with only provided fields
    const updateFields = {};
    if (client_name) updateFields.client_name = client_name;
    if (address !== undefined) updateFields.address = address;
    if (contact_person !== undefined) updateFields.contact_person = contact_person;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    
    // Update client with provided fields
    await client.update(updateFields);
    
    // Fetch the updated client
    const updatedClient = await MasterClient.findByPk(clientId);
    
    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: updatedClient
    });
  } catch (err) {
    console.error('Error updating client:', err);
    res.status(500).json({
      success: false,
      message: "Error updating client",
      error: err.message
    });
  }
};

// Delete a client
exports.deleteClient = async (req, res) => {
  const { clientId } = req.params;
  const transaction = await sequelize.transaction();
  
  try {
    // Find the client
    const client = await MasterClient.findByPk(clientId, { transaction });
    
    if (!client) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }
    
    // Get client details for response
    const clientDetails = {
      id: client.client_id,
      name: client.client_name,
      email: client.email
    };
    
    // Delete the client
    await client.destroy({ transaction });
    
    // Commit the transaction
    await transaction.commit();
    
    res.status(200).json({
      success: true,
      message: "Client deleted successfully",
      data: clientDetails
    });
  } catch (err) {
    // Rollback in case of error
    await transaction.rollback();
    console.error('Error deleting client:', err);
    res.status(500).json({
      success: false,
      message: "Error deleting client",
      error: err.message
    });
  }
};

// Search clients
exports.searchClients = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }
    
    // Perform search across multiple fields
    const clients = await MasterClient.findAll({
      where: {
        [Op.or]: [
          { client_name: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
          { phone: { [Op.like]: `%${query}%` } },
          { contact_person: { [Op.like]: `%${query}%` } }
        ]
      },
      order: [['client_id', 'DESC']],
      limit: 20 // Limit the number of results
    });
    
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (err) {
    console.error('Error searching clients:', err);
    res.status(500).json({
      success: false,
      message: "Error searching clients",
      error: err.message
    });
  }
};

// Get recent clients for dashboard
exports.getRecentClients = async (req, res) => {
  try {
    // Get count from query params or default to 5
    const count = parseInt(req.query.count) || 5;
    
    // Fetch the most recently created clients
    const recentClients = await MasterClient.findAll({
      order: [['created_at', 'DESC']], // Most recent first
      limit: count
    });
    
    res.status(200).json({
      success: true,
      data: recentClients
    });
  } catch (err) {
    console.error('Error fetching recent clients:', err);
    res.status(500).json({
      success: false,
      message: "Error fetching recent clients",
      error: err.message
    });
  }
};



// Create a new client subscription
exports.createClientSubscription = async (req, res) => {
  const { client_id, cv_download_quota, login_allowed, start_date, end_date } = req.body;
  
  try {
    // Validate required fields
    if (!client_id || !cv_download_quota || !login_allowed) {
      return res.status(400).json({
        success: false,
        message: "Client ID, CV download quota, and login allowed count are required"
      });
    }
    
    // Check if client exists
    const client = await MasterClient.findByPk(client_id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }
    
    // Check if an active subscription already exists
    const existingSubscription = await ClientSubscription.findOne({
      where: {
        client_id,
        is_active: true
      }
    });
    
    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: "An active subscription already exists for this client",
        data: existingSubscription
      });
    }
    
    // Create the subscription
    const subscription = await ClientSubscription.create({
      client_id,
      cv_download_quota,
      login_allowed,
      start_date: start_date || new Date(),
      end_date,
      is_active: true
    });
    
    res.status(201).json({
      success: true,
      message: "Client subscription created successfully",
      data: subscription
    });
  } catch (err) {
    console.error('Error creating client subscription:', err);
    res.status(500).json({
      success: false,
      message: "Error creating client subscription",
      error: err.message
    });
  }
};

// Get all client subscriptions
/*exports.getAllClientSubscriptions = async (req, res) => {
  try {
    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get total count
    const totalCount = await ClientSubscription.count();
    
    // Get paginated subscriptions with client details
    const subscriptions = await ClientSubscription.findAll({
      include: [
        {
          model: MasterClient,
          attributes: ['client_id', 'client_name', 'email', 'phone']
        }
      ],
      order: [['subscription_id', 'DESC']],
      limit,
      offset
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);
    
    res.status(200).json({
      success: true,
      data: subscriptions,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalCount,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (err) {
    console.error('Error fetching client subscriptions:', err);
    res.status(500).json({
      success: false,
      message: "Error fetching client subscriptions",
      error: err.message
    });
  }
};*/


// In adminController.js when you're ready
exports.getAllClientSubscriptions = async (req, res) => {
  try {
    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get total count
    const totalCount = await ClientSubscription.count();
    
    // Get paginated subscriptions with client details
    const subscriptions = await ClientSubscription.findAll({
      include: [
        {
          model: MasterClient,
          as: 'client',  // Use the alias defined in associations
          attributes: ['client_id', 'client_name', 'email', 'phone']
        }
      ],
      order: [['subscription_id', 'DESC']],
      limit,
      offset
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);
    
    res.status(200).json({
      success: true,
      data: subscriptions,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalCount,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (err) {
    console.error('Error fetching client subscriptions:', err);
    res.status(500).json({
      success: false,
      message: "Error fetching client subscriptions",
      error: err.message
    });
  }
};

// Get subscription by ID
// Update the getClientSubscriptionById function in adminController.js
exports.getClientSubscriptionById = async (req, res) => {
  const { subscriptionId } = req.params;
  
  try {
    const subscription = await ClientSubscription.findByPk(subscriptionId, {
      include: [
        {
          model: MasterClient,
          as: 'client',  // Make sure to include this alias
          attributes: ['client_id', 'client_name', 'email', 'phone']
        }
      ]
    });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (err) {
    console.error('Error fetching subscription:', err);
    res.status(500).json({
      success: false,
      message: "Error fetching subscription",
      error: err.message
    });
  }
};


// Get subscription by client ID
exports.getClientSubscriptionByClientId = async (req, res) => {
  const { clientId } = req.params;
  
  try {
    // Check if client exists
    const client = await MasterClient.findByPk(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }
    
    // Get active subscription
    const subscription = await ClientSubscription.findOne({
      where: {
        client_id: clientId,
        is_active: true
      }
    });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No active subscription found for this client"
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        subscription,
        client: {
          client_id: client.client_id,
          client_name: client.client_name,
          email: client.email,
          phone: client.phone
        }
      }
    });
  } catch (err) {
    console.error('Error fetching client subscription:', err);
    res.status(500).json({
      success: false,
      message: "Error fetching client subscription",
      error: err.message
    });
  }
};


// Update client subscription
// Update client subscription
exports.updateClientSubscription = async (req, res) => {
  const { subscriptionId } = req.params;
  const { cv_download_quota, login_allowed, start_date, end_date, is_active } = req.body;
  
  try {
    // Find the subscription
    const subscription = await ClientSubscription.findByPk(subscriptionId);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found"
      });
    }
    
    // Prepare update object
    const updateFields = {};
    if (cv_download_quota !== undefined) updateFields.cv_download_quota = cv_download_quota;
    if (login_allowed !== undefined) updateFields.login_allowed = login_allowed;
    if (start_date !== undefined) updateFields.start_date = start_date;
    if (end_date !== undefined) updateFields.end_date = end_date;
    if (is_active !== undefined) updateFields.is_active = is_active;
    
    // Update the subscription
    await subscription.update(updateFields);
    
    // Get the updated subscription with client details
    const updatedSubscription = await ClientSubscription.findByPk(subscriptionId, {
      include: [
        {
          model: MasterClient,
          as: 'client',  // Important: use the alias here
          attributes: ['client_id', 'client_name', 'email', 'phone']
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: updatedSubscription
    });
  } catch (err) {
    console.error('Error updating subscription:', err);
    res.status(500).json({
      success: false,
      message: "Error updating subscription",
      error: err.message
    });
  }
};

// Deactivate a subscription
exports.deactivateClientSubscription = async (req, res) => {
  const { subscriptionId } = req.params;
  
  try {
    // Find the subscription
    const subscription = await ClientSubscription.findByPk(subscriptionId);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found"
      });
    }
    
    // Check if already inactive
    if (!subscription.is_active) {
      return res.status(400).json({
        success: false,
        message: "Subscription is already inactive"
      });
    }
    
    // Deactivate the subscription
    await subscription.update({ is_active: false });
    
    res.status(200).json({
      success: true,
      message: "Subscription deactivated successfully"
    });
  } catch (err) {
    console.error('Error deactivating subscription:', err);
    res.status(500).json({
      success: false,
      message: "Error deactivating subscription",
      error: err.message
    });
  }
};

// Get active subscriptions that are expiring soon
exports.getExpiringSubscriptions = async (req, res) => {
  try {
    // Default to subscriptions expiring in next 30 days
    const daysToExpiry = parseInt(req.query.days) || 30;
    
    // Calculate the date to check against
    const today = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(today.getDate() + daysToExpiry);
    
    // Find active subscriptions expiring before the specified date
    const subscriptions = await ClientSubscription.findAll({
      where: {
        is_active: true,
        end_date: {
          [Op.and]: [
            { [Op.ne]: null }, // End date is not null
            { [Op.lte]: expiryDate }, // End date is before or on the expiry date
            { [Op.gte]: today } // End date is after or on today (not expired yet)
          ]
        }
      },
      include: [
        {
          model: MasterClient,
          as: 'client', // Add the 'as' alias here
          attributes: ['client_id', 'client_name', 'email', 'phone']
        }
      ],
      order: [['end_date', 'ASC']] // Soonest expiring first
    });
    
    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (err) {
    console.error('Error fetching expiring subscriptions:', err);
    res.status(500).json({
      success: false,
      message: "Error fetching expiring subscriptions",
      error: err.message
    });
  }
};


// Renew a subscription
exports.renewClientSubscription = async (req, res) => {
  const { subscriptionId } = req.params;
  const { cv_download_quota, login_allowed, duration_days, end_date } = req.body;
  
  // Validate that either duration_days or end_date is provided
  if (!duration_days && !end_date) {
    return res.status(400).json({
      success: false,
      message: "Either duration_days or end_date must be provided"
    });
  }
  
  const transaction = await sequelize.transaction();
  
  try {
    // Find the subscription
    const subscription = await ClientSubscription.findByPk(subscriptionId, { transaction });
    if (!subscription) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Subscription not found"
      });
    }
    
    // Deactivate the current subscription
    await subscription.update(
      { is_active: false },
      { transaction }
    );
    
    // Calculate new end date if duration_days provided
    let newEndDate;
    if (end_date) {
      newEndDate = new Date(end_date);
    } else if (duration_days) {
      newEndDate = new Date();
      newEndDate.setDate(newEndDate.getDate() + parseInt(duration_days));
    }
    
    // Create a new subscription
    const newSubscription = await ClientSubscription.create({
      client_id: subscription.client_id,
      cv_download_quota: cv_download_quota || subscription.cv_download_quota,
      login_allowed: login_allowed || subscription.login_allowed,
      start_date: new Date(),
      end_date: newEndDate,
      is_active: true
    }, { transaction });
    
    // Commit the transaction
    await transaction.commit();
    
    res.status(200).json({
      success: true,
      message: "Subscription renewed successfully",
      data: newSubscription
    });
  } catch (err) {
    // Rollback in case of error
    await transaction.rollback();
    console.error('Error renewing subscription:', err);
    res.status(500).json({
      success: false,
      message: "Error renewing subscription",
      error: err.message
    });
  }
};