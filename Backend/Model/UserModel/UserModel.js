/** @format */

const mongoose = require("mongoose");
const UserSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, trim: true, require: true },
    username: { type: String, trim: true, require: true },
    email: { type: String, trim: true, require: true },
    password: { type: String, trim: true, require: true },
    profile_img: { type: String, default: "" },
    ip: { type: String, default: "" },
    // chat: { type: mongoose.Types.ObjectId, ref: "Chat" },
    // message: { type: mongoose.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
