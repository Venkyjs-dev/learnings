const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParse = require("cookie-parser");

app.use(express.json()); //this is the method to convert user json object to js object
app.use(cookieParse());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
