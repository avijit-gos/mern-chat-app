/** @format */

const mongoose = require("mongoose");
const MessageSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    sender: { type: mongoose.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true, require: true },
    image: { type: String, default: "" },
    gif: { type: String, default: "" },
    chat: { type: mongoose.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
