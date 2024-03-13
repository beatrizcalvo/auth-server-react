const errorMessages = require("../constants/errorConstants");
const userController = require("../db/controllers/userController");

const validateMandatory = function (fieldsList) {
  fieldsList.map((item) => {
    console.log("key: " + item.key + " value: " + item.value);
    if (!item.value) return errorMessages.AUTH_API_F_0001(item.key);
  });
};

const loginUser = function (request, response) {
  let email = request.body.email;
  let password = request.body.password;
  
  // Check mandatory inputs
  let errorsList = validateMandatory([{key: "email", value: email}, {key: "password", value: password}]);
  console.log(errorsList);
  
  response.status(200).send({result: "OK"});
};

module.exports = { loginUser };
