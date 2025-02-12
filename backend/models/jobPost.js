const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const JobPost = sequelize.define('JobPost', {
  job_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  job_title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  job_highlights: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  employment_type: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  key_skills: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  it_skills: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  education_level: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  department: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  role_category: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  work_mode: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  min_salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  max_salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  min_experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  max_experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  candidate_industry: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  diversity_hiring: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  job_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  no_of_vacancy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  company_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  company_address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  company_website: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  about_company: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  schedule_job_refresh: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  job_creation_date: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  expiry_in_days: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  },
}, {
  tableName: 'job_post',
  timestamps: false,
});

module.exports = JobPost;