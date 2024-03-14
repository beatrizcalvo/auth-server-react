const Joi = require('joi');

const validateRequest = (schema) => async function (req, res, next) {
  console.log('Executing validateRequest middleware');
  next();
};

module.exports = validateRequest;
