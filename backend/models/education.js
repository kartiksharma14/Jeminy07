const { DataTypes } = require("sequelize");
const { sequelize } = require("../db"); // Adjust the path as per your project structure

const Education = sequelize.define(
  "Education",
  {
    education_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "candidate_profiles", // Ensure this matches the actual table name
        key: "candidate_id",
      },
    },
  },
  {
    timestamps: false, // Disable timestamps
    tableName: "education", // Ensure the table name matches the database
  }
);

module.exports = Education;
