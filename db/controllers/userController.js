const mongoose = require("mongoose");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");

const createUser = async function (firstName, lastName, email, password) {
  let session = await mongoose.startSession();
  session.startTransaction();
  try {
    const profile = Profile({ firstName: firstName, lastName: lastName });
    const user = User({ email: email, password: password });

    // Save data
    await profile.save({ session });
    user.profile.push(profile);
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

module.exports = { createUser };
