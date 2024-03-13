const userController = require("../db/controllers/userController");

const loginUser = function (request, response) {
  let email = request.body.email;
  
  // Check mandatory inputs
  if (!email) {
    response.status(400).send({result: "KO"});
  }
  
  response.status(200).send({result: "OK"});
};

module.exports = { loginUser };
