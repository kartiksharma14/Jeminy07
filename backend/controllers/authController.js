/*const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file
const multer = require('multer');
const { createUser, findUserByEmail, updateOtp } = require('../backend/models/user');
const jwt = require('jsonwebtoken');


// Email configuration for OTP
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAIL_USERNAME, // Load from environment variable
        pass: process.env.MAIL_PASSWORD, // Load from environment variable
    },
    tls: {
        rejectUnauthorized: false, // Optional: Disable TLS checks for testing
    },
});

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// Password validation regex (at least 8 characters, 1 number, 1 special character, 1 uppercase)
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

// Phone validation regex (exactly 10 digits)
const phoneRegex = /^\d{10}$/;

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath); // Create the uploads directory if it doesn't exist
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Multer file filter for PDFs and Word documents
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and Word documents are allowed'), false);
    }
};

// Multer middleware
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB file size limit
});

const signupUser = async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password || !req.file) {
        return res.status(400).json({ error: 'All fields, including resume, are required' });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Phone number must be exactly 10 digits' });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            error: 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character',
        });
    }

    try {
        // Check if the user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = String(crypto.randomInt(100000, 999999)); // Generates exactly a 6-digit OTP
        console.log('Generated OTP:', otp, 'Length:', otp.length); // Debugging log to ensure correctness

        // Generate OTP expiry time
        const otp_expiry = new Date(Date.now() + 30 * 60 * 1000); // OTP expires in 30 minutes

        // Insert user data, including OTP and otp_expiry, into the database
        const sql = `
            INSERT INTO signin (name, email, password, phone, resume, otp, otp_expiry)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        // Get a connection from the pool
        const pool = require('../db'); // Your database connection pool
        const resumeBuffer = req.file.buffer; // Save the uploaded resume as binary

        await pool.query(sql, [
            name,
            email,
            hashedPassword,
            phone,
            req.file.buffer, // Pass the buffer directly for longblob
            otp,
            otp_expiry,
        ]);

        // Send OTP via email
        await transporter.sendMail({
            from: process.env.MAIL_DEFAULT_SENDER, // Load default sender from environment variable
            to: email,
            subject: 'Your Signup OTP',
            text: `Your OTP for signup is: ${otp}`,
        });

        res.status(201).json({
            message: 'User created successfully. OTP sent to your email for verification.',
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
};


const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        // Retrieve the user's OTP and expiry from the database
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { otp: storedOtp, otp_expiry } = user;

        if (!storedOtp || new Date(otp_expiry) < new Date()) {
            return res.status(404).json({ error: 'OTP not found or expired' });
        }

        if (storedOtp !== otp.toString()) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // OTP verified successfully; clear OTP and expiry
        await updateOtp(email, null, null);

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ error: 'OTP verification failed', details: error.message });
    }
};


// Signin Handler (unchanged)
const signinUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user.candidate_id, email: user.email }, // Payload
            process.env.JWT_SECRET, // Secret key from your .env file
            { expiresIn: '1h' } // Token expiration time
        );

        res.status(200).json({
            message: 'Login successful',
            userId: user.candidate_id,
            token, // Return the token in the response
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login', details: error.message });
    }
};



// PATCH user details
const patchUser = async (req, res) => {
    const userId = req.params.id; // Extract user ID from the request URL
    const updates = req.body; // Extract fields to update from the request body

    try {
        // Define the fields that can be updated
        const allowedFields = ['name', 'email', 'phone'];
        const updateKeys = Object.keys(updates).filter((key) => allowedFields.includes(key));

        if (updateKeys.length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        // Construct SQL query dynamically
        const query = `UPDATE signin SET ${updateKeys.map((key) => `${key} = ?`).join(', ')} WHERE candidate_id = ?`;
        const values = [...updateKeys.map((key) => updates[key]), userId];

        // Execute the query
        const pool = require('../db'); // Database connection
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User data updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user data', details: error.message });
    }
};


module.exports = { signupUser, signinUser, verifyOtp, upload, patchUser };*/










