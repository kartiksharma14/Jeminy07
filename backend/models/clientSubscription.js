const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const MasterClient = require('./masterClient');
const ClientSubscription = sequelize.define('ClientSubscription', {
  subscription_id: {
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
  cv_download_quota: {
    type: DataTypes.INTEGER,
    allowNull: false,
   
  },
  login_allowed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    //defaultValue: 2
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
  tableName: 'client_subscriptions_details',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ClientSubscription;