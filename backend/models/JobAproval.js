const JobApproval = sequelize.define('JobApproval', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Job',
        key: 'id'
      }
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Admin',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    remarks: {
      type: DataTypes.TEXT
    }
  }, {
    timestamps: true // Include timestamps for job approvals
  });
  
  // Define relationships
  Admin.hasMany(AdminToken, { foreignKey: 'adminId' });
  AdminToken.belongsTo(Admin, { foreignKey: 'adminId' });
  
  Admin.hasMany(JobApproval, { foreignKey: 'adminId' });
  JobApproval.belongsTo(Admin, { foreignKey: 'adminId' });
  
  // Export models
  module.exports = {
    Admin,
    AdminToken,
    JobApproval
  };