const createHttpError = require('http-errors')
const Joi = require('joi');

const validateRequest = (schema) => async function (req, res, next) { 
  try {
    const validated = Joi.validate(req.body, schema, { abortEarly: false});
    req.body = validated
    next();
    
  } catch (error) {
    next(createHttpError(400, error));
  }
};

module.exports = validateRequest;
