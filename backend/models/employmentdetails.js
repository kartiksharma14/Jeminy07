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

module.exports = EmploymentDetails;
