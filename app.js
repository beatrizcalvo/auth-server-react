// External dependencies
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Require constants declaration
const errorBody = require("./constants/errorConstants");

// Require controllers declaration
const authController = require("./controllers/authController");

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
      const firstName = request.body.firstName;
      const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      const lastName = request.body.lastName;
      const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
      const email = request.body.email.toLowerCase();
      
      // Save the new user
      userController
        .createUser(
          capitalizedFirstName,
          capitalizedLastName,
          email,
          hashedPassword,
        )
        .then((result) => {
          let responseBody = {
            id: result._id,
            email: result.email,
            createdAt: result.createdAt,
          };
          console.log(
            'POST /register ## Request Body: {"email": "' +
              email +
              '" ...} || Response Status: 201 ## Response Body: ' +
              JSON.stringify(responseBody),
          );
          response.status(201).send(responseBody);
        })
        .catch((error) => {
          // Catch error if save user in database fails
          console.log(
            'POST /register ## Request Body: {"email": "' +
              email +
              '" ...} || Response Status: 500 ## Response Body: ' +
              JSON.stringify(errorBody.AUTH_API_T_0002(error.message)),
          );
          response.status(500).send(errorBody.AUTH_API_T_0002(error.message));
        });
    })
    .catch((error) => {
      // Catch error if the password hash isn't successful
      console.log(
        'POST /register ## Request Body: {"email": "' +
          email +
          '" ...} || Response Status: 500 ## Response Body: ' +
          JSON.stringify(errorBody.AUTH_API_T_0001(error.message)),
      );
      response.status(500).send(errorBody.AUTH_API_T_0001(error.message));
    });
});

app.post("/login", authController.loginUser);


module.exports = app;
