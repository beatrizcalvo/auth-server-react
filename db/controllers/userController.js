const mongoose = require("mongoose");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const Role = require("../models/roleModel");

const NON_SELECTED_FIELDS = "-__v";

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
  return User.findOne({ email: email }, NON_SELECTED_FIELDS).lean().exec();
};

const findById = function (id) {
  return User.findById(id, NON_SELECTED_FIELDS).lean().exec();
};

const findByIdPopulated = function (id) {
  return User.findById(id, NON_SELECTED_FIELDS).populate({
    path: "profile",
    select: NON_SELECTED_FIELDS,
    populate: {
      path: "role",
      select: "description"
    }
  }).lean().exec();
};

module.exports = { 
  createUser, 
  findByEmail, 
  findById, findByIdPopulated
};
