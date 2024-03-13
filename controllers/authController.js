const errorMessages = require("../constants/errorConstants");
const userController = require("../db/controllers/userController");

const loginUser = function (request, response) {
  let email = request.body.email;
  
  // Check mandatory inputs
  if (!email) {
    console.error("Error");
    response.status(400).send(errorMessages.AUTH_API_F_0001("email"));
  }
  
  response.status(200).send({result: "OK"});
};

module.exports = { loginUser };
