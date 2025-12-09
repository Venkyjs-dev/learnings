const express = require("express");

const app = express();

app.use("/about", (req, res) => {
  console.log(
    "base route with use it can work all methods like get,post,put,patch,delete by handling / route with anyware"
  );
  res.send("base route");
});

app.get("/admin/getAllData", (req, res, next) => {
  let token = "xyzer";
  let isAuthorized = token === "xyz";
  if (isAuthorized) {
    res.send("getAll data");
  } else {
    res.status(401).send("Unauthorized user");
  }
});

app.get("/admin/deleteUser", (req, res, next) => {
  let token = "xyzer";
  let isAuthorized = token === "xyz";
  if (isAuthorized) {
    res.send("getAll data");
  } else {
    res.status(401).send("Unauthorized user");
  }
});

//multi combo handlers app.get('/',callback1,[callback2,callback3],callback4)

app.get(
  "/user",
  [
    (req, res, next) => {
      console.log("first handler");
      next();
    },
    (req, res, next) => {
      console.log("second handler");
      next();
    },
  ],
  (req, res) => {
    res.send(
      "user found and the above first handler, second handlers are called middlewares"
    );
  }
);

app.listen(6666, () => {
  console.log("Server started");
});
