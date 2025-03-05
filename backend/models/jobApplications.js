const { DataTypes } = require('sequelize');
const {sequelize} = require('../db'); // Ensure this points to your Sequelize instance
const CandidateProfile = require('./candidateProfile');
const JobPost = require('./jobpost');

const JobApplication = sequelize.define('JobApplication', {
    application_id: {
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
    applied_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'job_applications',
    timestamps: false
});

// Define Associations
JobApplication.belongsTo(CandidateProfile, { foreignKey: 'candidate_id' });
JobApplication.belongsTo(JobPost, { foreignKey: 'job_id' });

CandidateProfile.hasMany(JobApplication, { foreignKey: 'candidate_id' });
JobPost.hasMany(JobApplication, { foreignKey: 'job_id' });

module.exports = JobApplication;
