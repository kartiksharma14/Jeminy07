const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const authenticateToken = require('../middleware/recruiterMiddleware');

// POST: Recruiter Sign-In (OTP Send) - No authentication needed
router.post('/signin', recruiterController.loginRecruiter);

// POST: Verify OTP - No authentication needed
router.post('/verify-otp', recruiterController.verifyLoginOtp);

console.log('Controller Object:', recruiterController);

// Temp job post routes 
router.post('/jobs/draft', authenticateToken, recruiterController.createJobDraft);
router.patch('/jobs/draft', authenticateToken, recruiterController.updateJobDraft);
router.get('/jobs/draft/:sessionId', authenticateToken, recruiterController.getJobDraftPreview);
router.post('/jobs/publish', authenticateToken, recruiterController.createJobFromDraft);
router.delete('/jobs/draft/:sessionId', authenticateToken, recruiterController.deleteJobDraft);

// Job Post routes 
router.post('/jobs', authenticateToken, recruiterController.createJobPost);
//router.get('/jobs', authenticateToken, recruiterController.getRecruiterJobs);
router.get('/jobs', authenticateToken, recruiterController.getJobPosts);
router.get('/jobs/:id', authenticateToken, recruiterController.getJobPostById);
router.put('/jobs/:id', authenticateToken, recruiterController.updateJobPost);
router.delete('/jobs/:id', authenticateToken, recruiterController.deleteJobPost);

module.exports = router;
