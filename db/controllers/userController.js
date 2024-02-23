const User = require("../models/userModel");
const Profile = require("../models/profileModel");

const createUser = function (email, password, profile) {
  const user = new User({ email: email, password: password, profile: profile });
  return user.save();
};

const createProfile = function (firstName, lastName) {
  const profile = new Profile({ firstName: firstName, lastName: lastName });
  return profile.save();
};

module.exports = { createUser, createProfile };
