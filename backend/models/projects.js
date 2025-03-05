const { DataTypes } = require("sequelize");
const {sequelize} = require("../db"); // Adjust the path as per your project structure

const Projects = sequelize.define("Projects", {
  project_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  project_title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  client: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  project_status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  project_start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  project_end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  work_duration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  technology_used: {
    type: DataTypes.STRING, // or adjust to match your database column type
    allowNull: true
  },
  details_of_project: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  candidate_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "CandidateProfiles", // Name of the referenced table
      key: "candidate_id",
    },
  },
},
  {
    timestamps: false, // Disable timestamps
    tableName: "projects", // Match your table name in the database
  }
);

module.exports = Projects;
