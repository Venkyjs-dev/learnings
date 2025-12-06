// cjs-imports.js
// All possible CommonJS import patterns

// Import the main export (function or object)
const mod = require("./cjs-exports.js");

console.log(mod()); // call the main exported function
console.log(mod.info); // property on main export
console.log(mod.sum(2, 3)); // method on main export

// Use named properties (if they exist)
const User = mod.User;
const u = new User("venk");
console.log(u.name);

// Import dynamically
const dynamic = require("./cjs-exports.js");
console.log(dynamic.info);

// Destructuring (works only for exported objects/functions with properties)
const { sum } = require("./cjs-exports.js");
console.log(sum(5, 5));
