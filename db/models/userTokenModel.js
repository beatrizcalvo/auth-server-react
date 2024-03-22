const mongoose = require("mongoose");

const UserTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide a user id!"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model.UserTokens || mongoose.model("UserTokens", UserTokenSchema);
