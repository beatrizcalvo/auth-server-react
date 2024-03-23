require("dotenv").config();
const createHttpError = require('http-errors');
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const errorMessages = require("../constants/errorConstants");
const validateRequest = require("../middlewares/validateRequest");
const { loginSchema, registerSchema, refreshSchema } = require("../validators/authValidator");
const userController = require("../db/controllers/userController");
const userTokenController = require("../db/controllers/userTokenController");

const ACCESS_TOKEN_EXPIRES_IN = "1h";
const REFRESH_TOKEN_EXPIRES_IN= "12h";

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
          const accessToken = createToken(user._id, process.env.ACCESS_TOKEN_SECRET_KEY, ACCESS_TOKEN_EXPIRES_IN);
          const refreshToken = createToken(user._id, process.env.REFRESH_TOKEN_SECRET_KEY, REFRESH_TOKEN_EXPIRES_IN);

          // Save refresh token in the database
          userTokenController.updateToken(user._id, refreshToken)
            .then(() => {
              // Return success response
              const responseBody = createResponseTokens(accessToken, refreshToken);
              console.error('POST /auth/login ## Request Body: {"email": "' + email + 
                            '" ...} || Response Status: 200 ## Response Body: ' + 
                            JSON.stringify(responseBody));
              res.status(200).send(responseBody);
            })
            .catch(() => {
              next(createHttpError(500, error));
            });
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
          console.error('POST /auth/register ## Request Body: {"firstName": "' + firstName + '", "lastName": "' + lastName + 
                        '", "email": "' + email + '" ...} || Response Status: 201 ## Response Body: ' + JSON.stringify(responseBody));
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

router.post("/refresh", validateRequest(refreshSchema), (req, res, next) => {
  const token = req.body.refresh_token.trim();

  try {
    // Verify the token and check if the token exists. Any error will return code 401
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);

    // Check if the token exists in the database
    userTokenController.findByToken(token)
      .then(() => {
        // Create new access token
        const newAccessToken = createToken(decodedToken.sub, process.env.ACCESS_TOKEN_SECRET_KEY,ACCESS_TOKEN_EXPIRES_IN);
      })
      .catch(() => {
        next(createHttpError(401, JSON.stringify([errorMessages.AUTH_API_F_0007()])));
      });
  } catch (error) {
    next(createHttpError(401, JSON.stringify([errorMessages.AUTH_API_F_0007()])));
  }
});

const createToken = (sub, secretKey, expiresIn) => {
  const payload = { iss: "react-test-app", sub: sub };
  return jwt.sign(payload, secretKey, { expiresIn: expiresIn } );
};

const createResponseTokens = (accessToken, refreshToken) => {
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: "Bearer",
    expires_in: "3600"
  };
};

module.exports = router;
