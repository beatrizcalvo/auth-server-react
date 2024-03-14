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
  return error.details.map(err => {
    switch (err.type) {
      "any.required":
        return errorMessages.AUTH_API_F_0001(err.path.join("."));
      default: 
        return err;
    }
  });
};

module.exports = validateRequest;
