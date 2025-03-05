/*const db = require('../../db'); // Your database connection

// Save user data to temporary_users
exports.saveTemporaryUser = async (email, name, hashedPassword, phone, resume) => {
    const query = `
        INSERT INTO temporary_users (email, name, hashed_password, phone, resume)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name = VALUES(name), hashed_password = VALUES(hashed_password), phone = VALUES(phone), resume = VALUES(resume)
    `;
    await db.execute(query, [email, name, hashedPassword, phone, resume]);
};

// Delete temporary user
exports.deleteTemporaryUser = async (email) => {
    const query = `DELETE FROM temporary_users WHERE email = ?`;
    await db.execute(query, [email]);
};

// Get temporary user data
exports.getTemporaryUserByEmail = async (email) => {
    const query = `SELECT * FROM temporary_users WHERE email = ?`;
    const [rows] = await db.execute(query, [email]);
    return rows[0];
};*/


// models/temporaryUsers.js
// models/temporaryUsers.js
const { DataTypes } = require("sequelize");
const {sequelize} = require("../db");

const TemporaryUser = sequelize.define(
  "temporary_users",
  {
    email: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    hashed_password: {  // Changed from password to hashed_password
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    resume: {
      type: DataTypes.BLOB('long'),
      allowNull: true,  // Changed to match schema
    },
    created_at: {  // Added this field
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    timestamps: false,
    tableName: 'temporary_users'
  }
);

module.exports = TemporaryUser;