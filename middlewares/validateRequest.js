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
  error.details.map(err => {
    console.log(err.type);
    console.log(err.path);
    console.log(err.message);
    switch (err.type) {
      default: 
        return err.message;
    }
  });
  return error;
};

module.exports = validateRequest;
