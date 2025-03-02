const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Recruiter = require('../models/recruiterSignin'); // Adjust path as necessary

    const TempJobPost = sequelize.define('TempJobPost', {
      temp_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      session_id: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      jobTitle: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      employmentType: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      keySkills: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      department: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      workMode: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      locations: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      industry: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      diversityHiring: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      jobDescription: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      multipleVacancies: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      companyName: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      companyInfo: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      companyAddress: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      min_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      max_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      min_experience: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      max_experience: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      created_by: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      expiry_time: {
        type: DataTypes.DATE,
        allowNull: true
      },
      recruiter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'recruiter_sign', 
            key: 'recruiter_id'
        }
    }
    }, {
      tableName: 'temp_job_posts',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    });
  
    module.exports = TempJobPost;
