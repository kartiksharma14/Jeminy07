const bcrypt = require('bcryptjs');
const Admin = require('../models/adminModel');
const Recruiter = require('../models/recruiterSignin');
const Otp = require('../models/otp');
const JobPost = require('../models/jobpost');

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
exports.signin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const admin = await Admin.findOne({ where: { email } });
      if (!admin) return res.status(404).json({ error: 'Admin not found' });
  
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
  
      const token = jwt.sign({ id: admin.admin_id }, 'your-secret-key', { expiresIn: '1000h' });
      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Admin creates recruiter
exports.createRecruiter = async (req, res) => {
    const { email, password, name } = req.body;
    const adminId = req.admin.id;  // Assuming admin's ID comes from the JWT token (req.admin.id)
  
    try {
      // Check if recruiter already exists
      const existingRecruiter = await Recruiter.findOne({ where: { email } });
      if (existingRecruiter) {
        return res.status(400).json({ error: 'Recruiter already exists' });
      }

      console.log(bcrypt); // Log bcrypt to ensure it is defined
  
      // Hash the password before saving
      //const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the recruiter with associated admin_id
      const recruiter = await Recruiter.create({
        name,
        email,
        //password: hashedPassword,
        password,
        admin_id: adminId, // Associate the recruiter with the admin
      });
  
      res.status(200).json({ message: 'Recruiter created successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Approve Job
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
    job.approvedBy = adminId;
    await job.save();
    res.status(200).json({ message: 'Job approved successfully' });
  } catch (err) {
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

// Get Approved Job History
exports.getApprovedJobs = async (req, res) => {
  const adminId = req.admin.id; // Admin ID from JWT token

  try {
    const jobs = await JobPost.findAll({
      where: { approvedBy: adminId, status: 'approved' },
      include: [{ model: Recruiter, attributes: ['email'] }],
    });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Pending Job History
exports.getPendingJobs = async (req, res) => {
  try {
    const jobs = await JobPost.findAll({
      where: { status: 'pending' },
      include: [{ model: Recruiter, attributes: ['email'] }],
    });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
