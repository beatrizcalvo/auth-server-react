const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email!"],
      unique: [true, "Email already exists!"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password!"],
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
