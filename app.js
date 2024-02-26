// External dependencies
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

// Login an existing user
app.post("/login", (request, response) => {
  // Check if email exists
  userController.findByEmail(request.body.email.toLowerCase())
    .then((user) => {
      // Compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)
        .then((passwordCheck) => {
          // Check if password matches
          if (!passwordCheck) {
            console.log(
              'POST /login ## Request Body: {"email": "' +
                request.body.email +
                '" ...} || Response Status: 400 ## Response Body: ' +
                JSON.stringify(errorBody.AUTH_API_F_0002()),
            );
            response.status(400).send(errorBody.AUTH_API_F_0002());
          }

          // Create JWT token
          const token = jwt.sign(
            {
              iss: "react-test-app",
              sub: user._id
              //iat: Date.now(),
              //exp: Date.now() + 1
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
          );
          
          // Return success response
          let responseBody = {
            accessToken: token,
            tokenType: "Bearer",
            passwordCheck: passwordCheck
          };
          
          console.log(
            'POST /login ## Request Body: {"email": "' +
              request.body.email +
              '" ...} || Response Status: 200 ## Response Body: ' +
              JSON.stringify(responseBody)
          );
          response.status(200).send(responseBody);
        })
        .catch(() => {
          // Catch error if password do not match
          console.log(
            'POST /login ## Request Body: {"email": "' +
              request.body.email +
              '" ...} || Response Status: 400 ## Response Body: ' +
              JSON.stringify(errorBody.AUTH_API_F_0002()),
          );
          response.status(400).send(errorBody.AUTH_API_F_0002());
        });
    })
    .catch(() => {
      // Catch error if email does not exist
      console.log(
        'POST /login ## Request Body: {"email": "' +
          request.body.email +
          '" ...} || Response Status: 404 ## Response Body: ' +
          JSON.stringify(errorBody.AUTH_API_F_0001()),
      );
      response.status(404).send(errorBody.AUTH_API_F_0001());
    });
});

module.exports = app;
