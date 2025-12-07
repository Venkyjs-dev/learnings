//The following code is an example of a very basic route.

const express = require("express");
const app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get("/", (req, res) => {
  res.send("hello world");
});

// ROUTE METHODS

// app.METHOD(PATH, HANDLER)

app.use();
app.get();
app.post();
app.put();
app.delete();
app.all();

// ROUTE PATH:
/*
1. Route paths can be strings, string patterns, or regular expressions.
*/

// Route paths based on strings
app.get("/about", (req, res) => {
  res.send("Hello world form get method");
});

app.get("/random.text", (req, res) => {
  res.send("Hello world form get method and random.text");
});

// regular expressions

// This route path will match anything with an “a” in it.
app.get(/a/, (req, res) => {
  res.send("/a/");
});

// This route path will match butterfly and dragonfly, but not butterflyman, dragonflyman, and so on.
app.get(/.*fly$/, (req, res) => {
  res.send("/.*fly$/");
});

// Route parameters

/*
Route path: /users/:userId/books/:bookId
Request URL: http://localhost:3000/users/34/books/8989
req.params: { "userId": "34", "bookId": "8989" }
*/
app.get("/users/:userId/books/:bookId", (req, res) => {
  res.send(req.params);
});

// Route Query params

/*
Route path: /test
Request URL: http://localhost:3000/test?name=venky&id=23&city=mumbai
req.query: { name: 'venky', id: '23', city: 'mumbai' }
*/

app.get("/test", (req, res) => {
  console.log("req", req.query);
  res.send("test route");
});

// Route handlers

// passing callbacks direclty
app.get(
  "/example/a", // path

  (req, res, next) => {
    // first handler
    console.log("First handler");
    const name = "venky";
    const sum = (a, b) => {
      return a + b;
    };

    req.name = name;
    req.sum = sum;

    next();
  },
  (req, res, next) => {
    // handler
    console.log("Second handler");
    const result = req.sum(5, 5);
    req.result = result;
    next();
  },
  (req, res) => {
    res.send(`third handler1: result: ${req.result}`);
  }
);

// passing array of callbacks or handlers
const cb0 = function (req, res, next) {
  console.log("CB0");
  next();
};

const cb1 = function (req, res, next) {
  console.log("CB1");
  next();
};

const cb2 = function (req, res) {
  res.send("Hello from C!");
};

app.get("/example/c", [cb0, cb1, cb2]);

// A combination of independent functions and arrays of functions can handle a route.

const cbt0 = function (req, res, next) {
  console.log("cbt0");
  next();
};

const cbt1 = function (req, res, next) {
  console.log("cbt1");
  next();
};

app.get(
  "/example/d",
  [cbt0, cbt1],
  (req, res, next) => {
    console.log("the response will be sent by the next function ...");
    next();
  },
  (req, res) => {
    res.send("Hello from D!");
  }
);

// Response methods

/*
Method	            Description
res.download()	    Prompt a file to be downloaded.
res.end()	        End the response process.
res.json()	        Send a JSON response.
res.jsonp()	        Send a JSON response with JSONP support.
res.redirect()	    Redirect a request.
res.render()	    Render a view template.
res.send()	        Send a response of various types.
res.sendFile()	    Send a file as an octet stream.
res.sendStatus()	Set the response status code and send its string representation as the response body.

*/
