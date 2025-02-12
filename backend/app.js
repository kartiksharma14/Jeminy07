require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 10 * 1024 * 1024 } });
const { sequelize, testConnection } = require("./db");

// Import models
const Signin = require("./models/user");
const CandidateProfile = require("./models/candidateProfile");
const Education = require("./models/education");
const EmploymentDetails = require("./models/employmentdetails");
const Projects = require("./models/projects");

// Define model associations
const initializeAssociations = () => {
  // Define associate methods in each model
  CandidateProfile.associate = (models) => {
    models.CandidateProfile.hasMany(models.EmploymentDetails, {
      foreignKey: 'candidate_id'
    });
    models.CandidateProfile.belongsTo(models.Signin, {
      foreignKey: 'candidate_id'
    });
    models.CandidateProfile.hasMany(models.Education, {
      foreignKey: 'candidate_id'
    });
    models.CandidateProfile.hasMany(models.Projects, {
      foreignKey: 'candidate_id'
    });
  };

  EmploymentDetails.associate = (models) => {
    models.EmploymentDetails.belongsTo(models.CandidateProfile, {
      foreignKey: 'candidate_id'
    });
  };

  Signin.associate = (models) => {
    models.Signin.hasOne(models.CandidateProfile, {
      foreignKey: 'candidate_id'
    });
  };

  Education.associate = (models) => {
    models.Education.belongsTo(models.CandidateProfile, {
      foreignKey: 'candidate_id'
    });
  };

  Projects.associate = (models) => {
    models.Projects.belongsTo(models.CandidateProfile, {
      foreignKey: 'candidate_id'
    });
  };

  // Create models object
  const models = {
    CandidateProfile,
    EmploymentDetails,
    Signin,
    Education,
    Projects
  };

  // Initialize associations
  Object.values(models).forEach((model) => {
    if (model.associate) {
      model.associate(models);
    }
  });
};

// Call the initialize associations function
initializeAssociations();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require("./routes/authRoutes");
const candidateProfileRoutes = require("./routes/candidateProfileRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.post('/upload', upload.single('resume'), (req, res) => {
    res.send('File uploaded successfully!');
});
app.use("/api/candidate-profile", candidateProfileRoutes);

// Root endpoint
app.get("/", (req, res) => {
    res.status(200).send("Welcome to the Job Portal Backend API");
});

// Database connection and server start
testConnection();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
