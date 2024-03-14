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
    if (error.isJoi) next(createHttpError(400, createValiationErrors(error)));
    next(createHttpError(500, error));
  }
};

const createValidationErrors = function (error) {
  error.details.map(err => {
    console.log(err.type);
    console.log(err.path);
    console.log(err.message);
  });
  return error;
};

module.exports = validateRequest;
