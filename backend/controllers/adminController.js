const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
const Admin = require('../models/adminModel');
const Signin = require("../models/user");
const Recruiter = require('../models/recruiterSignin');
const Otp = require('../models/otp');
const JobPost = require('../models/jobpost');
const JobApplication = require('../models/jobApplications');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
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
exports.getPendingJobs = async (req, res) => {
  try {
    const jobs = await JobPost.findAll({
      where: { status: 'pending' },
      include: [{ model: Recruiter, attributes: ['email','name'] }],
    });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

// Reject a Job
/*exports.rejectJob = async (req, res) => {
  const { jobId } = req.params;
  const adminId = req.admin.id; // Admin ID from JWT token
  const { rejectionReason } = req.body; // Optional rejection reason

  try {
    const job = await JobPost.findByPk(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    if (job.status === "rejected") {
        return res.status(400).json({ success: false, message: "Job post is already rejected" });
    }

    job.status = 'rejected';
    job.rejectedBy = adminId; 
    job.rejection_reason = rejectionReason || 'Imcomplete details provided';
    await job.save();

    res.status(200).json({ message: 'Job rejected successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};*/

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
exports.getApprovedJobs = async (req, res) => {
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
};

// Get All Rejected Jobs by Admin
exports.getRejectedJobs = async (req, res) => {
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

// Get All Jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await JobPost.findAll({
      include: [{ model: Recruiter, attributes: ['email', 'name'] }],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
  const { name, password, companyName } = req.body;
  
  try {
    // Find the recruiter by ID
    const recruiter = await Recruiter.findByPk(recruiterId);
    if (!recruiter) {
      return res.status(404).json({ 
        success: false, 
        message: "Recruiter not found" 
      });
    }

    // Create an object to store fields to update
    const updateFields = {};
    
    // Only update fields that are provided in the request
    if (name) updateFields.name = name;
    if (companyName) updateFields.company_name = companyName;
    
    // If password is provided, hash it before saving
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }
    
    // Update the recruiter with the new values
    await recruiter.update(updateFields);
    
    // Return the updated recruiter (excluding password)
    const updatedRecruiter = {
      recruiter_id: recruiter.recruiter_id,
      name: recruiter.name,
      email: recruiter.email,
      company_name: recruiter.company_name,
      // Add other fields you want to return, but not the password
    };
    
    res.status(200).json({
      success: true,
      message: "Recruiter details updated successfully",
      data: updatedRecruiter
    });
    
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};