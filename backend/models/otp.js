/*const db = require('../../db'); // Make sure db.js is correctly connected to MySQL
const tempUserModel = require('../models/temporaryUsers');

// Upsert OTP (Insert if not exist, update if already exist)
const upsertOtp = async (email, otp, otpExpiry) => {
    const [result] = await db.query(
        'INSERT INTO otpstore (email, otp, otp_expiry) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = ?, otp_expiry = ?',
        [email, otp, otpExpiry, otp, otpExpiry]
    );
    return result.affectedRows;
};

// Verify OTP: Check if OTP matches and is within expiry time
const verifyOtp = async (email, otp) => {
    const [rows] = await db.query('SELECT * FROM otpstore WHERE email = ? AND otp = ?', [email, otp]);
    if (rows.length === 0) {
        return false; // OTP not found
    }

    const otpExpiry = new Date(rows[0].otp_expiry);
    const currentTime = new Date();

    if (currentTime > otpExpiry) {
        return false; // OTP expired
    }

    return true; // OTP is valid
};

// Delete OTP after it has been verified or used
const deleteOtp = async (email) => {
    const [result] = await db.query('DELETE FROM otpstore WHERE email = ?', [email]);
    return result.affectedRows;
};

module.exports = {upsertOtp, verifyOtp, deleteOtp};*/



// models/otp.js
const { DataTypes } = require("sequelize");
const {sequelize} = require("../db");

const Otp = sequelize.define(
  "otpstore",
  {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp_expiry: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "otpstore", // Match this to the actual table name
    timestamps: false,
  }
);

module.exports = Otp;