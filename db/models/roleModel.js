const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a role name!"]
    }
  },
  { timestamps: true }
);

module.exports =
  mongoose.model.Roles || mongoose.model("Roles", RoleSchema);
