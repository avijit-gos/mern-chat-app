/** @format */

const router = require("express").Router();
const {
  createChat,
  fetchChats,
  createGroupChat,
  fetchSingleChat,
  removeUser,
  addUser,
} = require("../../Controller/ChatController/ChatController");
const Auth = require("../../Middleware/Authentication");

// create new chat
router.post("/create", Auth, createChat);

// Fetch all chats for that particular user
router.get("/", Auth, fetchChats);

// creation of group
router.post("/create/group", Auth, createGroupChat);

// Fetch single chat
router.get("/:chatId", Auth, fetchSingleChat);

// Renaming the group

// add new user to group
router.put("/add/user", Auth, addUser);

// remove user from group
router.put("/remove/user/:id", Auth, removeUser);

module.exports = router;
