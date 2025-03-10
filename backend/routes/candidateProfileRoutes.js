const OTP = require("../models/otp");
const TemporaryUsers = require("../models/temporaryUsers");
const User = require("../models/user");

const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const  authenticateToken  = require("../middleware/recruiterMiddleware");
console.log("authenticateToken:", authenticateToken);
const cities = require('../data/cities.json');

// Import all controller functions
const {
  getUserDetails,
  updateUserDetails,
  getCandidatesByExperience,
  searchCandidatesByCity,
  searchByKeyword,
  searchCandidateByEducation,
  searchCandidateByEmployment,
  searchCandidateByGender,
  searchCandidateBySalary,
  searchCandidateByNoticePeriod,
  searchCandidateByDisability,
  searchCandidateByItSkills,
  searchCandidateByActiveIn,
  searchCandidateByExcludingKeyword,
  searchCandidates,
  addEducationRecord,
  updateEducationRecord,
  deleteEducationRecord,
  addEmploymentRecord,
  updateEmploymentRecord,
  deleteEmploymentRecord,
  addProjectRecord,
  updateProjectRecord,
  deleteProjectRecord,
  addKeyskillsRecord,
  updateKeyskillsRecord,
  deleteKeyskillsRecord,
  addITSkillsRecord,
  updateITSkillsRecord,
  deleteITSkillsRecord,
} = require("../controllers/candidateProfileController");
const { searchCandidatesByJob } = require("../controllers/recruiterController");

const {
  searchJobs,
  searchJobsByLocation,
  searchJobsByIndustry,
  searchJobsBySalary,
  searchJobsByExperience,
  searchJobsByEmploymentType,
  searchJobsByCompany,
  //searchJobsByITSkills,
  searchJobsByKeySkills,
  searchJobsByDesignation,
  //searchJobsByEducation,
  applyForJob,
  getMyApplications,
  getApplicationDetails,
  saveJob,
  searchJobsWithAllParameter,
  unsaveJob,
  getSavedJobs,
  getCandidateApplications,
  getCandidateApplicationDetail,
  withdrawApplication
} = require("../controllers/JobApplicationController");

console.log("searchCandidatesByCity:", searchCandidatesByCity);
console.log("All imported functions:", {
  getUserDetails,
  updateUserDetails,
  getCandidatesByExperience,
  searchCandidatesByCity,
  searchByKeyword
});

const router = express.Router();

// ==================== Search Routes ====================

// Search cities
router.get("/search-cities", verifyToken, async (req, res) => {
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


// Candidates Search 
router.get('/search-by-city', authenticateToken, searchCandidatesByCity);
router.get('/candidates/search/keyword', authenticateToken, searchByKeyword);
router.get('/candidates/search/education', authenticateToken, searchCandidateByEducation);
router.get('/candidates/search/employment', authenticateToken, searchCandidateByEmployment);
router.get('/candidates/search/gender', authenticateToken, searchCandidateByGender);
router.get('/candidates/search/salary', authenticateToken, searchCandidateBySalary);
router.get('/candidates/search/notice-period', authenticateToken, searchCandidateByNoticePeriod);
router.get('/candidates/search/disability', authenticateToken, searchCandidateByDisability);
router.get('/candidates/search/it-skills', authenticateToken, searchCandidateByItSkills);
router.get('/candidates/search-by-active-in', authenticateToken, searchCandidateByActiveIn);
router.get('/candidates/search-by-excluding-keyword', authenticateToken, searchCandidateByExcludingKeyword);
router.get("/candidates/experience/range", authenticateToken, getCandidatesByExperience);
router.get("/candidates/search", authenticateToken, searchCandidates);

// ==================== User Details Routes ====================

// Get user details
router.get("/user-details/:candidate_id", verifyToken, getUserDetails);
// Update user details
router.patch("/update-user/:candidate_id", verifyToken, updateUserDetails);

// ==================== Education Routes ====================

// Add education record
router.post("/education/:candidate_id", verifyToken, addEducationRecord);
// Update education record
router.patch("/education/:record_id", verifyToken, updateEducationRecord);
// Delete education record
router.delete("/education/:record_id", verifyToken, deleteEducationRecord);

// ==================== Employment Routes ====================

// Add employment record
router.post("/employment/:candidate_id", verifyToken, addEmploymentRecord);
// Update employment record
router.patch("/employment/:record_id", verifyToken, updateEmploymentRecord);
// Delete employment record
router.delete("/employment/:record_id", verifyToken, deleteEmploymentRecord);

// ==================== Projects Routes ====================

// Add project record
router.post("/projects/:candidate_id", verifyToken, addProjectRecord);
// Update project record
router.patch("/projects/:record_id", verifyToken, updateProjectRecord);
// Delete project record
router.delete("/projects/:record_id", verifyToken, deleteProjectRecord);

// ==================== Keyskills Routes ====================

// Add keyskills record
router.post('/keyskills/:candidate_id', verifyToken, addKeyskillsRecord);
// Update keyskills record
router.patch('/keyskills/:record_id', verifyToken, updateKeyskillsRecord);
// Delete keyskills record
router.delete('/keyskills/:record_id', verifyToken, deleteKeyskillsRecord);
// ==================== IT Skills Routes ====================

// Add IT skills record
router.post('/itskills/:candidate_id', verifyToken, addITSkillsRecord);
// Update IT skills record
router.patch('/itskills/:record_id', verifyToken, updateITSkillsRecord);
// Delete IT skills record
router.delete('/itskills/:record_id', verifyToken, deleteITSkillsRecord);


// Job Search Routes
router.get('/jobs/search/location', verifyToken, searchJobsByLocation);
router.get('/jobs/search/industry', verifyToken, searchJobsByIndustry);
router.get('/jobs/search/salary', verifyToken, searchJobsBySalary);
router.get('/jobs/search/experience', verifyToken, searchJobsByExperience);
router.get('/jobs/search/employment-type', verifyToken, searchJobsByEmploymentType);
router.get('/jobs/search/company', verifyToken, searchJobsByCompany);
router.get('/jobs/search/key-skills', verifyToken, searchJobsByKeySkills);
//router.get('/jobs/search/it-skills', verifyToken, searchJobsByITSkills);
router.get('/jobs/search/designation', verifyToken, searchJobsByDesignation);
//router.get('/jobs/search/education', verifyToken, searchJobsByEducation);
router.get('/jobs/search', verifyToken, searchJobs);
router.get('/search-all', verifyToken, searchJobsWithAllParameter);

// ==================== Job Application Routes ====================

// Candidate applies for a job
router.post('/apply/:job_id', verifyToken, applyForJob);
// Get candidate's job applications
router.get('/candidate/applications', verifyToken, getCandidateApplications);
// Get detailed information about a specific application
router.get('/candidate/applications/:application_id', verifyToken, getCandidateApplicationDetail);
// Withdraw an application
router.patch('/candidate/applications/:application_id/withdraw', verifyToken, withdrawApplication);
// Save job for later
router.post('/jobs/:job_id/save', verifyToken, saveJob);
// Unsave a job
router.delete('/jobs/:job_id/save', verifyToken, unsaveJob);
// Get saved jobs
router.get('/saved-jobs', verifyToken, getSavedJobs);

module.exports = router;