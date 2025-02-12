const bcrypt = require('bcrypt');
const Recruiter = require('../models/recruiterSignin');
const CandidateProfile = require('../models/candidateProfile'); // 

// Admin Creates Recruiter
exports.createRecruiter = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const recruiter = await Recruiter.create({ email, password: hashedPassword });

    res.status(201).json({
      message: 'Recruiter account created successfully',
      recruiter: {
        recruiter_id: recruiter.recruiter_id,
        email: recruiter.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating recruiter', error: err.message });
  }
};

// Admin Edits Recruiter
exports.editRecruiter = async (req, res) => {
    const { recruiter_id } = req.params;
    const updates = req.body;

    try {
        const recruiter = await Recruiter.findByPk(recruiter_id);
        if (!recruiter) {
            return res.status(404).json({ message: "Recruiter not found" });
        }

        await recruiter.update(updates);
        res.status(200).json({ message: "Recruiter updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating recruiter", error });
    }
};

// Admin Deletes Recruiter
exports.deleteRecruiter = async (req, res) => {
    const { recruiter_id } = req.params;

    try {
        const recruiter = await Recruiter.findByPk(recruiter_id);
        if (!recruiter) {
            return res.status(404).json({ message: "Recruiter not found" });
        }

        await recruiter.destroy();
        res.status(200).json({ message: "Recruiter deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting recruiter", error });
    }
};


// Admin Gets All Recruiters
exports.getAllRecruiters = async (req, res) => {
    try {
        const recruiters = await Recruiter.findAll({ attributes: ['recruiter_id', 'email'] });
        res.status(200).json(recruiters);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recruiters", error });
    }
};


// Admin Creates Candidate
exports.createCandidate = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const candidate = await CandidateProfile.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: "Candidate created successfully", candidate });
    } catch (error) {
        res.status(500).json({ message: "Error creating candidate", error });
    }
};

// Admin Deletes Candidate
exports.deleteCandidate = async (req, res) => {
    const { candidate_id } = req.params;

    try {
        const candidate = await CandidateProfile.findByPk(candidate_id);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        await candidate.destroy();
        res.status(200).json({ message: "Candidate deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting candidate", error });
    }
};

// Admin Edits Candidate Profile
exports.editCandidateProfile = async (req, res) => {
    const { candidate_id } = req.params;
    const updates = req.body;

    try {
        const candidate = await CandidateProfile.findByPk(candidate_id);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        await candidate.update(updates);
        res.status(200).json({ message: "Candidate profile updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating candidate profile", error });
    }
};


// Admin Gets All Candidates
exports.getAllCandidates = async (req, res) => {
    try {
        const candidates = await CandidateProfile.findAll({ attributes: ['candidate_id', 'name', 'email'] });
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ message: "Error fetching candidates", error });
    }
};
