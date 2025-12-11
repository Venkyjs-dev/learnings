const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json()); //this is the method to convert user json object to js object
app.post("/signup", async (req, res) => {
  //create a new instance of the user model
  console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    res.send("user signup successfully");
  } catch (err) {
    res.status(400).send("Error" + `${err.message}`);
  }
});

//get users

app.get("/users", async (req, res) => {
  let userEmail = req.body.emailId;
  try {
    let users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User Not found");
    } else {
      console.log(users);
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

app.get("/user", async (req, res) => {
  let userName = req.body.firstName;
  try {
    let user = await User.findOne({ firstName: userName });
    if (!user) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

//delete user
app.delete("/user", async (req, res) => {
  let userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

//update user by patch method

app.patch("/user", async (req, res) => {
  let userId = req.body.userId;
  let data = req.body;
  try {
    await User.findByIdAndUpdate(userId, data);
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("something went wrong");
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
