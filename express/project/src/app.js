const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validation } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParse = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json()); //this is the method to convert user json object to js object
app.use(cookieParse());
app.post("/signup", async (req, res) => {
  try {
    validation(req);
    const { firstName, lastName, emailId, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);
    //create a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });
    await user.save();
    res.send("user signup successfully");
  } catch (err) {
    res.status(400).send("Error: " + `${err.message}`);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, "PROJECT@devTinder");
      res.cookie("token", token);
      res.send("Login Successfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    const decodeMessage = await jwt.verify(token, "PROJECT@devTinder");
    const { _id } = decodeMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user does not exist");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
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

// app.patch("/user", async (req, res) => {
//   // let userId = req.params?.userId;
//   let userId = req.body.userId;
//   let data = req.body;
//   console.log(data);

//   try {
//     let updateAllowed = ["photoUrl", "age", "skills", "gender", "about"];

//     let isUpdateAllowed = Object.keys(data).every((k) =>
//       updateAllowed.includes(k)
//     );
//     if (!isUpdateAllowed) {
//       throw new Error("update not allowed");
//     }
//     if (data?.skills.length > 10) {
//       throw new Error("Skill cannot be more than 10");
//     }
//     const user = await User.findByIdAndUpdate(userId, data);
//     console.log(user);
//     res.send("user updated successfully");
//   } catch (err) {
//     res.status(400).send("something went wrong");
//   }
// });

app.patch("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const data = req.body;

    const allowedUpdates = ["photoUrl", "age", "skills", "gender", "about"];

    const updateKeys = Object.keys(data).filter((key) => key !== "userId");

    const isValidUpdate = updateKeys.every((key) =>
      allowedUpdates.includes(key)
    );

    if (!isValidUpdate) {
      return res.status(400).send("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot more than 10");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });

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
