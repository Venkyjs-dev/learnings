const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlerwares/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    console.log(req.user);
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = profileRouter;
