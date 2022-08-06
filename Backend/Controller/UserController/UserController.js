/** @format */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../../Model/UserModel/UserModel");
const {
  generate_hash_password,
  compare_password,
  generate_token,
} = require("../../Helper/Helper");
const apiip = require("apiip.net")(process.env.APIP_KEY);
var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

class UserController {
  constructor() {
    console.log("UserController running");
  }

  async register(req, res) {
    const { name, email, username, password } = req.body;
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      return res
        .status(401)
        .json({ msg: "All the fields are required to register" });
    } else {
      var user = await User.find({
        $or: [{ email: email }, { username: username }],
      });
      if (user.length > 0) {
        return res
          .status(401)
          .json({ msg: "Username or Email has alredy been taken" });
      } else {
        var hash = await generate_hash_password(password);
        if (!hash) {
          return res.status(501).json({ msg: "Password generation error" });
        } else {
          var location = await apiip.getLocation();
          if (!location) {
            return res.status(501).json({ msg: "Opps! something went wrong" });
          } else {
            var newUser = User({
              _id: new mongoose.Types.ObjectId(),
              name,
              email,
              username,
              password: hash,
              ip: location.ip,
            });
            newUser = await newUser.save();
            try {
              return res
                .status(201)
                .json({ msg: "User registration successfull", newUser });
            } catch (error) {
              return res.status(501).json({ msg: error.message });
            }
          }
        }
      }
    }
  }

  async login(req, res) {
    const { logUser, password } = req.body;
    if (!logUser.trim() || !password.trim()) {
      return res
        .status(401)
        .json({ msg: "Every fields are require for login" });
    } else {
      var user = await User.findOne({
        $or: [{ email: logUser }, { username: logUser }],
      });
      if (!user) {
        return res
          .status(401)
          .json({ msg: "Username or Email does not exists" });
      } else {
        var result = await compare_password(password, user);
        if (!result) {
          return res.status(401).json({ msg: "Invalid crediential" });
        } else {
          const token = await generate_token(user);
          if (!token) {
            return res
              .status(501)
              .json({ msg: "Something went wrong in token generation" });
          } else {
            return res
              .status(200)
              .json({ msg: "Login successfull", user, token });
          }
        }
      }
    }
  }

  async uploadImage(req, res) {
    const file = req.files.image;
    if (!req.user) {
      return res.status(401).json({ msg: "Authentication error" });
    } else {
      cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
        if (err) {
          return res.status(401).json({ msg: "Could not upload your image" });
        } else {
          var user = await User.findByIdAndUpdate(
            req.user._id,
            { profile_img: result.url },
            { new: true }
          );
          try {
            var token = await generate_token(user);
            if (token) {
              return res
                .status(200)
                .json({ msg: "Image uploaded", user, token });
            }
          } catch (error) {
            return res.status(501).json({ msg: error.message });
          }
        }
      });
    }
  }

  async searchUser(req, res) {
    var search = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { username: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    if (search) {
      var users = await User.find(search).find({ _id: { $ne: req.user._id } });
    } else {
      return res.status(501).json({ msg: "Invalid format" });
    }
    try {
      return res.status(200).json(users);
    } catch (error) {
      return res.status(501).json({ msg: error.message });
    }
  }

  async fetchUser(req, res) {
    if (!req.user) {
      return res.status(401).json({ msg: "Invalid token" });
    } else {
      var user = await User.findById(req.user._id);
      try {
        return res.status(200).json(user);
      } catch (error) {
        return res.status(501).json({ msg: error.message });
      }
    }
  }
}

module.exports = new UserController();
