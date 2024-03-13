// Import required controllers
const authController = require("./controllers/authController");

// Execute database connection
const dbConnect = require("./db/dbConnect");
dbConnect();

// Initialize Express app
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

// Set up CORS and JSON middlewares
var cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Server configuration
const server = app.listen(port, () =>
  console.log(`Auth Server app listening on port ${port}!`),
);
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

// App Routes
app.post("/auth/login", authController.loginUser);

module.exports = app;
