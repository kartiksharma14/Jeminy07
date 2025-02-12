// controllers/recruiterController.js
const OTP = require('../models/otp');
const TemporaryRecruiter = require('../models/temporaryRecruiter');
const RecruiterSignin = require('../models/recruiterSignin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JobPost = require('../models/jobPost');
const Questions = require('../models/questions');
const { sequelize } = require('../db');  // New import
const cities = require('../data/cities.json');

const { JWT_SECRET } = process.env;
// POST: Recruiter Sign-In (Send OTP)
exports.recruiterSignin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the recruiter is already signed up
        const existingRecruiter = await TemporaryRecruiter.findOne({ where: { email } });
        if (existingRecruiter) {
            return res.status(400).json({ message: 'OTP already sent. Please verify the OTP.' });
        }

        // Store email and password temporarily
        await TemporaryRecruiter.upsert({ email, password });

        // Generate OTP manually (6-digit random number)
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        // Save OTP in otpstore table
        await OTP.upsert({ email, otp, otp_expiry: otpExpiry });

        // Send OTP to recruiter (mock/send via email or SMS)
        console.log(`OTP sent to ${email}: ${otp}`);

        res.status(200).json({ message: 'OTP sent successfully', email });
    } catch (error) {
        res.status(500).json({ message: 'Error during recruiter sign-in', error });
    }
};

// POST: Verify OTP
exports.verifyRecruiterOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Validate OTP
        const otpEntry = await OTP.findOne({ where: { email, otp } });
        if (!otpEntry || new Date() > otpEntry.otp_expiry) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Fetch temporary recruiter data
        const tempRecruiter = await TemporaryRecruiter.findOne({ where: { email } });
        if (!tempRecruiter) {
            return res.status(400).json({ message: 'No temporary recruiter found. Please sign in again.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(tempRecruiter.password, 10);

        // Save to recruiter_signin table
        const recruiter = await RecruiterSignin.create({
            name: tempRecruiter.name,
            email: tempRecruiter.email,
            password: hashedPassword,
        });

        // Generate JWT Token (valid for 240 hours)
        const token = jwt.sign(
            { recruiter_id: recruiter.recruiter_id, email: recruiter.email },
            JWT_SECRET,
            { expiresIn: '720h' }
        );

        // Cleanup temporary recruiter and OTP entries
        await TemporaryRecruiter.destroy({ where: { email } });
        await OTP.destroy({ where: { email } });

        res.status(200).json({
            message: 'OTP verified. Sign-in successful!',
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error });
    }
};


// Create Job Post
exports.createJobPost = async (req, res) => {
    const { questions, location, ...jobDetails } = req.body;
    const transaction = await sequelize.transaction();

    try {
        // Validate location
        if (location) {
            const cityExists = cities.cities.some(
                (city) => city.City.toLowerCase() === location.toLowerCase()
            );

            if (!cityExists) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: "Invalid city",
                });
            }
        }

        // Step 1: Create the Job Post
        const newJob = await JobPost.create({ ...jobDetails, location }, { transaction });

        // Step 2: Insert Questions if Provided
        if (questions) {
            await Questions.create(
                {
                    job_id: newJob.job_id,
                    question_one: questions.question_one,
                    question_two: questions.question_two,
                    question_three: questions.question_three,
                    question_four: questions.question_four,
                    question_five: questions.question_five,
                },
                { transaction }
            );
        }

        // Commit the Transaction
        await transaction.commit();
        return res.status(200).json({ message: "Job post created successfully.", job: newJob });
    } catch (error) {
        // Rollback Transaction in Case of Error
        await transaction.rollback();
        console.error('Error creating job post:', error.message);
        return res.status(500).json({ message: "Failed to create job post.", error: error.message });
    }
};  

// Update Job Post (Edit Any Field)
/*exports.updateJobPost = async (req, res) => {
    try {
        const { job_id } = req.params;
        const { location, ...updatedData } = req.body;

        // Validate location
        if (location) {
            const cityExists = cities.cities.some(
                (city) => city.City.toLowerCase() === location.toLowerCase()
            );

            if (!cityExists) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid city",
                });
            }
        }

        // Find the job post by ID
        const job = await JobPost.findByPk(job_id);

        if (!job) {
            return res.status(404).json({ error: 'Job post not found' });
        }

        // Update the job post with the provided data
        await job.update({ ...updatedData, location });

        return res.status(200).json({
            message: 'Job post updated successfully',
            job,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update job post', details: error.message });
    }
};*/


exports.updateJobPost = async (req, res) => {
    try {
        const { job_id } = req.params;
        const { location, ...updatedData } = req.body;

        // Validate location
        if (location) {
            const cityExists = cities.cities.some(
                (city) => city.City.toLowerCase() === location.toLowerCase()
            );

            if (!cityExists) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid city",
                });
            }
        }

        // Find the job post by ID
        const job = await JobPost.findByPk(job_id);

        if (!job) {
            return res.status(404).json({ error: 'Job post not found' });
        }

        // Update the job post with the provided data
        await job.update({ ...updatedData, location });

        return res.status(200).json({
            message: 'Job post updated successfully',
            job,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update job post', details: error.message });
    }
};
  

// Delete Job Post
exports.deleteJobPost = async (req, res) => {
    try {
      const { job_id } = req.params;
  
      const job = await JobPost.findByPk(job_id);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
  
      await job.destroy();
      return res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete job', details: error.message });
    }
  };
  

  // Get All Job Posts
exports.getAllJobs = async (req, res) => {
    try {
      const jobs = await JobPost.findAll();
      return res.status(200).json({ jobs });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch jobs', details: error.message });
    }
  };
  

/*exports.getQuestions = async (req, res) => {
    const { job_id } = req.params;
  
    try {
      const questions = await Questions.findOne({ where: { job_id } });
      if (!questions) {
        return res.status(404).json({ message: "No questions found for this job." });
      }
      return res.status(200).json(questions);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch questions.", error: error.message });
    }
  };

  // Add Questions
  exports.addQuestions = async (req, res) => {
      const { job_id, question_one, question_two, question_three, question_four, question_five } = req.body;
  
      try {
          const newQuestions = await Questions.create({
              job_id,
              question_one,
              question_two,
              question_three,
              question_four,
              question_five,
          });
  
          return res.status(201).json({ message: 'Questions added successfully.', questions: newQuestions });
      } catch (error) {
          return res.status(500).json({ message: 'Failed to add questions.', error: error.message });
      }
  };
  
  // Update Questions
  exports.updateQuestions = async (req, res) => {
      const { question_id } = req.params;
  
      try {
          const updatedQuestions = await Questions.update(req.body, {
              where: { question_id },
              returning: true, // For Sequelize
          });
  
          return res.status(200).json({ message: 'Questions updated successfully.', questions: updatedQuestions });
      } catch (error) {
          return res.status(500).json({ message: 'Failed to update questions.', error: error.message });
      }
  };
  
  // Delete Questions
  exports.deleteQuestions = async (req, res) => {
      const { question_id } = req.params;
  
      try {
          await Questions.destroy({ where: { question_id } });
  
          return res.status(200).json({ message: 'Questions deleted successfully.' });
      } catch (error) {
          return res.status(500).json({ message: 'Failed to delete questions.', error: error.message });
      }
  };*/
  
