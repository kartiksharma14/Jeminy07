const { DataTypes } = require('sequelize');
const {sequelize} = require('../db'); // Adjust path as needed

const Recruiter = sequelize.define(
    'Recruiter',
    {
        recruiter_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Add other fields as necessary
    },
    {
        tableName: 'recruiter_sign', // Specify the table name
        timestamps: false, // If your table doesn't have createdAt/updatedAt fields
    }
);

module.exports = Recruiter;
