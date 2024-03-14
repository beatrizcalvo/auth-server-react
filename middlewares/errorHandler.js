const errorMessages = require("../constants/errorConstants");

const errorHandler = (err, req, res, next) => {
  console.log('Executing error handling middleware');
  const statusCode = err.status || 500;
  const responseBody = (statusCode === 500 
                        ? { errors: [errorMessages.AUTH_API_T_0001(err.message.replaceAll('"', "'"))] } 
                        : { error: err.message });
  
  res.status(statusCode).send(responseBody);
};

module.exports = errorHandler;
