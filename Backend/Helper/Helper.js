/** @format */

require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class Helper {
  constructor() {
    console.log("Helper running");
  }

  async generate_hash_password(password) {
    if (!password.trim()) {
      return false;
    } else {
      var hash = await bcrypt.hash(password, 10);
      return hash;
    }
  }

  async compare_password(password, user) {
    if (!password.trim() || !user) {
      return false;
    } else {
      var result = await bcrypt.compare(password, user.password);
      return result;
    }
  }

  async generate_token(user) {
    if (!user) {
      return false;
    } else {
      var token = await jwt.sign(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
        },
        process.env.SECRET_KEY,
        { expiresIn: "2d" }
      );
      return token;
    }
  }
}

module.exports = new Helper();
