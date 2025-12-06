// flow-demo.js
console.log("start"); // main: thread
const https = require("https");
console.log("middle"); // main thread
const fs = require("fs");

console.log("script start");

process.nextTick(() => console.log("nextTick")); // lib

setTimeout(() => console.log("setTimeout 0"), 0); // lib

setImmediate(() => console.log("setImmediate")); // lib

Promise.resolve().then(() => console.log("promise")); // lib

https.get("https://example.com", (res) => {
  // lib
  // consume response to trigger 'end'
  res.on("data", () => {});
  res.on("end", () => console.log("http response end"));
});

fs.readFile(__filename, () => {
  // lib
  console.log("fs readFile");
});

// Blocking CPU work (synchronous)
for (let i = 0; i < 1e7; i++) {} // heavy sync work // 10 sec

process.nextTick(() => console.log("nextTick2")); // lib

console.log("script end"); // v8
