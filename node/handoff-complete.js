// handoff-complete.js
// Run: node handoff-complete.js
// NOTE: network (https) will do a real request; if offline, that callback will happen later.

const fs = require("fs");
const https = require("https");
const crypto = require("crypto");
const { Worker, isMainThread, parentPort } = require("worker_threads");
const dns = require("dns");

if (!isMainThread) {
  // Worker thread: do CPU job and post message back
  const start = Date.now();
  // simulate CPU work
  let s = 0;
  for (let i = 0; i < 5e7; i++) s += i;
  parentPort.postMessage({ from: "worker", time: Date.now() - start });
  // NOTE: worker thread runs in a separate V8 instance and posts messages
  // which are delivered to main thread via libuv async handles.
  return;
}

// 1) Synchronous immediate execution (V8 call stack)
console.log("A: sync start"); // runs immediately on V8 call stack

// 2) process.nextTick - stored in Node's nextTick queue (Node/V8 integration).
//    nextTick runs BEFORE V8 microtasks (Promises), and BEFORE returning to the event loop.
process.nextTick(() => {
  // stored: V8/Node nextTick queue
  // executes: immediately after current synchronous JS completes (before Promises)
  console.log("B: process.nextTick executed (nextTick queue)");
});

// 3) Promise microtask - stored in V8 microtask queue (Promise jobs)
//    runs after nextTick and before returning to libuv event loop.
Promise.resolve().then(() => {
  // stored: V8 microtask queue
  // executes: after nextTick callbacks, before libuv macrotasks (timers/I/O)
  console.log("C: promise.then executed (V8 microtask queue)");
});

// 4) setTimeout (timers queue in libuv) - executed in libuv timers phase
setTimeout(() => {
  // stored: libuv timers queue (timers phase)
  // executes: when event loop reaches timers phase and timer has expired
  console.log("D: setTimeout 0 (libuv timers queue)");
}, 0);

// 5) setImmediate (libuv check queue) - executed in libuv check phase (after poll)
setImmediate(() => {
  // stored: libuv check (setImmediate) queue
  // executes: in check phase, typically after poll phase
  console.log("E: setImmediate (libuv check queue)");
});

// 6) fs.readFile (libuv threadpool) - offloaded to threadpool workers
fs.readFile(__filename, "utf8", (err, data) => {
  // stored: libuv poll/pending queue once threadpool worker finishes
  // executes: in poll/pending phase via Node C++ -> MakeCallback -> V8 call stack
  console.log("F: fs.readFile callback (libuv threadpool -> poll queue)");
});

// 7) crypto.pbkdf2 (libuv threadpool) - CPU-like work offloaded to threadpool
crypto.pbkdf2("password", "salt", 100000, 16, "sha512", (err, derivedKey) => {
  // stored: libuv threadpool -> queued to poll phase when done
  // executes: via Node C++ MakeCallback -> V8
  console.log("G: crypto.pbkdf2 callback (threadpool -> poll queue)");
});

// 8) dns.lookup (may use OS getaddrinfo on threadpool) - can ride threadpool
dns.lookup("example.com", (err, address) => {
  // stored: threadpool (if using blocking getaddrinfo) or c-ares -> queued to poll
  // executes: via Node C++ -> V8 when ready
  console.log("H: dns.lookup callback (threadpool/c-ares -> poll)");
});

// 9) https.get - non-blocking socket (OS + libuv poll)
//    The response 'end' listener will be queued when socket data/end events are polled.
https.get("https://example.com", (res) => {
  res.on("data", () => {
    /* consume */
  });
  res.on("end", () => {
    // stored: libuv poll queue until data/end happen
    // executes: Node C++ -> V8 when the socket signals end
    console.log("I: https response end (libuv poll queue)");
  });
});

// 10) Worker thread example (worker_threads) - separate V8, posts message back
const worker = new Worker(__filename);
worker.on("message", (msg) => {
  // stored: libuv async handle queue / message queue for worker messages
  // executes: via Node C++ -> V8 when libuv dispatches worker message
  console.log("J: worker message received:", msg);
});

// 11) small synchronous CPU block - blocks V8 call stack & prevents event loop delivery
//    Use this to show blocking behaviour: comment/uncomment to test.
const doBlocking = false;
if (doBlocking) {
  console.log("K: starting blocking sync work (this blocks V8 call stack)");
  for (let i = 0; i < 1e8; i++) {} // heavy sync work - blocks everything
  console.log("K: finished blocking sync work");
}

console.log("Z: sync end"); // last synchronous line on top-level

// Expected rough output order (may vary due to race of network/threadpool timing):
//  A: sync start
//  Z: sync end
//  B: process.nextTick executed (nextTick queue)
//  C: promise.then executed (V8 microtask queue)
//  D: setTimeout 0 (libuv timers queue)
//  E: setImmediate (libuv check queue)
//  F: fs.readFile callback (threadpool -> poll queue)
//  G: crypto.pbkdf2 callback (threadpool -> poll queue)
//  H: dns.lookup callback (threadpool or c-ares -> poll)
//  I: https response end (libuv poll queue)
//  J: worker message received: { from: 'worker', time: ... }
