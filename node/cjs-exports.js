// cjs-exports.js
// All possible CommonJS export patterns

// 1) Add properties to exports
exports.a = 10;
exports.sayHello = function () {
  return "Hello from exports.a";
};

// 2) Assign module.exports to an object
module.exports.b = 20;

// 3) Replace entire module.exports with a function
module.exports = function mainFunction() {
  return "I am the main exported function";
};

// 4) Add properties to the function export
module.exports.info = "Extra data";
module.exports.sum = (x, y) => x + y;

// 5) Export a class
class User {
  constructor(name) {
    this.name = name;
  }
}
module.exports.User = User;

// Final shape of exports = the function + attached properties
