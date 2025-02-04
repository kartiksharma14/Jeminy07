//candidateProfileController.js
const OTP = require("../models/otp");
const TemporaryUsers = require("../models/temporaryUsers");
const User = require("../models/user");
/*const CandidateProfile = require("../models/candidateProfile"); // Add this import, ensure the path is correct

console.log("candidateProfileController file loaded");


// Updated getUserDetails with token-only validation
exports.getUserDetails = async (req, res) => {
    try {
      const { candidate_id } = req.params;
  
      if (!candidate_id) {
        return res.status(400).json({ error: "Candidate ID is required" });
      }
  
      const userDetails = await CandidateProfile.findOne({ 
        where: { candidate_id } 
      });
  
      if (!userDetails) {
        return res.status(404).json({ error: "Candidate profile not found" });
      }
  
      res.status(200).json({
        message: "Candidate profile fetched successfully",
        data: userDetails
      });
    } catch (error) {
      console.error("Error fetching candidate details:", error);
      res.status(500).json({ 
        error: "An error occurred while fetching candidate details" 
      });
    }
  };
  
  // Updated updateUserDetails with token-only validation
  exports.updateUserDetails = async (req, res) => {
    try {
      const { candidate_id, name, phone, resume, ...rest } = req.body;
  
      if (!candidate_id) {
        return res.status(400).json({ error: "Candidate ID is required" });
      }
  
      if (rest.email) {
        return res.status(400).json({ error: "Email cannot be updated" });
      }
  
      const existingProfile = await CandidateProfile.findOne({ 
        where: { candidate_id } 
      });
  
      if (!existingProfile) {
        const newProfile = await CandidateProfile.create({
          candidate_id,
          name,
          phone,
          resume,
          ...rest,
        });
  
        return res.status(201).json({
          message: "Profile created successfully",
          data: newProfile,
        });
      }
  
      const updatedProfile = await CandidateProfile.update(
        { name, phone, resume, ...rest },
        { where: { candidate_id }, returning: true, plain: true }
      );
  
      return res.status(200).json({
        message: "Profile updated successfully",
        data: updatedProfile[1],
      });
    } catch (error) {
      console.error("Error updating candidate details:", error);
      res.status(500).json({ 
        error: "An error occurred while updating candidate details" 
      });
    }
  };*/

  // controllers/candidateProfileController.js
/*const CandidateProfile = require("../models/candidateProfile");

exports.getUserDetails = async (req, res) => {
  try {
    const { candidate_id } = req.params;

    if (!candidate_id) {
      return res.status(400).json({ error: "Candidate ID is required" });
    }

    const userDetails = await CandidateProfile.findOne({ 
      where: { candidate_id }
    });

    if (!userDetails) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }

    res.status(200).json({
      message: "Candidate profile fetched successfully",
      data: userDetails
    });
  } catch (error) {
    console.error("Error fetching candidate details:", error);
    res.status(500).json({ 
      error: "An error occurred while fetching candidate details",
      details: error.message
    });
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const { candidate_id } = req.params;
    const updateData = req.body;

    if (!candidate_id) {
      return res.status(400).json({ error: "Candidate ID is required" });
    }

    // Remove any readonly or non-existent fields
    delete updateData.profile_last_updated; // This is auto-updated
    delete updateData.candidate_id; // Don't allow changing the ID

    const existingProfile = await CandidateProfile.findOne({ 
      where: { candidate_id } 
    });

    if (!existingProfile) {
      const newProfile = await CandidateProfile.create({
        candidate_id,
        ...updateData
      });

      return res.status(201).json({
        message: "Profile created successfully",
        data: newProfile,
      });
    }

    await CandidateProfile.update(
      updateData,
      { 
        where: { candidate_id }
      }
    );

    // Fetch the updated record
    const updatedProfile = await CandidateProfile.findOne({
      where: { candidate_id }
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      data: updatedProfile
    });
  } catch (error) {
    console.error("Error updating candidate details:", error);
    res.status(500).json({ 
      error: "An error occurred while updating candidate details",
      details: error.message
    });
  }
};*/


const Signin = require("../models/user");
const CandidateProfile = require("../models/candidateProfile");
const { Op, Sequelize } = require('sequelize'); // Import Sequelize and Op for query operations

console.log('CandidateProfile model:', !!CandidateProfile);
console.log('CandidateProfile methods:', Object.keys(CandidateProfile));

