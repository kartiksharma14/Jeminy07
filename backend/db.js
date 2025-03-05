const { Sequelize } = require("sequelize");
require("dotenv").config();

// Initialize Sequelize with utf8mb4 charset to handle wide characters
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectOptions: {
      charset: 'utf8mb4', // Ensure the connection uses utf8mb4 for proper encoding
    },
  }
);

// Define testConnection function
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Export sequelize and testConnection
module.exports = { sequelize, testConnection };
