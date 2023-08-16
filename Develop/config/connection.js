// Import the `dotenv` package to load environment variables from .env file
require("dotenv").config();

// Import the Sequelize library
const Sequelize = require("sequelize");

// Create a Sequelize connection object
const sequelize = process.env.JAWSDB_URL
  ? // If JAWSDB_URL environment variable exists (production environment), use it as the connection URL
    new Sequelize(process.env.JAWSDB_URL)
  : // If not, use individual environment variables for connection details (development environment)
    new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: "localhost", // Database host
        dialect: "mysql", // MySQL dialect
        dialectOptions: {
          decimalNumbers: true, // Convert decimals to numbers
        },
      }
    );

// Export the connection object to be used by other parts of the application
module.exports = sequelize;
