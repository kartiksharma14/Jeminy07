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
