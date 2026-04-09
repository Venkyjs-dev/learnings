const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    let cookies = req.cookies;
    let { token } = cookies;

    if (!token) {
      throw new Error("Invalid token !!!");
    }
    let decodedObj = await jwt.verify(token, "PROJECT@devTinder");
    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    // console.log(user);
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = {
  userAuth,
};
