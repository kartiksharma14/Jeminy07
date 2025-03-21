// Description: Handles user authentication and registration.
// Methods: signup, verifyOtp, signin, resendOtp

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const Otp = require("../models/otp");
const TemporaryUser = require("../models/temporaryUsers");
const User = require("../models/user");
require("dotenv").config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});

// Function to send OTP
const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Job Portal',
      text: `Your OTP is: ${otp}`
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// Generate OTP utility function
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  signup: async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;

      // Validate required fields
      if (!name || !email || !phone || !password) {
        return res.status(400).json({
          error: "Missing required fields",
          details: "Name, email, phone, and password are required"
        });
      }

      // Check existing user
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          error: "User already exists",
          details: "Email is already registered"
        });
      }

      // Check temporary registration
      const existingTemp = await TemporaryUser.findOne({ where: { email } });
      if (existingTemp) {
        return res.status(400).json({
          error: "Registration in progress",
          details: "Please complete your existing registration process"
        });
      }

      // Validate resume file
      if (!req.file) {
        return res.status(400).json({
          error: "Missing resume file",
          details: "Resume file is required"
        });
      }

      const resume = req.file.buffer;
      console.log('File details:', {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size
      });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create temporary user
      try {
        await TemporaryUser.create({
          email,
          name,
          phone,
          hashed_password: hashedPassword,
          resume,
        });
      } catch (dbError) {
        console.error('Database error during user creation:', dbError);
        return res.status(500).json({
          error: "Database error during signup",
          details: dbError.message
        });
      }

      // Generate and store OTP
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

      // Delete existing OTP and create new one
      await Otp.destroy({ where: { email } });
      await Otp.create({ email, otp, otp_expiry: otpExpiry });
      
      // Send OTP email
      const emailSent = await sendOTP(email, otp);
      if (!emailSent) {
        return res.status(500).json({ error: "Failed to send OTP email" });
      }

      res.status(200).json({ 
        message: "OTP sent successfully",
        email: email  // Return email for reference
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        error: "Error during signup",
        details: error.message
      });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;

      // Validate OTP
      const otpEntry = await Otp.findOne({ where: { email } });
      if (!otpEntry || otpEntry.otp !== otp) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      if (new Date() > otpEntry.otp_expiry) {
        await Otp.destroy({ where: { email } });
        return res.status(400).json({ error: "OTP expired" });
      }

      // Get temporary user data
      const tempUser = await TemporaryUser.findOne({ where: { email } });
      if (!tempUser) {
        return res.status(400).json({ error: "Registration data not found" });
      }

      // Create permanent user
      const newUser = await User.create({
        email: tempUser.email,
        name: tempUser.name,
        phone: tempUser.phone,
        hashed_password: tempUser.hashed_password,
        resume: tempUser.resume,
        last_login: new Date(),
        is_active: true
      });

      // Clean up temporary data
      await TemporaryUser.destroy({ where: { email } });
      await Otp.destroy({ where: { email } });

      res.status(200).json({ 
        message: "User registered successfully",
        user: {
          email: newUser.email,
          name: newUser.name,
          phone: newUser.phone
        }
      });
    } catch (error) {
      console.error('OTP verification error:', error);
      res.status(500).json({ 
        error: "Error during OTP verification",
        details: error.message 
      });
    }
  },

  signin: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate credentials
      if (!email || !password) {
        return res.status(400).json({
          error: "Missing credentials",
          details: "Email and password are required"
        });
      }

      // Find user
      const user = await User.findOne({ 
        where: { 
          email,
          is_active: true
        } 
      });

      if (!user) {
        return res.status(401).json({
          error: "Authentication failed",
          details: "User not found or account inactive"
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.hashed_password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: "Authentication failed",
          details: "Invalid password"
        });
      }

      // Update last login time
      await user.update({ last_login: new Date() });

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.candidate_id,
          email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '2400h' }
      );

      res.status(200).json({
        message: "Authentication successful",
        token,
        user: {
          email: user.email,
          name: user.name,
          phone: user.phone
        }
      });
    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).json({
        error: "Error during signin",
        details: error.message
      });
    }
  },

  resendOtp: async (req, res) => {
    try {
      const { email } = req.body;

      // Verify temporary user exists
      const tempUser = await TemporaryUser.findOne({ where: { email } });
      if (!tempUser) {
        return res.status(400).json({ error: "No pending registration found for this email" });
      }

      // Generate new OTP
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      // Update OTP
      await Otp.destroy({ where: { email } });
      await Otp.create({ email, otp, otp_expiry: otpExpiry });

      // Send new OTP
      const emailSent = await sendOTP(email, otp);
      if (!emailSent) {
        return res.status(500).json({ error: "Failed to send OTP email" });
      }

      res.status(200).json({ 
        message: "New OTP sent successfully",
        email: email
      });
    } catch (error) {
      console.error('Resend OTP error:', error);
      res.status(500).json({
        error: "Error during OTP resend",
        details: error.message
      });
    }
  }
};