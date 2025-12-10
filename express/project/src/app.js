const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  //create a new instance of the user model
  const user = new User({
    firstName: "Preethi",
    lastName: "G",
    emailId: "preethi@gamil.com",
    password: "preethi@123",
  });
  try {
    await user.save();
    res.send("user signup successfully");
  } catch (err) {
    res.status(400).send("Error" + `${err.message}`);
  }
});

connectDB()
  .then(() => {
    console.log("database connection established");
    app.listen(6666, () => {
      console.log("Server started");
    });
  })
  .catch((err) => {
    console.log("database not connected");
  });
