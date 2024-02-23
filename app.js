// External dependencies
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");

// Require database connection
const dbConnect = require("./db/dbConnect");
const userController = require("./db/controllers/userController");

// Execute database connection
dbConnect();

// Initialize Express app
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

// Register new user
app.post("/register", (request, response) => {
  // Hash the password
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {})
    .catch((error) => {
      // Catch error if the password hash isn't successful
      let errorBody = {
        errors: [
          {
            code: "AUTH_API-T-0001",
            level: "error",
            message: "Error hashing password",
            description: error.message,
          },
        ],
      };
      console.log(
        'POST /register ## Request Body: {"email": "' +
          request.body.email +
          '" ...} || Response Status: 500 ## Response Body: ' +
          JSON.stringify(errorBody) +
          "|| Error Description: " +
          error,
      );
      response.status(500).send(errorBody);
    });
});

module.exports = app;
