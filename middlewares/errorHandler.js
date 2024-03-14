const errorHandler = (err, req, res, next) => {
  console.log('Executing error handling middleware');
  res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;
