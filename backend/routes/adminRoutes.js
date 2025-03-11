const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Ensure the 'uploads' directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth'); // Middleware to verify JWT

// Public Routes
router.post('/signup', adminController.signup);
router.post('/verify-otp', adminController.verifyOtp); // OTP verification route
router.post('/signin', adminController.signin);
// Admin password update route
router.post('/update-password', adminAuth, adminController.updatePassword);

// Protected Routes (require JWT authentication)
router.post('/recruiters', adminAuth, adminController.createRecruiter);
router.get('/recruiters/recent', adminAuth, adminController.getRecentRecruiters);
router.patch('/recruiters/:recruiterId', adminAuth, adminController.updateRecruiter);
router.patch('/jobs/:jobId/approve', adminAuth, adminController.approveJob);
router.put('/jobs/:jobId/edit', adminAuth, adminController.editJob);
router.get('/jobs/approved', adminAuth, adminController.getApprovedJobs);
router.get('/jobs/pending', adminAuth, adminController.getPendingJobs);
router.get('/jobs/rejected', adminAuth, adminController.getRejectedJobs);
router.patch('/jobs/:jobId/reject', adminAuth, adminController.rejectJob);
router.get('/jobs/:jobId', adminAuth, adminController.getJobById);
router.get('/jobs', adminAuth, adminController.getAllJobs);
router.delete('/jobs/:jobId', adminAuth, adminController.deleteJob);
// Route: Admin gets all recruiters
router.get('/recruiters', adminAuth, adminController.getRecruiters);
// Route: Admin uploads bulk candidates via CSV/Excel
router.post('/upload-candidates', adminAuth, upload.single('file'), adminController.bulkUploadCandidates);
// Route: Admin uploads bulk jobs via CSV/Excel/XLS
router.post('/upload-jobs', adminAuth, upload.single('file'), adminController.bulkUploadJobs);
// Route: Admin downloads a sample template for bulk job upload
router.get('/download-job-template', adminAuth, adminController.downloadJobTemplate);
//TO BE DONE 
// Route: Admin downloads a sample CSV file for bulk candidate upload
//router.get('/download-sample', adminAuth, adminController.downloadSample);
router.get('/dashboard-metrics', adminAuth, adminController.getDashboardMetrics);
router.delete('/recruiters/:recruiterId', adminAuth, adminController.deleteRecruiter);


module.exports = router;