// models/savedJob.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const CandidateProfile = require('./candidateProfile');
const JobPost = require('./jobpost');

const SavedJob = sequelize.define('SavedJob', {
    saved_job_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    job_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: JobPost,
            key: 'job_id'
        }
    },
    candidate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CandidateProfile,
            key: 'candidate_id'
        }
    },
    saved_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'saved_jobs',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['job_id', 'candidate_id']
        }
    ]
});

// Define Associations
SavedJob.belongsTo(CandidateProfile, { foreignKey: 'candidate_id' });
SavedJob.belongsTo(JobPost, { foreignKey: 'job_id' });

CandidateProfile.hasMany(SavedJob, { foreignKey: 'candidate_id' });
JobPost.hasMany(SavedJob, { foreignKey: 'job_id' });

module.exports = SavedJob;