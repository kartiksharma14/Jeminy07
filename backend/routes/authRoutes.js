/*const express = require('express');
const multer = require('multer');
const { signupUser, signinUser, VerifyOtp, getUserDetails, patchUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware'); // Ensure the correct path
const authController = require('../controllers/authController'); // Adjust the path if needed
const pool = require('../db'); // Import pool from db.js

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Store in 'uploads/' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Use timestamp for unique filenames
    }
});

// Initialize Multer
const upload = multer({ storage: storage });

// Routes

// Signup route
router.post('/signup', upload.single('resume'), signupUser);

// Signin route
router.post('/signin', signinUser);

// OTP verification route
router.post('/verify-otp', VerifyOtp);

// Get user details (protected)
//router.get('/user-details', verifyToken, getUserDetails);
router.get('/user-details/:id', authController.getUserDetails);
/*router.get('/user-details/:id', (req, res, next) => {
    console.log('Request received for user ID:', req.params.id);
    next();
});

// Update user details (protected)
router.patch('/update-user/:id', verifyToken, patchUser);

module.exports = router;

console.log('AuthController:', authController);
console.log(__dirname); */


// routes/authRoutes.js
const express = require("express");
const multer = require("multer");
const authController = require("../controllers/authController");

// First, verify the controller is loaded correctly
console.log('authController:', authController); // Add this line to debug
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/signup", upload.single("resume"), authController.signup);
router.post("/verify-otp", authController.verifyOtp);
router.post("/signin", authController.signin);


module.exports = router;
