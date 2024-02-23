// External dependencies
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");

// Require constants declaration
const errorBody = require("./constants/errorConstants");

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
    .then((hashedPassword) => {
      // Save the new user
      userController
        .createUser(request.body.email, hashedPassword)
        .then((result) => {
          console.log(JSON.stringify(result));
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      // Catch error if the password hash isn't successful
      console.log(
        'POST /register ## Request Body: {"email": "' +
          request.body.email +
          '" ...} || Response Status: 500 ## Response Body: ' +
          JSON.stringify(errorBody.AUTH_API_T_0001(error.message)),
      );
      response.status(500).send(errorBody.AUTH_API_T_0001(error.message));
    });
});

module.exports = app;
