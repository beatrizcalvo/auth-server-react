require("dotenv").config();
const createHttpError = require('http-errors');
const jwt = require("jsonwebtoken");

const errorMessages = require("../constants/errorConstants");
const userController = require("../db/controllers/userController");

const autenticateHandler = (req, res, next) => {
  // Get the token from the Authorization header and validate
  const authToken = req.headers.authorization;
  if (!authToken || !authToken.toLowerCase().startsWith("bearer ")) 
    return next(createHttpError(401, JSON.stringify([errorMessages.AUTH_API_F_0007()])));

  // Slit the token to remove the "Bearer " part
  const token = authToken.split(" ")[1];

  try {
    // Verify the token and check if the user exists. Any error will return code 401
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Check if a user with this id exists in the database
    userController.findById(decodedToken.sub)
      .then(() => {
        req.currentUserId = decodedToken.sub;
        next();
      })
      .catch(() => {
        next(createHttpError(401, JSON.stringify([errorMessages.AUTH_API_F_0007()])));
      });
  } catch (error) {
    next(createHttpError(401, JSON.stringify([errorMessages.AUTH_API_F_0007()])));
  }
};

module.exports = autenticateHandler;