/*const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('../db'); // Adjust the path if necessary
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file
const multer = require('multer');
const { upsertOtp, verifyOtp, deleteOtp } = require('../backend/models/otp'); // Updated to use OTP model functions
const { getTemporaryUserByEmail, deleteTemporaryUser } = require('../backend/models/temporaryUsers'); // Import temp users model
const { createUser, findUserByEmail, updateUser } = require('../backend/models/user'); // Updated user model functions
const jwt = require('jsonwebtoken');

// Email configuration for OTP
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAIL_USERNAME, // Load from environment variable
        pass: process.env.MAIL_PASSWORD, // Load from environment variable
    },
    tls: {
        rejectUnauthorized: false, // Optional: Disable TLS checks for testing
    },
});

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// Password validation regex (at least 8 characters, 1 number, 1 special character, 1 uppercase)
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

// Phone validation regex (exactly 10 digits)
const phoneRegex = /^\d{10}$/;

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath); // Create the uploads directory if it doesn't exist
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Multer file filter for PDFs and Word documents
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and Word documents are allowed'), false);
    }
};

// Multer middleware
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB file size limit
});

// Function to generate OTP
const generateOtp = () => {
    return String(crypto.randomInt(100000, 999999)); // Generates exactly a 6-digit OTP
};

// POST: User Signup (with OTP)
const signupUser = async (req, res) => {
    const { name, email, phone, password } = req.body;

    // Validate the input data
    if (!name || !email || !phone || !password || !req.file) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Phone number must be exactly 10 digits' });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            error: 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character',
        });
    }

    try {
        // Check if the user already exists in the database
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // Ensure this line is present

        // Generate OTP and OTP expiry time
        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 30 * 60 * 1000); // OTP expires in 30 minutes

        // Insert/Update OTP in the otpstore table
        await upsertOtp(email, otp, otpExpiry);

        // Save user data in temporary_users table
        const resume = req.file.buffer; // Ensure you save the uploaded resume file
        await db.query(
            'INSERT INTO temporary_users (name, email, phone, hashed_password, resume) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, hashedPassword, resume]
        );

        

        // Send OTP via email
        await transporter.sendMail({
            from: process.env.MAIL_DEFAULT_SENDER,
            to: email,
            subject: 'Jimeny Signup OTP',
            text: `Your OTP for signup is: ${otp}`,
        });

        res.status(201).json({
            message: 'OTP sent to your email. Please verify to complete the signup.',
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
};


// POST: Verify OTP
const pool = require('../db'); // Ensure the pool is imported correctly

const VerifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    // Validate OTP and email
    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    try {
        // Step 1: Check if OTP exists in `otpstore`
        const [otpResult] = await pool.query(
            'SELECT otp, otp_expiry FROM otpstore WHERE email = ?',
            [email]
        );

        if (otpResult.length === 0) {
            return res.status(404).json({ error: 'OTP not found or expired.' });
        }

        const { otp: storedOtp, otp_expiry } = otpResult[0];
        const currentTime = new Date();

        // Check if the OTP matches and is not expired
        if (otp !== storedOtp || currentTime > new Date(otp_expiry)) {
            return res.status(400).json({ error: 'Invalid or expired OTP.' });
        }

        // Step 2: Retrieve user data from `temporary_users`
        const [tempUserResult] = await pool.query(
            'SELECT * FROM temporary_users WHERE email = ?',
            [email]
        );

        if (tempUserResult.length === 0) {
            return res.status(404).json({
                error: 'User data not found. Please sign up again.',
            });
        }

        const { name, phone, hashed_password, resume } = tempUserResult[0];

        // Step 3: Insert the user into the `signin` table
        await pool.query(
            'INSERT INTO signin (name, email, phone, password, resume) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, hashed_password, resume]
        );

        // Step 4: Clean up `otpstore` and `temporary_users` entries
        await pool.query('DELETE FROM otpstore WHERE email = ?', [email]); // Remove OTP entry
        await pool.query('DELETE FROM temporary_users WHERE email = ?', [email]); // Remove temp user entry

        // Respond with success
        res.status(200).json({ message: 'OTP verified and user registered successfully.' });
    } catch (error) {
        console.error('Error during OTP verification:', error);
        res.status(500).json({
            error: 'Internal server error during OTP verification.',
            details: error.message,
        });
    }
};


// POST: User Login
const signinUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Check if the user exists in the signin table
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Check if there is an unverified OTP entry in otpstore
        const [otpEntries] = await db.query('SELECT * FROM otpstore WHERE email = ?', [email]);
        if (otpEntries.length > 0) {
            return res.status(403).json({ error: 'User not verified. Please verify your OTP first.' });
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '5h',
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
};


// getUserDetails function
const getUserDetails = async (req, res) => {
    try {
        const user = req.user; // Assuming user data is attached to `req.user` after `verifyToken`
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Example response
        res.status(200).json({ message: 'User details fetched successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user details', details: error.message });
    }
};




// PATCH: Update User Details
const patchUser = async (req, res) => {
    const userId = req.params.id; // Extract user ID from the request URL
    const updates = req.body; // Extract fields to update from the request body

    try {
        // Define the fields that can be updated
        const allowedFields = ['name', 'email', 'phone'];
        const updateKeys = Object.keys(updates).filter((key) => allowedFields.includes(key));

        if (updateKeys.length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        // Construct SQL query dynamically
        const query = `UPDATE signin SET ${updateKeys.map((key) => `${key} = ?`).join(', ')} WHERE candidate_id = ?`;
        const values = [...updateKeys.map((key) => updates[key]), userId];

        // Execute the query
        const pool = require('../db'); // Database connection
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User data updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user data', details: error.message });
    }
};

console.log('getUserDetails:', getUserDetails); // Should log the function definition

// Export the controller functions
module.exports = { signupUser, signinUser, VerifyOtp, upload, patchUser, getUserDetails };*/




