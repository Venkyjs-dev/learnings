// esm-exports.mjs
// All possible ESM export patterns

// 1) Named exports
export const x = 100;
export function greet() {
  return "Hello from greet()";
}

// 2) Export as you declare
export class User {
  constructor(name) {
    this.name = name;
  }
}

// 3) Export list
const a = 10;
const b = 20;
export { a, b };

// 4) Rename export
export { a as alpha };

// 5) Default export (only one per module)
export default function () {
  return "Default export function";
}

// 6) Re-export (example only, commented out)
// export * from "./another.mjs";
// export { something } from "./another.mjs";
