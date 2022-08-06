/** @format */

const mongoose = require("mongoose");
const Message = require("../../Model/MessageModal/MessageModal");
const User = require("../../Model/UserModel/UserModel");
const Chat = require("../../Model/ChatSchema/ChatSchema");
const { json } = require("express");

class messageController {
  constructor() {
    console.log("messageController init");
  }

  async createMessage(req, res) {
    const { content, chatId } = req.body;
    if (!chatId) {
      return res.status(401).json({ msg: "Invalid or empty chat id" });
    } else {
      var isChatExists = await Chat.findById(chatId);
      if (!isChatExists) {
        return res.status(401).json({ msg: "Chat does not exists" });
      } else {
        if (!req.files) {
          const newMessage = Message({
            _id: new mongoose.Types.ObjectId(),
            content: content,
            chat: chatId,
            sender: req.user._id,
          });
          var message = await newMessage.save();
          try {
            var chat = await Chat.findByIdAndUpdate(
              chatId,
              {
                $set: { latestMsg: message._id },
              },
              { new: true }
            );
            var fullMessage = await Message.findById(message._id)
              .populate("sender", "-password")
              .populate("chat")
              .populate({
                path: "chat",
                populate: { path: "users", model: "User" },
              })
              .populate({
                path: "chat",
                populate: { path: "latestMsg", model: "Message" },
              });
            return res.status(200).json(fullMessage);
          } catch (error) {
            return res.status(501).json({ msg: error.message });
          }
        }
      }
    }
  }

  async fetchMessages(req, res) {
    const { chatId } = req.params;
    if (!chatId) {
      return res.status(401).json({ msg: "Invalid or empty chat id" });
    } else {
      var isChatExists = await Chat.findById(chatId);
      if (!isChatExists) {
        return res.status(401).json({ msg: "Chat does not exists" });
      } else {
        var allMessages = await Message.find({ chat: chatId })
          .populate("sender", "-password")
          .populate("chat")
          .populate({
            path: "chat",
            populate: { path: "users", model: "User" },
          });

        try {
          return res.status(200).json(allMessages);
        } catch (error) {
          return res.status(501).json({ msg: error.message });
        }
      }
    }
  }
}

module.exports = new messageController();