// controllers/authController.js
/*const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const Otp = require("../models/otp");
const TemporaryUser = require("../models/temporaryUsers");
const User = require("../models/user");
require("dotenv").config();

// Export object with both functions
module.exports = {
  signup: async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;

      // Add validation for required fields
      if (!name || !email || !phone || !password) {
        return res.status(400).json({
          error: "Missing required fields",
          details: "Name, email, phone, and password are required"
        });
      }

      // Check if file exists
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

      const hashedPassword = await bcrypt.hash(password, 10);

      // Create temporary user with explicit logging
      try {
        await TemporaryUser.create({
          email,
          name,
          phone,
          hashed_password: hashedPassword,
          resume,
          // created_at will be automatically set by MySQL
        });
      } catch (dbError) {
        console.error('Database error during user creation:', dbError);
        return res.status(500).json({
          error: "Database error during signup",
          details: dbError.message
        });
      }

      // Generate and store OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await Otp.create({ email, otp, otp_expiry: otpExpiry });

      res.status(200).json({ message: "OTP sent successfully." });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        error: "Error during signup.",
        details: error.message
      });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;

      const otpEntry = await Otp.findOne({ where: { email } });
      if (!otpEntry || otpEntry.otp !== otp) {
        return res.status(400).json({ error: "Invalid OTP." });
      }

      if (new Date() > otpEntry.otp_expiry) {
        return res.status(400).json({ error: "OTP expired." });
      }

      const tempUser = await TemporaryUser.findOne({ where: { email } });
      if (!tempUser) {
        return res.status(400).json({ error: "Temporary user not found." });
      }

      const newUser = await User.create({
        email: tempUser.email,
        name: tempUser.name,
        phone: tempUser.phone,
        hashed_password: tempUser.hashed_password,  // Changed to match schema
        resume: tempUser.resume,
      });

      await TemporaryUser.destroy({ where: { email } });
      await Otp.destroy({ where: { email } });

      res.status(200).json({ message: "User registered successfully.", user: newUser });
    } catch (error) {
      console.error('OTP verification error:', error);
      res.status(500).json({ error: "Error during OTP verification." });
    }
  },

  signin: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          error: "Missing credentials",
          details: "Email and password are required"
        });
      }

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          error: "Authentication failed",
          details: "User not found"
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

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.email,
          email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Return success with token and user data (excluding sensitive information)
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
    }
};*/




