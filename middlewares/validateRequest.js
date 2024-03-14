const createHttpError = require('http-errors')
const Joi = require('joi');

const errorMessages = require("../constants/errorConstants");

const validateRequest = (schema) => async function (req, res, next) { 
  try {
    const result = schema.validate(req.body, { abortEarly: false});
    if (result.error) next(createHttpError(400, createValidationErrors(result.error)));
    next();    
  } catch (error) {
    next(createHttpError(500, error));
  }
};

const createValidationErrors = function (error) {
  const listErrors = [];
  error.details.map(err => {
    const field = err.path.join(".");
    switch (err.type) {
      case "any.required":
        listErrors.push(errorMessages.AUTH_API_F_0001(field));
        break;
      case "string.base" || "string.email":
        listErrors.push(errorMessages.AUTH_API_F_0002(field));
        break;
      default: 
        listErrors.push(err);
        break;
    }
  });
  return listErrors;
};

module.exports = validateRequest;
