require("dotenv").config();
const createHttpError = require('http-errors');
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const errorMessages = require("../constants/errorConstants");
const validateRequest = require("../middlewares/validateRequest");
const { loginSchema, registerSchema } = require("../validators/authValidator");
const userController = require("../db/controllers/userController");

router.post("/login", validateRequest(loginSchema), (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  
  // Check if email exists
  userController.findByEmail(email)
    .then(user => {
      // Compare the password entered and the hashed password found
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          // Check if password matches
          if (!isMatch) return next(createHttpError(401, JSON.stringify([errorMessages.AUTH_API_F_0006()])));

          // Create JWT tokens
          const payload = { iss: "react-test-app", sub: user._id };
          const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' } );
          const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY

          // Return success response
          const responseBody = {
            access_token: accessToken,
            token_type: "Bearer",
            expires_in: "3600"
          };
          console.error('POST /auth/login ## Request Body: {"email": "' + email + '" ...} || Response Status: 200 ## Response Body: ' + JSON.stringify(responseBody));
          res.status(200).send(responseBody);
        })
        .catch(error => {
          next(createHttpError(500, error));
        });
      })
    .catch(() => {
      next(createHttpError(400, JSON.stringify([errorMessages.AUTH_API_F_0005()])));
    });   
});

router.post("/register", validateRequest(registerSchema), (req, res, next) => {
  const firstName = req.body.firstName.trim();
  const lastName = req.body.lastName.trim();
  const email = req.body.email.trim().toLowerCase();
  const password = req.body.password;

  // Hash the password
  bcrypt
    .hash(password, 10)
    .then(hashedPassword => {
      const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

      // Save the new user
      userController.createUser(capitalizedFirstName, capitalizedLastName, email, hashedPassword)
        .then(result => {
          const responseBody = {
            id: result._id,
            email: result.email,
            createdAt: result.createdAt,
          };
          console.error('POST /auth/register ## Request Body: {"firstName": "' + firstName + '", "lastName": "' + lastName + '", "email": "' + email + '" ...} || Response Status: 201 ## Response Body: ' + JSON.stringify(responseBody));
          res.status(201).send(responseBody);
        })
        .catch(error => {
          next(createHttpError(500, JSON.stringify([errorMessages.AUTH_API_T_0002(error.message.replaceAll('"', "'"))])));
        });
    })
    .catch(error => {
      next(createHttpError(500, error));
    });
});

module.exports = router;
