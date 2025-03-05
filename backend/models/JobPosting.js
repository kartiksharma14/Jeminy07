// models/jobPosting.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobPosting = sequelize.define('JobPosting', {
    job_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    job_title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    job_description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    salary: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    recruiter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'RecruiterSignin', // References the RecruiterSignin table
            key: 'recruiter_id',
        },
    },
});

module.exports = JobPosting;