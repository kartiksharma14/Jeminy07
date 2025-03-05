const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const keyskills = sequelize.define("keyskills", {
  keyskills_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  candidate_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'candidate_profile',
      key: 'candidate_id'
    }
  },
  keyskillsname: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'keyskills',
  timestamps: false,
  indexes: [{
    fields: ['candidate_id']
  }]
});

keyskills.associate = (models) => {
  keyskills.belongsTo(models.CandidateProfile, {
    foreignKey: 'candidate_id',
    targetKey: 'candidate_id'
  });
};

module.exports = keyskills;
