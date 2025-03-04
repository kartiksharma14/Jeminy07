const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const authenticateToken = require('../middleware/recruiterMiddleware');

router.post('/signin', recruiterController.loginRecruiter);
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
router.get('/jobs', authenticateToken, recruiterController.getJobPosts);

router.put('/jobs/:id', authenticateToken, recruiterController.updateJobPost);
router.delete('/jobs/:id', authenticateToken, recruiterController.deleteJobPost);

// ✅ New Routes for Fetching Jobs by Status
router.get("/jobs/status", authenticateToken, recruiterController.getAllJobsWithStatus);
router.get("/jobs/pending", authenticateToken, recruiterController.getPendingJobs);
router.get("/jobs/approved", authenticateToken, recruiterController.getApprovedJobs);
router.get("/jobs/rejected", authenticateToken, recruiterController.getRejectedJobs);

router.get('/jobs/:id', authenticateToken, recruiterController.getJobPostById);

module.exports = router;
