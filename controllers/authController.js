require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const errorMessages = require("../constants/errorConstants");
const userController = require("../db/controllers/userController");

const validateMandatory = function (fieldsList) {
  const errorsList = fieldsList.map(item => {
    if (!item.value) return errorMessages.AUTH_API_F_0001(item.key);
  });
  return errorsList.filter(item => !!item);
};

const registerUser = function (request, response) {
  const firstName = request.body.firstName;
  const lastName = request.body.lastName;
  const email = request.body.email;
  const password = request.body.password;

  // Check mandatory inputs
  const errorsList = validateMandatory([{key: "firstName", value: firstName}, {key: "lastName", value: lastName}, {key: "email", value: email}, {key: "password", value: password}]);
  if (errorsList.length !== 0) {
    const responseBody = { errors: errorsList };
    console.error("POST /auth/register ## Request Body: " + JSON.stringify(request.body) + " || Response Status: 400 ## Response Body: " + JSON.stringify(responseBody));
    return response.status(400).send(responseBody);
  }

  // Hash the password
  bcrypt
    .hash(password, 10)
    .then(hashedPassword => {
      const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

      // Save the new user
      userController.createUser(capitalizedFirstName, capitalizedLastName, email, hashedPassword)
        .then(result => {
          const responseBody = {
            id: result._id,
            email: result.email,
            createdAt: result.createdAt,
          };
          console.error('POST /auth/register ## Request Body: {"firstName": "' + firstName + '", "lastName": "' + lastName + '", "email": "' + email + '" ...} || Response Status: 201 ## Response Body: ' + JSON.stringify(responseBody));
          return response.status(201).send(responseBody);
        })
        .catch(error => {
          // Catch error if save user in database fails
          const responseBody = { errors: [errorMessages.AUTH_API_T_0002(error.message)]};
          console.error('POST /auth/register ## Request Body: {"firstName": "' + firstName + '", "lastName": "' + lastName + '", "email": "' + email + '" ...} || Response Status: 500 ## Response Body: ' + JSON.stringify(responseBody));
          return response.status(500).send(responseBody);
        });
    })
    .catch(error => {
      // Catch error if the password hash isn't successful
      const responseBody = { errors: [errorMessages.AUTH_API_T_0001(error.message)] };
      console.error('POST /auth/register ## Request Body: {"firstName": "' + firstName + '", "lastName": "' + lastName + '", "email": "' + email + '" ...} || Response Status: 500 ## Response Body: ' + JSON.stringify(responseBody));
      return response.status(500).send(responseBody);
    });
};

const loginUser = function (request, response) {
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
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          // Check if password matches
          if (!isMatch) {
            const responseBody = { errors: [errorMessages.AUTH_API_F_0003()] };
            console.error('POST /auth/login ## Request Body: {"email": "' + email + '" ...} || Response Status: 401 ## Response Body: ' + JSON.stringify(responseBody));
            return response.status(401).send(responseBody);
          }

          // Create JWT token
          const token = jwt.sign(
            { iss: "react-test-app", sub: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
          );

          // Return success response
          const responseBody = {
            access_token: token,
            token_type: "Bearer",
            expires_in: "3600"
          };
          console.error('POST /auth/login ## Request Body: {"email": "' + email + '" ...} || Response Status: 200 ## Response Body: ' + JSON.stringify(responseBody));
          return response.status(200).send(responseBody);
        })
        .catch(() => {
          // Catch error if password do not match
          const responseBody = { errors: [errorMessages.AUTH_API_F_0003()] };
          console.error('POST /auth/login ## Request Body: {"email": "' + email + '" ...} || Response Status: 401 ## Response Body: ' + JSON.stringify(responseBody));
          return response.status(401).send(responseBody);
        });
    })
    .catch(() => {
      // Catch error if email does not exist
      const responseBody = { errors: [errorMessages.AUTH_API_F_0002()] };
      console.error('POST /auth/login ## Request Body: {"email": "' + email + '" ...} || Response Status: 400 ## Response Body: ' + JSON.stringify(responseBody));
      return response.status(400).send(responseBody);
    });
};

module.exports = { loginUser, registerUser };
