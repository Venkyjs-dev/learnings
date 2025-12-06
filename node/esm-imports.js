// esm-imports.mjs
// All common ESM import patterns

// 1) Import default + named
import def, { x, greet, User, a, b, alpha } from "./esm-exports.mjs";

console.log(def());
console.log(x, a, b, alpha);
console.log(greet());
console.log(new User("venk").name);

// 2) Import everything as namespace
import * as all from "./esm-exports.mjs";
console.log(all.x, all.default());

// 3) Import only default
import defaultOnly from "./esm-exports.mjs";
console.log(defaultOnly());

// 4) Import only named
import { greet as sayHello } from "./esm-exports.mjs";
console.log(sayHello());

// 5) Dynamic import
const dynamicMod = await import("./esm-exports.mjs");
console.log(dynamicMod.default());
