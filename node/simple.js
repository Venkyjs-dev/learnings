// realtime-sample.js
const fs = require("fs");
const https = require("https");

console.log("1 - sync start"); // (V8 call stack) runs immediately

process.nextTick(() => {
  // stored: Node's nextTick queue
  // executes: right after top-level sync finishes, before Promise microtasks
  console.log("2 - nextTick");
});

Promise.resolve().then(() => {
  // stored: V8 microtask queue
  // executes: after nextTick, before returning control to libuv
  console.log("3 - promise.then (microtask)");
});

setTimeout(() => {
  // stored: libuv timers queue
  // executes: in libuv timers phase (a later tick)
  console.log("4 - setTimeout 0 (timers phase)");
}, 0);

setImmediate(() => {
  // stored: libuv check queue
  // executes: in libuv check phase (after poll)
  console.log("5 - setImmediate (check phase)");
});

fs.readFile(__filename, "utf8", () => {
  // stored: libuv threadpool -> then poll/pending queue when done
  // executes: when threadpool finishes and event loop processes it
  console.log("6 - fs.readFile (threadpool -> poll)");
});

https.get("https://example.com", (res) => {
  res.on("data", () => {}); // consume
  res.on("end", () => {
    // stored: libuv poll queue until socket emits 'end'
    // executes: when poll processes the socket event and Node C++ calls into V8
    console.log("7 - https response end (poll)");
  });
});

console.log("8 - sync end"); // (V8 call stack)
