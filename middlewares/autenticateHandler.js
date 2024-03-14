const createHttpError = require('http-errors');

const autenticateHandler = (req, res, next) => {
  // Get the token from the Authorization header and validate
  const authToken = req.headers.authorization;

  
  console.log("Enter autenticateToken middleware");
  next();
};

module.exports = autenticateHandler;
