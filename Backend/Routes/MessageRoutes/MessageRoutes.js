/** @format */

const router = require("express").Router();
const Auth = require("../../Middleware/Authentication");
const {
  createMessage,
  fetchMessages,
} = require("../../Controller/MessageController/MessageController");

// Create one to one or group chat
router.post("/", Auth, createMessage);

// Fetch all the messages related to the chat
router.get("/:chatId", Auth, fetchMessages);

module.exports = router;
