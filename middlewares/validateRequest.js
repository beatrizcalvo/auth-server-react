const createHttpError = require('http-errors')
const Joi = require('joi');

const validateRequest = (schema) => async function (req, res, next) { 
  try {
    
    next();
    
  } catch (error) {
    next(error);
  }
};

module.exports = validateRequest;
