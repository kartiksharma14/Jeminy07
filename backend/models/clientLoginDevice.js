// models/clientLoginDevice.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const ClientLoginDevice = sequelize.define('ClientLoginDevice', {
  device_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'master_clients',
      key: 'client_id'
    }
  },
  login_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'client_login_devices',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { name: 'idx_client_login_devices_client_id', fields: ['client_id'] },
    { name: 'idx_client_login_devices_login_id', fields: ['login_id'] },
    { name: 'idx_client_login_devices_active', fields: ['is_active'] },
    { name: 'idx_client_login_devices_last_login', fields: ['last_login'] }
  ]
});

module.exports = ClientLoginDevice;
