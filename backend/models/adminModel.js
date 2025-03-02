'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const bcrypt = require('bcryptjs');
const Otp = require('./otp'); // Import the existing Otp model

const Admin = sequelize.define('Admin', {
  admin_id: {
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
}, {
  tableName: 'admin',
  timestamps: false,
});

// Hash password before saving
Admin.beforeSave(async (admin) => {
  if (admin.changed('password')) {
    admin.password = await bcrypt.hash(admin.password, 10);
  }
});

// Define relationship between Admin and Otp models (based on email)
Admin.hasOne(Otp, { foreignKey: 'email', sourceKey: 'email' });
Otp.belongsTo(Admin, { foreignKey: 'email', targetKey: 'email' });

module.exports = Admin;
