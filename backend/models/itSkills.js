const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const itSkills = sequelize.define("itSkills", {
  itskills_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  candidate_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'candidate_profile',
      key: 'candidate_id'
    }
  },
  itskills_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  itskills_proficiency: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'it_skills',
  timestamps: false,
  indexes: [{
    fields: ['candidate_id']
  }]
});

itSkills.associate = (models) => {
  itSkills.belongsTo(models.CandidateProfile, {
    foreignKey: 'candidate_id',
    targetKey: 'candidate_id'
  });
};

module.exports = itSkills;