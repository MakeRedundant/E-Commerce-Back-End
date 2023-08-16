// Imports the Express.js framework
const express = require("express");

// Imports the routes module that defines the application's endpoints
const routes = require("./routes");

// Import the Sequelize connection from another module (connection.js)
// This connection will establish a link to the database

// Create an instance of the Express.js application
const app = express();

// Define the port number on which the server will listen
const PORT = process.env.PORT || 3001;

// Set up middleware to parse JSON data and URL-encoded data
// Middleware are functions that process incoming requests before they reach your routes
// express.json() middleware parses incoming JSON data into a JavaScript object
// express.urlencoded() middleware parses incoming URL-encoded data (form submissions)
// The "extended: true" option allows for rich objects and arrays to be encoded in the URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the imported routes module to define the application's routes
// app.use() mounts the specified middleware function(s) at the specified path
// Here, we're using the routes module to define the routes for our application
// These routes will handle different HTTP requests (GET, POST, etc.) and interact with the database
app.use(routes);

// Sync the Sequelize models with the database
// This step ensures that the defined Sequelize models are created as tables in the database
// After syncing the models, the server is started and it listens on the specified port
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

// app.use is an Express method used to set up middleware functions.

// Middleware functions are functions that process incoming requests before they reach the route handlers.
// app.use(express.json()) sets up middleware to parse incoming JSON data into JavaScript objects.
// Similarly, app.use(express.urlencoded({ extended: true })) sets up middleware to parse incoming URL-encoded data (form submissions) into objects.

// app.use for Mounting Routes:
// app.use can also be used to mount middleware or route handlers at a specific path.
// In the code, app.use(routes) is used to mount the imported routes module at the root path, which means the routes defined in the routes module will be accessible from the root of the server (e.g., /, /api, etc.).

// app.listen:
// app.listen is an Express method that starts the server and makes it listen on a specified port for incoming requests.
// In the provided code, the server starts listening on the port specified by the PORT variable (either from the environment variable PORT or the default port 3001).
// Once the server is started, the callback function logs a message indicating that the application is now listening on the specified port.
