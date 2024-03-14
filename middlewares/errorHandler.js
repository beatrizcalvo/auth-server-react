const errorHandler = (err, req, res, next) => {
  console.log('Executing error handling middleware');
  const statusCode = err.status || 500;
  const responseBody = (statusCode === 500 ? { error: 'Internal Server Error' } : { error: err.message });
  
  res.status(statusCode).send(responseBody);
};

module.exports = errorHandler;
