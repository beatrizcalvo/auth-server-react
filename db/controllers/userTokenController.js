const mongoose = require("mongoose");
const UserToken = require("../models/userTokenModel");

const updateToken = function (userId, token) {
  return UserToken.findOneAndUpdate(
    { userId: userId }, 
    { token: token }, 
    { upsert: true }
  );
};

module.exports = { 
  updateToken
};
