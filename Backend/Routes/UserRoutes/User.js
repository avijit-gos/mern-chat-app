/** @format */

const router = require("express").Router();
const {
  register,
  login,
  uploadImage,
  searchUser,
  fetchUser,
} = require("../../Controller/UserController/UserController");
const Authentication = require("../../Middleware/Authentication");

router.post("/register", register);
router.post("/login", login);
router.put("/upload/image", Authentication, uploadImage);
router.get("/search/user", Authentication, searchUser);
router.get("/", Authentication, fetchUser);

module.exports = router;
