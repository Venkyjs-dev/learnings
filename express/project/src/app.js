const express = require("express");

const app = express();
const { adminAuth, userAuth } = require("./middlerwares/auth");

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res, next) => {
  res.send("getAll data");
});

app.get("/admin/deleteUser", (req, res, next) => {
  res.send("deleted user");
});

app.use("/user/getUser", userAuth);

app.get("/user/getUser", (req, res) => {
  res.send("user found successfully");
});

app.listen(6666, () => {
  console.log("Server started");
});
