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

router.post("/login", validateRequest(loginSchema), async function(req, res, next) {  
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    // Check if email exists
    userController.findByEmail(email)
      .then(user => {
        // Compare the password entered and the hashed password found
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        if (!isMatch) return next(createHttpError(401, JSON.stringify([errorMessages.AUTH_API_F_0006()])));

        // Create JWT token
        const token = jwt.sign(
          { iss: "react-test-app", sub: user._id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: '1h' }
        );

        // Return success response
        const responseBody = {
          access_token: token,
          token_type: "Bearer",
          expires_in: "3600"
        };
        console.log('POST /auth/login ## Request Body: {"email": "' + email + '" ...} || Response Status: 200 ## Response Body: ' + JSON.stringify(responseBody));
        res.status(200).send(responseBody);
      })
      .catch(() => {
        next(createHttpError(400, JSON.stringify([errorMessages.AUTH_API_F_0005()])));
      });    
  } catch (error) {
    next(createHttpError(500, error));
  }
});

router.post("/register", validateRequest(registerSchema), (req, res, next) => {
  try {
    const firstName = req.body.firstName;
    const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const lastName = req.body.lastName;
    const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    
    // Hash the password
    const hashedPassword = bcrypt.hash(password, 10);

    // Save the new user
    userController.createUser(capitalizedFirstName, capitalizedLastName, email, hashedPassword)
      .then(result => {
        const responseBody = {
          id: result._id,
          email: result.email,
          createdAt: result.createdAt
        };
        console.log('POST /auth/register ## Request Body: {"firstName": "' + firstName + '", "lastName": "' + lastName + '", "email": "' + email + '" ...} || Response Status: 201 ## Response Body: ' + JSON.stringify(responseBody));
        res.status(201).send(responseBody);
      })
      .catch(() => {
        next(createHttpError(500, JSON.stringify([errorMessages.AUTH_API_T_0002()])));
      });    
  } catch (error) {
    next(createHttpError(500, error));
  }
});

module.exports = router;
