const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const authenticateToken = require('../middleware/recruiterMiddleware');
const cities = require('../data/cities.json');

// Search cities for recruiters
router.get("/search-cities", authenticateToken, async (req, res) => {
    try {
      const { search } = req.query;
  
      if (!search) {
        return res.status(400).json({
          success: false,
          message: "Search query is required"
        });
      }
  
      const filteredCities = cities.cities
        .filter(city => 
          city.City.toLowerCase().includes(search.toLowerCase())
        )
        .map(city => ({
          city: city.City,
          state: city.State,
          district: city.District
        }))
        .slice(0, 10);
  
      res.json({
        success: true,
        data: filteredCities
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error searching cities",
        error: error.message
      });
    }
  });


router.post('/signin', recruiterController.loginRecruiter);
router.post('/verify-otp', recruiterController.verifyLoginOtp);
router.post('/update-password', authenticateToken, recruiterController.updateRecruiterPassword);
console.log('Controller Object:', recruiterController);

// Temp job post routes 
router.post('/jobs/draft', authenticateToken, recruiterController.createJobDraft);
router.patch('/jobs/draft', authenticateToken, recruiterController.updateJobDraft);
router.get('/jobs/draft/:sessionId', authenticateToken, recruiterController.getJobDraftPreview);
router.post('/jobs/publish', authenticateToken, recruiterController.createJobFromDraft);
router.delete('/jobs/draft/:sessionId', authenticateToken, recruiterController.deleteJobDraft);
// Get all draft jobs for a recruiter
router.get('/job-drafts', authenticateToken, recruiterController.getAllJobDrafts);

// Job Post routes 
router.post('/jobs', authenticateToken, recruiterController.createJobPost);
router.get('/jobs', authenticateToken, recruiterController.getJobPosts);
router.put('/jobs/:id', authenticateToken, recruiterController.updateJobPost);
router.delete('/jobs/:id', authenticateToken, recruiterController.deleteJobPost);

// ✅ New Routes for Fetching Jobs by Status
router.get('/jobs/all', authenticateToken, recruiterController.getAllJobs);

router.get("/jobs/status", authenticateToken, recruiterController.getAllJobsWithStatus);
router.get("/jobs/pending", authenticateToken, recruiterController.getPendingJobs);
router.get("/jobs/approved", authenticateToken, recruiterController.getApprovedJobs);
router.get("/jobs/rejected", authenticateToken, recruiterController.getRejectedJobs);
//router.get('/jobs/most-recent', authenticateToken, recruiterController.getMostRecentApprovedJob);
router.get('/jobs/most-recent', authenticateToken, recruiterController.getMostRecentJob);

router.get('/jobs/:id', authenticateToken, recruiterController.getJobPostById);



// Job Application Management Routes
router.get('/applications', authenticateToken, recruiterController.getJobApplications);
router.get('/applications/:application_id', authenticateToken, recruiterController.getApplicationDetail);
router.patch('/applications/:application_id/status', authenticateToken, recruiterController.updateApplicationStatus);
// Add to your recruiterRoutes.js
router.get('/test-email', authenticateToken, recruiterController.testEmail);

module.exports = router;