const mongoose = require("mongoose");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const Role = require("../models/roleModel");

const createUser = async function (firstName, lastName, email, password) {
  let session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Save profile data
    const profile = Profile({ firstName: firstName, lastName: lastName, role: Role.findOne({ name: "user" }) });
    await profile.save({ session });

    // Save user data
    const user = User({ email: email, password: password, profile: profile });
    const result = await user.save({ session });

    // Commit the changes
    await session.commitTransaction();
    return result;
  } catch (error) {
    // Rollback any changes made in the database
    await session.abortTransaction();
    console.error(error);
    throw error;
  } finally {
    session.endSession();
  }
};

const findByEmail = function (email) {
  return User.findOne({ email: email });
};

const findById = function (id) {
  return User.findOne({ _id: id });
};

const findByIdWithProfile = function (id) {
  return User.findOne({ _id: id }).populate("profile").exec();
};

module.exports = { 
  createUser, 
  findByEmail, 
  findById, findByIdWithProfile
};
