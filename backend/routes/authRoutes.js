// routes/authRoutes.js
const express = require("express");
const multer = require("multer");
const authController = require("../controllers/authController");

// First, verify the controller is loaded correctly
console.log('authController:', authController); // Add this line to debug
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/signup", upload.single("resume"), authController.signup);
router.post("/verify-otp", authController.verifyOtp);
router.post("/signin", authController.signin);


module.exports = router;
