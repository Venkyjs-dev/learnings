const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlerwares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    let user = req.user;
    res.send(user.firstName + " sent connection request");
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

module.exports = requestRouter;
