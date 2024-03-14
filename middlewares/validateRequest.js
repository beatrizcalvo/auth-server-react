const createHttpError = require('http-errors')
const Joi = require('joi');

const validateRequest = (schema) => async function (req, res, next) { 
  try {
    const result = schema.validate(req.body, { abortEarly: false});
    if (result.error) {
      throw Error(result.error);
    }
    next();
    
  } catch (error) {
    if (error.isJoi) next(createHttpError(400, error));
    next(createHttpError(500, error));
  }
};

module.exports = validateRequest;
