// models/RecruiterSignin.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db'); // Your Sequelize instance

const RecruiterSignin = sequelize.define('RecruiterSignin', {
    recruiter_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, // Required field
        unique: true, // Ensure email is unique
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false, // Required field
    },
    level: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field
    },
}, {
    tableName: 'recruiter_signin', // Explicitly set the table name
    timestamps: false, // Disable createdAt and updatedAt
});

module.exports = RecruiterSignin;