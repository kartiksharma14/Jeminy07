// models/candidateProfile.js
/*const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const CandidateProfile = sequelize.define('candidate_profile', {
  candidate_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: true,
    references: {
      model: 'signin',
      key: 'candidate_id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  photo: {
    type: DataTypes.BLOB,
    allowNull: true
  },
  profile_last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fresher_experience: {
    type: DataTypes.ENUM('Fresher', 'Experience'),
    allowNull: false
  },
  availability_to_join: {
    type: DataTypes.DATE,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
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
  current_employment: {
    type: DataTypes.ENUM('Employed', 'Unemployed'),
    allowNull: true
  },
  employment_type: {
    type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'),
    allowNull: true
  },
  current_company_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  current_job_title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  joining_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  current_salary: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  skill_used: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  job_profile: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notice_period: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  resume_headline: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: false
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  project_title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  client: {
    type: DataTypes.STRING,
    allowNull: true
  },
  project_status: {
    type: DataTypes.ENUM('Ongoing', 'Completed', 'On Hold'),
    allowNull: true
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  work_duration: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  details_of_project: {
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
  }
}, {
  tableName: 'candidate_profile',
  timestamps: false,
  id: false, // Tell Sequelize not to assume an id field
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['candidate_id']
    }
  ]
});

module.exports = CandidateProfile;*/


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
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fresher_experience: {
    type: DataTypes.ENUM('Fresher', 'Experience'),
    allowNull: false
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
  current_employment: {
    type: DataTypes.ENUM('Employed', 'Unemployed'),
    allowNull: true
  },
  employment_type: {
    type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'),
    allowNull: true
  },
  current_company_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  current_job_title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  joining_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  current_salary: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  skill_used: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  job_profile: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notice_period: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  resume_headline: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: false
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  project_title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  client: {
    type: DataTypes.STRING,
    allowNull: true
  },
  project_status: {
    type: DataTypes.ENUM('Ongoing', 'Completed', 'On Hold'),
    allowNull: true
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  work_duration: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  details_of_project: {
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

  key_skills: {
    type: DataTypes.STRING, // Adjust datatype as needed
    allowNull: true,
  },
  experience_in_year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  experience_in_months: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  education_level: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  university: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  course: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  coursestart_year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  courseend_year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  it_skills: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  it_skills_proficiency: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  project_titles: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  technology_used: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  project_start_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  project_end_date: {
    type: DataTypes.DATE,
    allowNull: true,
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
  id: false, // Tell Sequelize not to assume an id field
  indexes: [
    /*{
      unique: true,
      fields: ['email']
    },*/
    {
      fields: ['candidate_id']
    }
  ]
});
// Add this at the end of candidateProfile.js
module.exports = CandidateProfile;