exports.getUserDetails = async (req, res) => {
  try {
    const { candidate_id } = req.params;

    if (!candidate_id) {
      return res.status(400).json({ error: "Candidate ID is required" });
    }

    // Get data from both tables
    const [signinData, profileData] = await Promise.all([
      Signin.findOne({
        where: { candidate_id },
        attributes: ['name', 'email','phone', 'resume'] // Only get what we need
      }),
      CandidateProfile.findOne({
        where: { candidate_id }
      })
    ]);

    if (!signinData) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    // Combine the data
    const combinedData = {
      ...signinData.get({ plain: true }),
      ...(profileData ? profileData.get({ plain: true }) : {})
    };

    res.status(200).json({
      message: "Candidate profile fetched successfully",
      data: combinedData
    });

  } catch (error) {
    console.error("Error fetching candidate details:", error);
    res.status(500).json({
      error: "An error occurred while fetching candidate details",
      details: error.message
    });
  }
};

exports.updateUserDetails = async (req, res) => {
    try {
        const { candidate_id } = req.params;
        const updateData = req.body;
  
        if (!candidate_id) {
            return res.status(400).json({ error: "Candidate ID is required" });
        }
  
        // Remove readonly fields
        delete updateData.profile_last_updated;
        delete updateData.candidate_id;
  
        // Check if update data is empty after removing readonly fields
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "No valid fields provided for update" });
        }
  
        // First check if user exists in signin
        const signin = await Signin.findOne({ 
            where: { candidate_id },
            attributes: ['email', 'name', 'phone', 'resume']
        });
  
        if (!signin) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find or create profile with explicit primary key
        let [profile, created] = await CandidateProfile.findOrCreate({ 
            where: { candidate_id },
            defaults: {
                candidate_id,  // Explicitly set the primary key
                ...updateData
            }
        });

        if (!created) {
            // Update existing profile
            await CandidateProfile.update(updateData, {
                where: { candidate_id }
            });
        }
  
        // If phone or resume is being updated, update in signin table too
        if (updateData.phone || updateData.resume) {
            await Signin.update({
                phone: updateData.phone || signin.phone,
                resume: updateData.resume || signin.resume
            }, {
                where: { candidate_id }
            });
        }

        // Fetch the final updated profile
        const updatedProfile = await CandidateProfile.findOne({
            where: { candidate_id }
        });
  
        // Get final combined data
        const updatedData = {
            name: signin.name,
            email: signin.email,
            ...(updatedProfile ? updatedProfile.get({ plain: true }) : {})
        };
  
        return res.status(200).json({
            message: "Profile updated successfully",
            data: updatedData
        });
  
    } catch (error) {
        console.error("Error updating candidate details:", error);
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: "Invalid data provided",
                details: error.message
            });
        }
        
        res.status(500).json({
            error: "An error occurred while updating candidate details",
            details: error.message
        });
    }
};

exports.getCandidatesByExperience = async (req, res) => {
  try {
    const { min_experience, max_experience } = req.query;

    // Ensure that both min_experience and max_experience are numbers
    const minExp = parseFloat(min_experience);
    const maxExp = parseFloat(max_experience);

    // Validate experience range
    if (isNaN(minExp) || isNaN(maxExp)) {
      return res.status(400).json({
        error: "Both minimum and maximum experience values are required and must be numbers",
      });
    }

    if (minExp > maxExp) {
      return res.status(400).json({
        error: "Minimum experience cannot be greater than maximum experience",
      });
    }

    // Fetch candidates with experience in the given range
    const candidates = await CandidateProfile.findAll({
      where: {
        experience_in_year: {
          [Op.gte]: minExp,  // Greater than or equal to minExp
          [Op.lte]: maxExp,  // Less than or equal to maxExp
        },
      },
      attributes: {
        include: [
          [Sequelize.col('Signin.name'), 'name'], // Alias for name from Signin
          [Sequelize.col('Signin.email'), 'email'], // Alias for email from Signin
        ],
      },
      include: {
        model: Signin,
        attributes: [], // Avoid nesting Signin in the response
        required: true,
      },
      order: [['experience_in_year', 'ASC']], // Ordering by experience
    });

    // Check if candidates exist
    if (!candidates || candidates.length === 0) {
      return res.status(404).json({
        error: `No candidates found with experience between ${minExp} and ${maxExp} years`,
      });
    }

    // Format candidates into plain objects for response
    const formattedCandidates = candidates.map((candidate) => candidate.get({ plain: true }));

    // Include total number of candidates in the response
    res.status(200).json({
      total_candidates: formattedCandidates.length, // Total count of filtered candidates
      data: formattedCandidates,
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({
      error: "An error occurred while fetching candidates",
      details: error.message,
    });
  }
};
