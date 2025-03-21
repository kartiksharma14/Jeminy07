// models/cvDownloadTracker.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const CVDownloadTracker = sequelize.define('CVDownloadTracker', {
  download_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  recruiter_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'recruiters',
      key: 'recruiter_id'
    }
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  candidate_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'candidate_profiles',
      key: 'candidate_id'
    }
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'job_posts',
      key: 'job_id'
    }
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  download_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'cv_download_tracker',
  timestamps: false,

});

module.exports = CVDownloadTracker;