/** @format */

const User = require("../../Model/UserModel/UserModel");
const Chat = require("../../Model/ChatSchema/ChatSchema");
const Message = require("../../Model/MessageModal/MessageModal");
const mongoose = require("mongoose");

class chatController {
  constructor() {
    console.log("chatController init");
  }

  // create new chat
  async createChat(req, res) {
    const { content, profileId } = req.body;
    // console.log(profileId);
    if (!profileId) {
      return res.status(401).json({ msg: "Invalid or empty profile id" });
    } else {
      var user = await User.findById(profileId);

      if (!user) {
        return res.status(401).json({ msg: "No user found" });
      } else {
        var isChatExists = await Chat.find({
          isGroupChat: false,
          $and: [
            { users: { $elemMatch: { $eq: profileId } } },
            { users: { $elemMatch: { $eq: req.user._id } } },
          ],
        })
          .populate("users", "-password")
          .populate({
            path: "latestMsg",
            populate: { path: "sender", model: "user" },
          });

        console.log(isChatExists);
        // chat already exists
        if (isChatExists.length > 0) {
          return res.status(200).json(isChatExists);
        }
        // chat does not exist
        else {
          const newChat = Chat({
            _id: new mongoose.Types.ObjectId(),
            chatName: "sender",
            isGroup: false,
            users: [profileId, req.user._id],
          });
          var isChat = await newChat.save();
          var fullChat = await Chat.findById(isChat._id).populate(
            "users",
            "-password"
          );
          try {
            return res.status(201).json(fullChat);
          } catch (error) {
            return res.status(501).json({ msg: error.message });
          }
        }
      }
    }
  }

  // fetch all chats
  async fetchChats(req, res) {
    var fullChats = await Chat.find({ users: req.user._id })
      .populate("users", "-password")
      .populate("latestMsg")
      .populate({
        path: "latestMsg",
        populate: { path: "sender", model: "User" },
      })
      .sort({ createdAt: -1 });

    try {
      return res.status(200).json(fullChats);
    } catch (error) {
      return res.status(501).json({ msg: error.message });
    }
  }

  // create group chat
  async createGroupChat(req, res) {
    var { groupName, users } = req.body;
    console.log(users);
    if (!groupName.trim || JSON.parse(users).length < 1) {
      return res.status(401).json({ msg: "Invalid group creation request" });
    } else {
      users = JSON.parse(users);
      console.log(users);
      const newGroupChat = Chat({
        _id: new mongoose.Types.ObjectId(),
        users: users,
        chatName: groupName,
        isGroupChat: true,
        groupAdmin: req.user._id,
      });
      var groupChat = await newGroupChat.save();
      var updatedGroupChat = await Chat.findByIdAndUpdate(
        groupChat._id,
        { $addToSet: { users: req.user._id } },
        { new: true }
      );
      var fullGroupChat = await Chat.findById(groupChat._id)
        .populate("users", "-password")
        .populate({
          path: "latestMsg",
          populate: { path: "sender", model: "user" },
        })
        .populate("groupAdmin", "-password");
      try {
        return res.status(201).json(fullGroupChat);
      } catch (error) {
        return res.status(501).json({ msg: error.message });
      }
    }
  }

  // Fetch Single Chat
  async fetchSingleChat(req, res) {
    const { chatId } = req.params;
    if (!chatId) {
      return res.status(401).json({ msg: "Invalid or empty chat id" });
    } else {
      var singleChat = await Chat.findById(chatId).populate(
        "users",
        "-password"
      );
      try {
        return res.status(200).json(singleChat);
      } catch (error) {
        return res.status(501).json({ msg: error.message });
      }
    }
  }

  async removeUser(req, res) {
    const { id } = req.params;
    const chatId = req.body.chatId;
    if (!id) {
      return res.status(401).json({ msg: "Invalid or empty user id" });
    } else {
      var isChatExist = await Chat.find({
        $and: [{ isGroupChat: true, _id: chatId }],
      });
      console.log(isChatExist);
      if (isChatExist.length === 0) {
        return res.status(401).json({ msg: "no chat exists with this id" });
      } else {
        var deleteMessages = await Message.deleteMany(
          { $and: [{ chat: chatId, sender: id }] },
          { new: true }
        );
        try {
          var removeUser = await Chat.findOneAndUpdate(
            {
              $and: [{ isGroupChat: true, _id: chatId }],
            },
            { $pull: { users: id } },
            { new: true }
          );

          return res.status(200).json({
            msg: "User removed from group. Please reload to make changes",
          });
        } catch (error) {
          return res.status(501).json({ msg: error.message });
        }
      }
    }
  }

  async addUser(req, res) {
    const { users, chatId } = req.body;
    var isChatExists = await Chat.findById(chatId);
    if (!isChatExists) {
      return res.status(401).json({ msg: "Chat does not exists" });
    } else {
      var chat = await Chat.findByIdAndUpdate(
        chatId,
        { $addToSet: { users: JSON.parse(users) } },
        { new: true }
      );

      try {
        return res
          .status(200)
          .json({ msg: "New member added. Please reload to watch changes" });
      } catch (error) {
        return res.status(501).json({ msg: error.message });
      }
    }
  }
}

module.exports = new chatController();
