const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide a first name!"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide a last name!"],
  },
});

module.exports =
  mongoose.model.Profiles || mongoose.model("Profiles", ProfileSchema);
