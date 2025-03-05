const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Questions = sequelize.define('Questions', {
    question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    job_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'job_posts',
            key: 'job_id',
        },
        onDelete: 'CASCADE',
    },
    question_one: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    question_two: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    question_three: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    question_four: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    question_five: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'questions',
    timestamps: false, 
});

module.exports = Questions;