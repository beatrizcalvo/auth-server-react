const User = require("../models/userModel");

const createUser = function (email, password) {
  const user = new User({ email: email, password: password });
  return user.save();
};

module.exports = { createUser };
