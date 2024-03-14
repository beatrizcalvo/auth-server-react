const createHttpError = require('http-errors');

const errorMessages = require("../constants/errorConstants");

const autenticateHandler = (req, res, next) => {
  // Get the token from the Authorization header and validate
  const authToken = req.headers.authorization;
  if (!authToken || !authToken.toLowerCase().startsWith("bearer ")) 
    return next(createHttpError(401, JSON.stringify([errorMessages.AUTH_API_F_0007()])));

  
  console.log("Enter autenticateToken middleware");
  next();
};

module.exports = autenticateHandler;
