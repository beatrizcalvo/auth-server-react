const errorMessages = require("../constants/errorConstants");
const userController = require("../db/controllers/userController");

const validateMandatory = function (fieldsList) {
  return fieldsList.map((item) => {
    if (!item.value) return errorMessages.AUTH_API_F_0001(item.key);
  });
};

const loginUser = function (request, response) {
  let email = request.body.email;
  let password = request.body.password;
  
  // Check mandatory inputs
  let errorsList = validateMandatory([{key: "email", value: email}, {key: "password", value: password}]);
  if (!!errorsList) {
    let responseBody = { errors: errorsList };
    console.error("POST /auth/login ## Request Body: " + JSON.stringify(request.body) + " || Response Status: 400 ## Response Body: " + JSON.stringify(responseBody));
    response.status(400).send(responseBody);
  }

  // Check if email exists
  userController.findByEmail(email.toLowerCase())
    .catch(() => {
      // Catch error if email does not exist
      let responseBody = { errors: errorMessages.AUTH_API_F_0002() };
      console.error('POST /login ## Request Body: {"email": "' + email + '" ...} || Response Status: 404 ## Response Body: ' + JSON.stringify(responseBody));
      response.status(404).send(responseBody);
    });
  
  response.status(200).send({result: "OK"});
};

module.exports = { loginUser };
