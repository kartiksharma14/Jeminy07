// models/cvViewTracker.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const CVViewTracker = sequelize.define('CVViewTracker', {
  view_id: {
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
    },
    comment: 'Optional - which job the candidate applied for'
  },
  view_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'cv_view_tracker',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = CVViewTracker;

// Migration (create in migrations folder)
// migrations/YYYYMMDDHHMMSS-create-cv-view-tracker.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cv_view_tracker', {
      view_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      recruiter_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'recruiters',
          key: 'recruiter_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      candidate_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'candidate_profiles',
          key: 'candidate_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      job_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'job_posts',
          key: 'job_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      view_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // Add indexes for performance
    await queryInterface.addIndex('cv_view_tracker', ['recruiter_id']);
    await queryInterface.addIndex('cv_view_tracker', ['candidate_id']);
    await queryInterface.addIndex('cv_view_tracker', ['job_id']);
    await queryInterface.addIndex('cv_view_tracker', ['view_date']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cv_view_tracker');
  }
};