// controllers/authController.js
/*const bcrypt = require("bcryptjs");
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

module.exports = {
  signup: async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;

      if (!name || !email || !phone || !password) {
        return res.status(400).json({
          error: "Missing required fields",
          details: "Name, email, phone, and password are required"
        });
      }

      // Check if user already exists in main users table
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          error: "User already exists",
          details: "Email is already registered"
        });
      }

      // Check if user exists in temporary users
      const existingTemp = await TemporaryUser.findOne({ where: { email } });
      if (existingTemp) {
        return res.status(400).json({
          error: "Registration in progress",
          details: "Please complete your existing registration process"
        });
      }

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
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      // Delete any existing OTP for this email
      await Otp.destroy({ where: { email } });

      // Create new OTP
      await Otp.create({ email, otp, otp_expiry: otpExpiry });
      
      // Send OTP email
      const emailSent = await sendOTP(email, otp);
      if (!emailSent) {
        return res.status(500).json({ error: "Failed to send OTP email" });
      }

      res.status(200).json({ message: "OTP sent successfully." });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        error: "Error during signup.",
        details: error.message
      });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;

      const otpEntry = await Otp.findOne({ where: { email } });
      if (!otpEntry || otpEntry.otp !== otp) {
        return res.status(400).json({ error: "Invalid OTP." });
      }

      if (new Date() > otpEntry.otp_expiry) {
        await Otp.destroy({ where: { email } });
        return res.status(400).json({ error: "OTP expired." });
      }

      const tempUser = await TemporaryUser.findOne({ where: { email } });
      if (!tempUser) {
        return res.status(400).json({ error: "Temporary user not found." });
      }

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

      // Generate JWT token for automatic login
      const token = jwt.sign(
        { 
          userId: newUser.email,
          email: newUser.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(200).json({ 
        message: "User registered successfully.", 
        user: {
          email: newUser.email,
          name: newUser.name,
          phone: newUser.phone
        },
        token 
      });
    } catch (error) {
      console.error('OTP verification error:', error);
      res.status(500).json({ 
        error: "Error during OTP verification.",
        details: error.message 
      });
    }
  },

  signin: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: "Missing credentials",
          details: "Email and password are required"
        });
      }

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

      const isValidPassword = await bcrypt.compare(password, user.hashed_password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: "Authentication failed",
          details: "Invalid password"
        });
      }

      // Update last login time
      await user.update({ last_login: new Date() });

      const token = jwt.sign(
        { 
          userId: user.email,
          email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
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

  // Optional: Add a resend OTP function
  resendOtp: async (req, res) => {
    try {
      const { email } = req.body;

      const tempUser = await TemporaryUser.findOne({ where: { email } });
      if (!tempUser) {
        return res.status(400).json({ error: "No pending registration found for this email." });
      }

      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      // Delete existing OTP
      await Otp.destroy({ where: { email } });

      // Create new OTP
      await Otp.create({ email, otp, otp_expiry: otpExpiry });

      // Send new OTP
      const emailSent = await sendOTP(email, otp);
      if (!emailSent) {
        return res.status(500).json({ error: "Failed to send OTP email" });
      }

      res.status(200).json({ message: "New OTP sent successfully." });
    } catch (error) {
      console.error('Resend OTP error:', error);
      res.status(500).json({
        error: "Error during OTP resend",
        details: error.message
      });
    }
  }
};*/



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
        { expiresIn: '72h' }
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