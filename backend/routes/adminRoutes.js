const express = require('express');
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

//Create Recruiter
router.post('/createRecruiter', verifyAdmin, adminController.createRecruiter);
router.patch('/editRecruiter/:recruiter_id', verifyAdmin, adminController.editRecruiter);
router.delete('/deleteRecruiter/:recruiter_id', verifyAdmin, adminController.deleteRecruiter);
router.get('/getAllRecruiters', verifyAdmin, adminController.getAllRecruiters);

//Create Candidate
router.post('/createCandidate', verifyAdmin, adminController.createCandidate);
router.delete('/deleteCandidate/:candidate_id', verifyAdmin, adminController.deleteCandidate);
router.patch('/editCandidate/:candidate_id', verifyAdmin, adminController.editCandidateProfile);
router.get('/getAllCandidates', verifyAdmin, adminController.getAllCandidates);

module.exports = router;