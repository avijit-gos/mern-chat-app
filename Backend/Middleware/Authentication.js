/** @format */

const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({ msg: "Invalid token" });
  } else {
    var verify = await jwt.verify(token, process.env.SECRET_KEY);

    try {
      req.user = verify;
      // console.log(req.user);
      next();
    } catch (error) {
      return res.status(401).json({ msg: error.message });
      next();
    }
  }
};
