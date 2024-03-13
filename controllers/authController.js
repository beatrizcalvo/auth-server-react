const bcrypt = require("bcrypt");
const errorMessages = require("../constants/errorConstants");
const userController = require("../db/controllers/userController");

const validateMandatory = function (fieldsList) {
  let errorsList = fieldsList.map(item => {
    if (!item.value) return errorMessages.AUTH_API_F_0001(item.key);
  });
  return errorsList.filter(item => !!item);
};

const loginUser = function (request, response) {
  let email = request.body.email;
  let password = request.body.password;
  
  // Check mandatory inputs
  let errorsList = validateMandatory([{key: "email", value: email}, {key: "password", value: password}]);
  if (errorsList.length !== 0) {
    let responseBody = { errors: errorsList };
    console.error("POST /auth/login ## Request Body: " + JSON.stringify(request.body) + " || Response Status: 400 ## Response Body: " + JSON.stringify(responseBody));
    return response.status(400).send(responseBody);
  }

  // Check if email exists
  userController.findByEmail(email.toLowerCase())
    .then((user) => {
      // Compare the password entered and the hashed password found
      bcrypt.compare(password, user.password).then().catch();
    })
    .catch(() => {
      // Catch error if email does not exist
      let responseBody = { errors: errorMessages.AUTH_API_F_0002() };
      console.log(errorMessages.AUTH_API_F_0002());
      console.error('POST /login ## Request Body: {"email": "' + email + '" ...} || Response Status: 404 ## Response Body: ' + JSON.stringify(responseBody));
      return response.status(404).send(responseBody);
    });
  
  response.status(200).send({result: "OK"});
};

module.exports = { loginUser };
