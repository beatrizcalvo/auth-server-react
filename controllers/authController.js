const bcrypt = require("bcrypt");
const errorMessages = require("../constants/errorConstants");
const userController = require("../db/controllers/userController");

const validateMandatory = function (fieldsList) {
  const errorsList = fieldsList.map(item => {
    if (!item.value) return errorMessages.AUTH_API_F_0001(item.key);
  });
  return errorsList.filter(item => !!item);
};

const registerUser = function (request, response) {
  response.status(200).send({result: "OK"});
};

const loginUser = async function (request, response) {
  const email = request.body.email;
  const password = request.body.password;
  
  // Check mandatory inputs
  const errorsList = validateMandatory([{key: "email", value: email}, {key: "password", value: password}]);
  if (errorsList.length !== 0) {
    const responseBody = { errors: errorsList };
    console.error("POST /auth/login ## Request Body: " + JSON.stringify(request.body) + " || Response Status: 400 ## Response Body: " + JSON.stringify(responseBody));
    return response.status(400).send(responseBody);
  }

  // Check if email exists
  userController.findByEmail(email.toLowerCase())
    .then((user) => {
      // Compare the password entered and the hashed password found
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        const responseBody = {errors: errorMessages.AUTH_API_F_0003() };
        console.error('POST /auth/login ## Request Body: {"email": "' + email + '" ...} || Response Status: 401 ## Response Body: ' + JSON.stringify(responseBody));
        return response.status(401).send(responseBody);
      }

      // Create JWT token
      const token = jwt.sign(
        {
          iss: "react-test-app",
          sub: user._id
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );

      return response.status(200).send({});
    })
    .catch(() => {
      // Catch error if email does not exist
      const responseBody = { errors: errorMessages.AUTH_API_F_0002() };
      console.error('POST /login ## Request Body: {"email": "' + email + '" ...} || Response Status: 400 ## Response Body: ' + JSON.stringify(responseBody));
      return response.status(400).send(responseBody);
    });
};

module.exports = { loginUser, registerUser };
