const mongoose = require("mongoose");

const UserTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide a user id!"]
    },
    token: {
      type: String,
      required: [true, "Please provide a token!"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model.UsersTokens || mongoose.model("UsersTokens", UserTokenSchema);
