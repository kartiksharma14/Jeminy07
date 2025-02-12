// routes/recruiterRoutes.js
const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const authenticateToken = require('../middleware/recruiterMiddleware');

// POST: Recruiter Sign-In (Send OTP)
router.post('/signin', recruiterController.recruiterSignin);

// POST: Verify OTP
router.post('/verify-otp', recruiterController.verifyRecruiterOtp);

// Example of a protected route (if needed later)
// router.get('/protected-route', authenticateToken, recruiterController.someProtectedFunction);

module.exports = router;