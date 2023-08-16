const { Model, DataTypes } = require("sequelize");

const sequelize = require("../config/connection.js");

class Category extends Model {} //defines a class named Category that extends the model class provided by sequelize

// Initialize the Category model with attributes and configuration
Category.init(
  {
    // Define the 'id' attribute as an auto-incrementing primary key
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // Defines the 'category_name' attribute as a non-null string
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, // Use the Sequelize connection object
    timestamps: false, // Disable timestamp columns (createdAt, updatedAt)
    freezeTableName: true, // Prevent Sequelize from pluralizing table name (changing the name)
    underscored: true, // Use snake_case for automatically generated attributes
    modelName: "category", // Specify the model name to use in Sequelize
  }
);

// Export the Category model class for use in other parts of the application
module.exports = Category;

// In summary, this code defines the structure and attributes of the Category model using Sequelize.
// It establishes the mapping between the JavaScript class and the database table, making it easier to work with category data
//  in your application using object-oriented programming concepts.
