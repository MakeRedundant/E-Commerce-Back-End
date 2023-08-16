const router = require("express").Router(); // Create an instance of an Express Router

const apiRoutes = require("./api"); // Import the routes defined in the 'api' folder

// Use the imported 'apiRoutes' for URLs that start with '/api'
router.use("/api", apiRoutes);

// If the request doesn't match any defined routes, this middleware function is used
router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>"); // Send a response with a message indicating a wrong route
});

module.exports = router; // Export the router to be used in other parts of the application

// SUMMARY:
// This index.js file serves as the main router configuration for the Express application.
// It imports the 'apiRoutes' module and sets up middleware to handle URLs starting with '/api'.
// For incoming requests that don't match the '/api' routes, a fallback middleware sends a response indicating a wrong route.
// The router configured here is exported to be used in other parts of the application.
