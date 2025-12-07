const express = require("express");

const app = express();

// app.METHOD(PATH, HANDLER)

// app.use("/", (req, res) => {
//   res.send("Base route");
// });

app.get("/ex", (req, res) => {
  console.log("hello from ex");
  console.log("res", res);
  res.send("hello from ex");
});

app.listen(7070, () => {
  console.log("Server started on port: 7070....");
});
