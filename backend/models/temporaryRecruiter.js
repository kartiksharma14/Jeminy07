// models/temporaryRecruiter.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../db');

const temporaryRecruiter = sequelize.define('temporaryRecruiter', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'temporary_recruiter', // Explicitly set the table name
    timestamps: true, // Ensure createdAt and updatedAt are managed
});

module.exports = temporaryRecruiter;