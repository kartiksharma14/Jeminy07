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

// Protected Routes (require JWT authentication)
router.post('/recruiters', adminAuth, adminController.createRecruiter);
router.patch('/jobs/:jobId/approve', adminAuth, adminController.approveJob);
router.put('/jobs/:jobId/edit', adminAuth, adminController.editJob);
router.get('/jobs/approved', adminAuth, adminController.getApprovedJobs);
router.get('/jobs/pending', adminAuth, adminController.getPendingJobs);
router.get('/jobs/:jobId', adminAuth, adminController.getJobById);
router.get('/jobs', adminAuth, adminController.getAllJobs);
router.delete('/jobs/:jobId', adminAuth, adminController.deleteJob);
router.patch('/jobs/:jobId/reject', adminAuth, adminController.rejectJob);
//Get all jobs rejected by the admin
router.get('/jobs/rejected', adminAuth, adminController.getRejectedJobs);
router.get('/recruiters', adminAuth, adminController.getRecruiters);
// Route: Admin uploads bulk candidates via CSV/Excel
router.post('/upload-candidates', adminAuth, upload.single('file'), adminController.bulkUploadCandidates);



module.exports = router;