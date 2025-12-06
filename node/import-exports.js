// ESM
// named exports:

export const a = 10;
export function sum() {
  return a + b;
}
// ESM: named imports
// import {a,sum} from 'file_path'
// import { a as a1, sum as sum1 } from "file_path";

// default exports

export default function greet() {
  return "hellow";
}

// ESM: defalt imports
// import greet from 'file_path'
// import greet as myGreet from 'file_path'

// CJS

// named exports

const b = 20;
const sub = (a, b) => {
  return a - b;
};

module.exports = {
  b,
  sub,
};

// CJS: named import
// const cjsObj = require("file_path") // way1
// const {b,sub} = require("file_path") // way2

// default exports

module.exports = function greet2() {
  return "Hello";
};

// CJS: default imports
// const greet2 = require("file_path")
