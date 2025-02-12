// controllers/recruiterController.js
const OTP = require('../models/otp');
const TemporaryRecruiter = require('../models/temporaryRecruiter');
const RecruiterSignin = require('../models/recruiterSignin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

        // Generate JWT Token (valid for 72 hours)
        const token = jwt.sign(
            { recruiter_id: recruiter.recruiter_id, email: recruiter.email },
            JWT_SECRET,
            { expiresIn: '72h' }
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