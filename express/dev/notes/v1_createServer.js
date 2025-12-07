// Import the express library
const express = require("express");

// Create an express application
const app = express();

// This handles requests coming to "/test"
app.use("/test", (req, res) => {
  // Sends response to the browser
  res.send("Hello from server!");
});

app.use("/hello", (req, res) => {
  res.send("from hello route");
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server is successfully listening on port: 3000.....");
});
