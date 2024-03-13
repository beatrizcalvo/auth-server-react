const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.post("/login", async (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  
  try {
    const error = schemaLogin.validate(request.body);
    if (error) {
      response.status(400).send(error);
    }
  } catch (error) {
    const responseBody = { errors: [errorMessages.AUTH_API_T_0001(error.message.replaceAll('"', "'"))] };
    console.error('POST /auth/login ## Request Body: {"email": "' + email + '" ...} || Response Status: 500 ## Response Body: ' + JSON.stringify(responseBody));
    response.status(500).send(responseBody);
  }
});

const schemaLogin = Joi.object({
  email: Joi.string().email().required(), 
  password: Joi.string().required()
});

module.exports = router;
