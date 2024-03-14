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
  
});

module.exports = router;
