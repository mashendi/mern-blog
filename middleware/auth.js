const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

function auth(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ errorMessage: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        return res
          .status("401")
          .json({ errorMessage: "You must be logged in" });
      }

      console.log(payload);
      const { user } = payload;
      console.log(user);
      User.findById(user).then((userdata) => {
        req.user = userdata;
        console.log(req.user);
        next();
      });
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ errorMessage: "Unauthorized" });
  }
}

module.exports = auth;
