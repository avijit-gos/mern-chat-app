/** @format */

const mongoose = require("mongoose");
const ChatSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    chatName: { type: String, trim: true, require: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    latestMsg: { type: mongoose.Types.ObjectId, ref: "Message" },
    groupAdmin: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
