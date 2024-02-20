// External dependencies
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");

// Require database connection
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");

// Execute database connection
dbConnect();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;

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
    .then((hashedPassword) => {
      // reate a new user instance and collect the data
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });

      // Save the new user
      user
        .save()
        .then((result) => {
          response.status(201).send({
            message: "User created successfully",
            id: result._id,
          });
        })
        .catch((error) => {
          response.status(500).send({
            errors: [{ message: "Error creating user", description: error }],
          });
        });
    })
    .catch((error) => {
      // Catch error if the password hash isn't successful
      response.status(500).send({
        errors: [
          { message: "Error hashing password", description: error.message },
        ],
      });
    });
});

module.exports = app;
