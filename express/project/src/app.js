const express = require("express");

const app = express();
const { adminAuth, userAuth } = require("./middlerwares/auth");

// app.use("/admin", adminAuth);

// app.get("/admin/getAllData", (req, res, next) => {
//   res.send("getAll data");
// });

// app.get("/admin/deleteUser", (req, res, next) => {
//   res.send("deleted user");
// });

app.use("/user", userAuth);

app.get("/user/getUser", (req, res) => {
  try {
    res.send("user found successfully");
  } catch (err) {
    res.status(404).send("somethign wrong");
  }
});

app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    res.status(400).send("Something went Wrong");
  }
});
app.listen(6666, () => {
  console.log("Server started");
});
