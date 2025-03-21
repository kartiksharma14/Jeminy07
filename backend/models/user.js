/*const db = require('../../db');

// Add new user with resume and details
const createUser = async (name, email, phone, hashedPassword, resume) => {
    const [result] = await db.query(
        'INSERT INTO signin (name, email, phone, password, resume) VALUES (?, ?, ?, ?, ?)',
        [name, email, phone, hashedPassword, resume]
    );
    return result.insertId;
};

// Find user by email
const findUserByEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM signin WHERE email = ?', [email]);
    return rows[0];
};

module.exports = { createUser, findUserByEmail};*/


// models/user.js

const { DataTypes, Op } = require("sequelize");
const { sequelize } = require("../db");
const cron = require('node-cron');
const CandidateProfile = require('./candidateProfile');

const User = sequelize.define(
  "signin",
  {
    candidate_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hashed_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resume: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },
    last_login: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    timestamps: false,
    tableName: 'signin'
  }
);

// Add deactivation method
User.deactivateInactiveUsers = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  await User.update(
    { is_active: false },
    {
      where: {
        last_login: {
          [Op.lt]: sixMonthsAgo
        },
        is_active: true
      }
    }
  );
};

// Initialize the cron job
cron.schedule('0 0 * * *', User.deactivateInactiveUsers);
// Define a one-to-one association using the alias 'candidate_profile'
User.hasOne(CandidateProfile, { foreignKey: 'candidate_id', as: 'candidate_profile' });

// Optionally, also define the reverse association:
CandidateProfile.belongsTo(User, { foreignKey: 'candidate_id', as: 'candidate_profile' });
module.exports = User;