const mongoose = require("mongoose");

const UserTokenSchema = new mongoose.Schema(
  {},
  { timestamps: true }
);

module.exports = mongoose.model.UserTokens || mongoose.model("UserTokens", UserTokenSchema);
