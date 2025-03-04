// models/RecruiterSignin.js
/*const { DataTypes } = require('sequelize');
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

module.exports = RecruiterSignin;*/


'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const bcrypt = require('bcryptjs');


const Recruiter = sequelize.define('Recruiter', {
  recruiter_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {  // Add the name field
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  company_name: {  // Added company_name field
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  admin_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'Admin', // References the Admin table
      key: 'admin_id',
    },
  },
}, {
  tableName: 'recruiter_signin',
  timestamps: false,
});

// Hash password before saving
Recruiter.beforeSave(async (recruiter) => {
  if (recruiter.changed('password')) {
    recruiter.password = await bcrypt.hash(recruiter.password, 10);
  }
});

module.exports = Recruiter;
