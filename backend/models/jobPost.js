/*const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Recruiter = require('./recruiterSignin'); // Ensure correct relative path

const JobPost = sequelize.define('JobPost', {
  job_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  recruiter_id: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'recruiter_signin',
        key: 'recruiter_id'
    }
  },
  jobTitle: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  employmentType: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  keySkills: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const value = this.getDataValue('keySkills');
      return value ? JSON.parse(value) : [];
    },
    set(val) {
      this.setDataValue('keySkills', JSON.stringify(val));
    }
  },
  department: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  workMode: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  locations: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  industry: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  diversityHiring: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  jobDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  multipleVacancies: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  companyName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  companyInfo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  companyAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  min_salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  max_salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  min_experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  max_experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  job_creation_date: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  },

  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    allowNull: false,
    defaultValue: 'pending',
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true, // Only used when approved
    field: 'approvedBy', // Explicitly map to the database column
  },
  rejectedBy: {
    type: DataTypes.INTEGER,
    allowNull: true, // Only used when rejected
    field: 'rejectedBy', // Explicitly map to the database column
  },
  rejection_reason: {
    type: DataTypes.STRING,
    allowNull: true, // Only used when rejected
  }
  
}, {
  tableName: 'job_posts',
  timestamps: true,
});

JobPost.belongsTo(Recruiter, { foreignKey: 'recruiter_id', onDelete: 'CASCADE' });
Recruiter.hasMany(JobPost, { foreignKey: 'recruiter_id' });

module.exports = JobPost;*/


const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Recruiter = require('./recruiterSignin'); // Ensure correct relative path

const JobPost = sequelize.define('JobPost', {
  job_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  recruiter_id: {
     type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'recruiter_signin',
        key: 'recruiter_id'
    }
  },
  jobTitle: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  employmentType: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  keySkills: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const value = this.getDataValue('keySkills');
      return value ? JSON.parse(value) : [];
    },
    set(val) {
      this.setDataValue('keySkills', JSON.stringify(val));
    }
  },
  department: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  workMode: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  locations: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  industry: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  diversityHiring: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  jobDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: {
        args: [0, 3000],
        msg: "Job description cannot exceed 3000 characters"
      }
    }
  },
  multipleVacancies: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  companyName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  companyInfo: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 3000],
        msg: "Job description cannot exceed 3000 characters"
      }
    }
  },
  companyAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  min_salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  max_salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  min_experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  max_experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  job_creation_date: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  end_date: {
    type: DataTypes.STRING(10), // Using STRING to store in DD/MM/YY format
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  },
   status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    allowNull: false,
    defaultValue: 'pending',
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true, // Only used when approved
    field: 'approvedBy', // Explicitly map to the database column
  },
  rejectedBy: {
    type: DataTypes.INTEGER,
    allowNull: true, // Only used when rejected
    field: 'rejectedBy', // Explicitly map to the database column
  },
  rejection_reason: {
    type: DataTypes.STRING,
    allowNull: true, // Only used when rejected
  }
  
}, {
  tableName: 'job_posts',
  timestamps: true,
});

JobPost.belongsTo(Recruiter, { foreignKey: 'recruiter_id', onDelete: 'CASCADE' });
Recruiter.hasMany(JobPost, { foreignKey: 'recruiter_id' });

module.exports = JobPost;


