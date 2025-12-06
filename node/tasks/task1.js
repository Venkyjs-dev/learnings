// harder-eventloop.js
// Only uses: fs, setImmediate, setTimeout, Promise, process.nextTick, console.log
// Drop a small file.txt beside this file so fs.readFile finishes quickly.

const fs = require("fs");

// ---------- Top-level sync
console.log("A: sync start");

// ---------- schedule outer primitives
setImmediate(() => console.log("B: outer setImmediate")); // libuv check queue
setTimeout(() => console.log("C: outer timer 0"), 0); // libuv timers queue

Promise.resolve().then(() => console.log("D: top-level promise then")); // V8 microtask

fs.readFile("./file.txt", "utf8", () => {
  // stored: libuv threadpool -> poll/pending
  console.log("E: fs1 callback start");

  // schedule a nextTick and a Promise inside fs callback
  process.nextTick(() => console.log("F: nextTick inside fs1")); // Node nextTick queue (executes before microtasks after this callback)
  Promise.resolve().then(() => console.log("G: promise inside fs1")); // V8 microtask (runs after nextTick)

  // schedule timers and immediates inside fs callback
  setTimeout(() => console.log("H: timer inside fs1 (0)"), 0); // timers phase next tick
  setImmediate(() => console.log("I: setImmediate inside fs1")); // check phase - usually after poll

  // nested fs
  fs.readFile("./file.txt", "utf8", () => {
    console.log("J: nested fs2 inside fs1 callback");
    process.nextTick(() => console.log("K: nextTick inside nested fs2"));
  });

  console.log("L: fs1 callback end");
});

// ---------- more nextTick & Promise interleavings
process.nextTick(() => {
  console.log("M: top-level nextTick 1");

  // nested nextTicks and promises
  process.nextTick(() => console.log("N: nested nextTick A"));
  Promise.resolve().then(() =>
    console.log("O: promise created inside nextTick 1")
  );
  process.nextTick(() => {
    console.log("P: nested nextTick B");
    // schedule setImmediate from nested nextTick
    setImmediate(() =>
      console.log("Q: setImmediate scheduled from nested nextTick")
    );
  });

  // schedule a timer inside nextTick
  setTimeout(() => console.log("R: timer scheduled inside nextTick"), 0);
});

// another top-level nextTick to test ordering
process.nextTick(() => console.log("S: top-level nextTick 2"));

// Promise chain with downstream scheduling
Promise.resolve()
  .then(() => {
    console.log("T: promise chain - step 1");
    // schedule timer and setImmediate in a promise microtask
    setTimeout(() => console.log("U: timer from promise microtask"), 0);
    setImmediate(() => console.log("V: setImmediate from promise microtask"));
    // schedule a nextTick from promise microtask (runs after current microtask finishes)
    process.nextTick(() =>
      console.log("W: nextTick scheduled from promise microtask")
    );
    return "X";
  })
  .then((val) => {
    console.log("Y: promise chain - step 2", val); // another microtask
  });

// schedule another fs read to add concurrency
fs.readFile("./file.txt", "utf8", () => {
  console.log("Z: fs3 callback (independent)");
  // inside this fs callback schedule nested Promise and nextTick
  Promise.resolve().then(() => console.log("AA: promise inside fs3"));
  process.nextTick(() => console.log("AB: nextTick inside fs3"));
});

// final sync log
console.log("AC: sync end");
