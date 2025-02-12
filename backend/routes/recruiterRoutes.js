// routes/recruiterRoutes.js
const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const authenticateToken = require('../middleware/recruiterMiddleware');
const recruiterMiddleware = require('../middleware/recruiterMiddleware');


const { addQuestions, updateQuestions,  deleteQuestions} = require('../controllers/recruiterController');
  

// POST: Recruiter Sign-In (OTP Send)
router.post('/signin', recruiterController.recruiterSignin);

// POST: Verify OTP
router.post('/verify-otp', recruiterController.verifyRecruiterOtp);

// Route to create a new job post
router.post('/jobs', authenticateToken, recruiterController.createJobPost);

// Route to update job status (active/inactive)
router.patch('/jobs/:job_id', authenticateToken,  recruiterController.updateJobPost);

// Route to delete a job post
router.delete('/jobs/:job_id', authenticateToken, recruiterController.deleteJobPost);

// Route to get all job posts
router.get('/jobs', authenticateToken, recruiterController.getAllJobs);

// GET: Get questions for a specific job
/*router.get('/jobs/:job_id/questions', authenticateToken, recruiterController.getQuestions);

router.post('/jobs/questions', addQuestions);

router.patch('/questions/:question_id', updateQuestions);

router.delete('/questions/:question_id', deleteQuestions);*/

module.exports = router;