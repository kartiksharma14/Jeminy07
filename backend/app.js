require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "uploads/", limits: { fileSize: 10 * 1024 * 1024 } });
const { sequelize, testConnection } = require("./db");

// Import models
const Signin = require("./models/user");
const CandidateProfile = require("./models/candidateProfile");
const Education = require("./models/education");
const EmploymentDetails = require("./models/employmentdetails");
const Projects = require("./models/projects");
const keyskills = require("./models/keyskills");
const itSkills = require("./models/itSkills");
const TemporaryRecruiter = require("./models/temporaryRecruiter");
const OTP = require("./models/otp");
const Admin = require('./models/adminModel');
const Recruiter = require('./models/recruiterSignin');
const jobPost = require('./models/jobpost');
const TempJobPost= require('./models/TempJobPost')


// Import controllers
const authController = require("./controllers/authController");
const candidateProfileController = require("./controllers/candidateProfileController");
const recruiterController = require("./controllers/recruiterController");
const adminController = require("./controllers/adminController");
// Define model associations
const initializeAssociations = () => {
    // Create a models object to use for associations
    const models = {
        CandidateProfile,
        EmploymentDetails,
        Signin,
        Education,
        Projects,
        Recruiter,
        TemporaryRecruiter,
        OTP,
        keyskills,     
        itSkills,
        TempJobPost
    };

    // CandidateProfile associations
    CandidateProfile.hasMany(EmploymentDetails, { foreignKey: "candidate_id" });
    CandidateProfile.belongsTo(Signin, { foreignKey: "candidate_id" });
    CandidateProfile.hasMany(Education, { foreignKey: "candidate_id" });
    CandidateProfile.hasMany(Projects, { foreignKey: "candidate_id" });

    // EmploymentDetails associations
    EmploymentDetails.belongsTo(CandidateProfile, { foreignKey: "candidate_id" });

    // Signin associations
    Signin.hasOne(CandidateProfile, { foreignKey: "candidate_id" });

    // Education associations
    Education.belongsTo(CandidateProfile, { foreignKey: "candidate_id" });

    // Projects associations
    Projects.belongsTo(CandidateProfile, { foreignKey: "candidate_id" });


    CandidateProfile.hasMany(keyskills, { foreignKey: "candidate_id" });
    keyskills.belongsTo(CandidateProfile, { foreignKey: "candidate_id" });

    CandidateProfile.hasMany(itSkills, {foreignKey: "candidate_id"});
    itSkills.belongsTo(CandidateProfile, {foreignKey: "candidate_id"});


    // Recruiter associations
    Recruiter.belongsTo(OTP, { foreignKey: "email", targetKey: "email" });

    // TemporaryRecruiter associations
    TemporaryRecruiter.belongsTo(OTP, { foreignKey: "email", targetKey: "email" });
};

// Call the initialize associations function
initializeAssociations();


// Add this to your app.js after importing all models but before using them
const MasterClient = require('./models/masterClient');
const ClientSubscription = require('./models/clientSubscription');

// Set up associations
MasterClient.hasMany(ClientSubscription, { 
  foreignKey: 'client_id',
  as: 'subscriptions'
});

ClientSubscription.belongsTo(MasterClient, { 
  foreignKey: 'client_id',
  as: 'client'
});

console.log('Model associations established');

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require("./routes/authRoutes");
const candidateProfileRoutes = require("./routes/candidateProfileRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const adminRoutes = require('./routes/adminRoutes');
//const jobApprovalRoutes = require('./routes/jobApprovalRoutes');



// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/candidate-profile", candidateProfileRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api', candidateProfileRoutes);
app.use("/api/candidate", candidateProfileRoutes);
app.use('/api/recruiter', recruiterRoutes);

// admin routes
app.use('/api/admin', adminRoutes);
//app.use('/api/job-approval', jobApprovalRoutes);

app.post("/upload", upload.single("resume"), (req, res) => {
    res.send("File uploaded successfully!");
});

// Root endpoint
app.get("/", (req, res) => {
    res.status(200).send("Welcome to the Job Portal Backend API");
});

// Log controllers for debugging
console.log("authController:", authController);
console.log("Imported candidateProfileController functions:", candidateProfileController);
console.log("Imported recruiterController functions:", recruiterController);
console.log("Imported adminController functions:", adminController);

// Database connection and server start
testConnection();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
