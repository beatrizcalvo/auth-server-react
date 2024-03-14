const createHttpError = require('http-errors')
const Joi = require('joi');

const validateRequest = (schema) => async function (req, res, next) { 
  try {
    const validated = schema.validate(req.body, { abortEarly: false});
    console.log("validated");
    req.body = validated
    next();
    
  } catch (error) {
    console.log(error);
    if (error.isJoi) next(createHttpError(400, error));
    next(createHttpError(500, error));
  }
};

module.exports = validateRequest;
