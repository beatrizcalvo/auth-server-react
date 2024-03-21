const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide a first name!"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name!"],
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roles",
      required: [true, "Please provide a role!"],
    }
  },
  { timestamps: true },
);

module.exports =
  mongoose.model.Profiles || mongoose.model("Profiles", ProfileSchema);
