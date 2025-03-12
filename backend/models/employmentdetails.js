/*const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const EmploymentDetails = sequelize.define(
  "EmploymentDetails",
  {
    employment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    current_employment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employment_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    current_company_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    current_job_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    joining_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    current_salary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    skill_used: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    job_profile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    experience_in_year:{
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    experience_in_months:{
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    notice_period: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "candidate_profile", // Reference table name
        key: "candidate_id",
      },
    },
  },
  {
    timestamps: false, // Disable timestamps
    tableName: "employmentdetails", // Match your table name in the database
  }
);

EmploymentDetails.associate = (models) => {
  EmploymentDetails.belongsTo(models.CandidateProfile, {
    foreignKey: 'candidate_id',
    targetKey: 'candidate_id'
  });
};

module.exports = EmploymentDetails;*/



const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const EmploymentDetails = sequelize.define(
  "EmploymentDetails",
  {
    employment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "candidate_profile",
        key: "candidate_id",
      },
    },
    // Common fields for all types
    current_employment: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Yes or No"
    },
    employment_type: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Full-Time or Internship"
    },
    current_company_name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Current company name for current employment"
    },
    previous_company_name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Previous company name for non-current employment"
    },
    joining_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    currently_working: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    worked_till: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "End date for non-current employment"
    },
    
    // Full-Time specific fields
    current_job_title: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "For current Full-Time"
    },
    previous_job_title: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "For previous Full-Time"
    },
    current_salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "For current Full-Time"
    },
    skill_used: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "For Full-Time"
    },
    job_profile: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Description of job responsibilities"
    },
    notice_period: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "For current Full-Time"
    },
    experience_in_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    experience_in_months: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    
    // Internship specific fields
    company_location: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "For Internships"
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "For Internships"
    },
    monthly_stipend: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "For Internships"
    }
  },
  {
    timestamps: false,
    tableName: "employmentdetails",
  }
);

EmploymentDetails.associate = (models) => {
  EmploymentDetails.belongsTo(models.CandidateProfile, {
    foreignKey: 'candidate_id',
    targetKey: 'candidate_id'
  });
};

module.exports = EmploymentDetails;
