const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');


const CandidateProfile = sequelize.define("candidate_profile", {
  candidate_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'signin',
      key: 'candidate_id'
    }
  },
  // Remove name and email as they'll come from signin table
  // Keep phone and resume as they're updatable
  photo: {
    type: DataTypes.BLOB,
    allowNull: true
  },
  
  profile_last_updated: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fresher_experience: {
    type: DataTypes.ENUM('Fresher', 'Experience'),
    allowNull: true
  },
  availability_to_join: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: true
  },
  marital_status: {
    type: DataTypes.ENUM('Single', 'Married', 'Divorced', 'Widowed'),
    allowNull: true
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  differently_abled: {
    type: DataTypes.ENUM('Yes', 'No'),
    allowNull: true
  },
  career_break: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  work_permit_to_usa: {
    type: DataTypes.ENUM('Yes', 'No'),
    allowNull: true
  },
  work_permit_to_country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  permanent_address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  home_town: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pin_code: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  language_proficiency: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  current_industry: {
    type: DataTypes.STRING,
    allowNull: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  desired_job_type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  desired_employment_type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  preferred_shift: {
    type: DataTypes.STRING,
    allowNull: true
  },
  preferred_work_location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  expected_salary: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  resume_headline: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resume: {
    type: DataTypes.BLOB("long"),
    allowNull: false
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  software_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  software_version: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  certification_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  certification_url: {
    type: DataTypes.STRING(2083),
    allowNull: true
  },
  work_title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  work_sample_url: {
    type: DataTypes.STRING(2083),
    allowNull: true
  },
  work_sample_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  profile_summary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  online_profile: {
    type: DataTypes.TEXT, // Stores large text data
    allowNull: true,
  },
  work_sample: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  white_paper: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  presentation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  patent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  certification: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

}, {
  tableName: 'candidate_profile',
  timestamps: false,
  id: false,
  indexes: [
    {
      fields: ['candidate_id']
    }
  ]
});

/*CandidateProfile.associate = (models) => {
  CandidateProfile.hasMany(models.EmploymentDetails, {
    foreignKey: 'candidate_id',
    sourceKey: 'candidate_id'
  });
  CandidateProfile.belongsTo(models.Signin, {
    foreignKey: 'candidate_id',
    targetKey: 'candidate_id'
  });
};*/

/*CandidateProfile.hasMany(models.keyskills, {
  foreignKey: 'candidate_id',
  sourceKey: 'candidate_id'
});
CandidateProfile.hasMany(models.itSkills, {
  foreignKey: 'candidate_id',
  sourceKey: 'candidate_id'
})*/



module.exports = CandidateProfile;