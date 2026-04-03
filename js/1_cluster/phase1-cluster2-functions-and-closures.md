# Phase 1 — Cluster 2: Functions and Closures
> Interview Revision Notes — JavaScript Deep Dive

---

## Table of Contents
1. [First Class Functions](#1-first-class-functions)
2. [Closures — How They Form](#2-closures--how-they-form)
3. [Stale Closure Problem](#3-stale-closure-problem)
4. [this Binding — call, apply, bind](#4-this-binding--call-apply-bind)
5. [Arrow Functions and this](#5-arrow-functions-and-this)
6. [Pure Functions and Side Effects](#6-pure-functions-and-side-effects)
7. [Interview Definitions — Say These Out Loud](#7-interview-definitions--say-these-out-loud)

---

## 1. First Class Functions

### Why it exists

In some languages, functions are special — they live separately from data and can only be called. JavaScript treats functions as **values**, exactly like strings, numbers, or objects. This is what "first class" means.

> **A function is first class when it can be stored in a variable, passed as an argument, and returned from another function.**

This one decision is what makes patterns like callbacks, closures, higher-order functions, and React hooks possible.

### How it works

**Store in a variable:**
```js
const greet = function (name) {
  return "Hello " + name;
};

greet("Ram"); // Hello Ram
```

**Pass as an argument:**
```js
function runTwice(fn) {
  fn();
  fn();
}

runTwice(function () {
  console.log("Running");
});
// Running
// Running
```

**Return from another function:**
```js
function multiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

const double = multiplier(2);
const triple = multiplier(3);

double(5); // 10
triple(5); // 15
```

### Where you use this every day

```js
// Array methods — passing functions as arguments
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2); // [2, 4, 6, 8, 10]

// Event handlers — storing functions as values
button.addEventListener("click", handleClick);

// React — components are functions passed around as values
const App = () => <div>Hello</div>;
ReactDOM.render(<App />, root);

// Custom hooks — functions returning functions
function useDebounce(fn, delay) {
  return function (...args) {
    setTimeout(() => fn(...args), delay);
  };
}
```

### Corner cases

**Functions have properties — they are objects:**
```js
function greet() {}
greet.language = "English"; // valid — functions are objects
console.log(greet.language); // "English"
console.log(typeof greet);   // "function" (not "object", but still object under the hood)
```

**Function declaration vs expression — hoisting difference:**
```js
// Declaration — hoisted, can call before definition
sayHi(); // works ✅
function sayHi() { console.log("Hi"); }

// Expression — not hoisted, cannot call before definition
sayHello(); // TypeError ❌
const sayHello = function () { console.log("Hello"); };
```

---

## 2. Closures — How They Form

### Why it exists

When a function finishes running, its local variables are normally destroyed. But sometimes an inner function needs to keep accessing those variables even after the outer function is gone.

Closures solve this — they let a function **remember** the variables from the scope where it was created.

> **A closure is a function that retains access to its outer scope's variables even after the outer function has finished executing.**

### How closures form

Three things must happen:
1. An outer function defines a variable
2. An inner function references that variable
3. The inner function is returned or passed somewhere outside

```js
function outer() {
  const name = "Ram"; // step 1 — outer variable

  function inner() {
    console.log(name); // step 2 — inner references it
  }

  return inner; // step 3 — inner escapes
}

const fn = outer(); // outer() is done, but name is NOT destroyed
fn(); // "Ram" — inner still has access via closure
```

### The mental model

Think of a closure as a **backpack**. When a function is created inside another function, it packs up all the variables it needs from its surrounding scope and carries them wherever it goes.

Even when the outer function is gone — the backpack stays with the inner function.

### Practical examples

**Counter — private state:**
```js
function createCounter() {
  let count = 0; // private — cannot be accessed directly from outside

  return {
    increment: function () { count++; },
    decrement: function () { count--; },
    value: function () { return count; }
  };
}

const counter = createCounter();
counter.increment();
counter.increment();
counter.value(); // 2

console.log(count); // ReferenceError — count is private
```

**Function factory:**
```js
function makeGreeter(greeting) {
  return function (name) {
    return greeting + ", " + name + "!";
  };
}

const sayHello = makeGreeter("Hello");
const sayHey   = makeGreeter("Hey");

sayHello("Ram"); // Hello, Ram!
sayHey("Raj");   // Hey, Raj!
```

**In React — every custom hook uses closures:**
```js
function useLocalStorage(key) {
  const [value, setValue] = useState(() => {
    return localStorage.getItem(key); // closes over key
  });

  const setItem = (newValue) => {
    localStorage.setItem(key, newValue); // closes over key
    setValue(newValue);
  };

  return [value, setItem];
}
```

`setItem` closes over `key` from the outer function. Even after `useLocalStorage` returns, `setItem` remembers which key it belongs to.

### Corner cases

**All closures share the same variable reference — not a copy:**
```js
function makeAdders() {
  const adders = [];

  for (var i = 0; i < 3; i++) {
    adders.push(function () {
      return i; // closes over i — but var is function-scoped
    });
  }

  return adders;
}

const adders = makeAdders();
adders[0](); // 3 ❌ — not 0
adders[1](); // 3 ❌ — not 1
adders[2](); // 3 ❌ — not 2
// by the time any adder runs, the loop is done and i = 3
```

**Fix — use `let` (block scoped, new binding per iteration):**
```js
for (let i = 0; i < 3; i++) {
  adders.push(function () { return i; });
}
adders[0](); // 0 ✅
adders[1](); // 1 ✅
adders[2](); // 2 ✅
```

---

## 3. Stale Closure Problem

### Why it exists

Closures remember a **reference** to a variable — not its value at the time the closure was created. When that variable changes later, the closure sees the old value if it captured it at the wrong time.

> **A stale closure is when a function closes over a variable but keeps reading an outdated version of it — because the variable has changed since the closure was created but the closure hasn't updated its reference.**

### How it happens

```js
function makeTimer() {
  let count = 0;

  setInterval(function () {
    console.log(count); // always 0 ❌ if count is reassigned elsewhere
  }, 1000);

  count = 10; // count changes after closure was created
}
```

### The React version — the real production bug

```js
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1); // ❌ stale — count is always 0
    }, 1000);

    return () => clearInterval(interval);
  }, []); // empty deps — effect runs once, closes over count = 0 forever
}
```

**What happens:** The effect runs once. `count` is `0` at that moment. The interval closes over that `0`. Every second it sets count to `0 + 1 = 1`. It never goes higher. `count` is stale.

**Fix 1 — functional update (best for this case):**
```js
setCount(prev => prev + 1); // no closure over count — uses latest value always ✅
```

**Fix 2 — add count to dependency array:**
```js
useEffect(() => {
  const interval = setInterval(() => {
    setCount(count + 1); // ✅ count is fresh — effect re-runs when count changes
  }, 1000);

  return () => clearInterval(interval);
}, [count]); // re-runs every time count changes
```

**Fix 3 — useRef to always hold latest value:**
```js
const countRef = useRef(count);
countRef.current = count; // always updated

useEffect(() => {
  const interval = setInterval(() => {
    setCount(countRef.current + 1); // reads from ref, always fresh ✅
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

### Other common stale closure locations

```js
// ❌ Event listener closes over stale state
function SearchBar() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log(query); // stale if query changes after this effect ran
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); // missing query in deps
}

// ✅ Fix — add query to deps, or use ref
```

### How to spot stale closures

- A value inside `useEffect`, `setInterval`, or an event handler seems frozen or never updates
- ESLint `react-hooks/exhaustive-deps` rule warns about missing dependencies
- You added something to state but the function still reads the old value

### One line summary

> A stale closure happens when a function captures a variable at one point in time, but by the time it runs, that variable has changed — and the function doesn't know.

---

## 4. this Binding — call, apply, bind

### Why `this` exists

Without `this`, every method on an object would need the object passed in manually:

```js
// Without this — repetitive and fragile
function printBalance(account) {
  console.log(account.owner + " has " + account.balance);
}
```

`this` is JavaScript's shortcut — instead of passing the object explicitly, the function can refer to **"whoever called me"**.

```js
const account = {
  owner: "Ram",
  balance: 5000,
  printBalance: function () {
    console.log(this.owner + " has " + this.balance);
  }
};

account.printBalance(); // Ram has 5000
```

### The core mental model

> **`this` is not decided when the function is written. It is decided when the function is called.**

The question is never *"what object does this function live in?"*
The question is always **"who is calling this function right now?"**

**The golden rule:** `this` = the object to the left of the dot at call time.

### The 4 rules of `this`

| Priority | Rule | How |
|---|---|---|
| 1 | **new binding** | `new MyFn()` → `this` = new object |
| 2 | **Explicit binding** | `call`, `apply`, `bind` → `this` = what you pass |
| 3 | **Implicit binding** | `obj.fn()` → `this` = `obj` |
| 4 | **Default binding** | `fn()` → `this` = `window` or `undefined` in strict mode |

### Implicit binding and how it breaks

```js
const user = {
  name: "Ram",
  greet: function () { console.log(this.name); }
};

user.greet(); // "Ram" ✅ — user is to the left of the dot

const fn = user.greet;
fn(); // undefined ❌ — no object to the left, this = window
```

The function didn't change. The **call site** changed.

### Default binding + strict mode

```js
// Without strict mode — silent global pollution
function createUser() {
  this.name = "Ram"; // accidentally writes to window
}
createUser();
console.log(window.name); // "Ram" — no error, no warning

// With strict mode — fails immediately at the source
"use strict";
function createUser() {
  this.name = "Ram"; // TypeError: Cannot set properties of undefined
}
```

> Strict mode makes `this` honestly `undefined` instead of silently pretending it's the global object. React is already in strict mode.

### Explicit binding — call, apply, bind

**`call` — borrow and run immediately:**
```js
const account = {
  owner: "Ram",
  balance: 5000,
  printBalance: function (currency, tax) {
    console.log(this.owner + " — " + currency + (this.balance - tax));
  }
};

const account2 = { owner: "Raj", balance: 3000 };

account.printBalance.call(account2, "₹", 200); // Raj — ₹2800
```

**`apply` — same as call, arguments as array:**
```js
account.printBalance.apply(account2, ["₹", 200]); // Raj — ₹2800

// Classic use case (legacy):
Math.max.apply(null, [5, 2, 8]); // 8
// Modern equivalent:
Math.max(...[5, 2, 8]); // 8
```

**`bind` — lock this, return new function:**
```js
const rajPrint = account.printBalance.bind(account2, "₹", 200);
rajPrint(); // Raj — ₹2800 — this permanently locked to account2
```

**bind is permanent — cannot be overridden:**
```js
const bound = greet.bind({ name: "Ram" });
bound.call({ name: "Raj" }); // "Ram" — bind wins, call cannot override
```

### Comparison table

| Method | Runs immediately? | Arguments | Returns |
|---|---|---|---|
| `call` | Yes | Comma separated | Result |
| `apply` | Yes | Array | Result |
| `bind` | No | Comma separated | New function |

### Full example

```js
const user = {
  name: "Ram",
  greet: function (platform, time) {
    console.log("Hello " + this.name + " on " + platform + " at " + time);
  }
};

const anotherUser = { name: "Raj" };

user.greet.call(anotherUser, "LinkedIn", 10);
user.greet.apply(anotherUser, ["Swiggy", 30]);
const fn = user.greet.bind(anotherUser, "Blinkit", 10);
fn();
```

---

## 5. Arrow Functions and this

### The one line that explains everything

> **Arrow functions don't have their own `this`. They inherit it from the nearest enclosing regular function's scope.**

- Regular function → `this` depends on **who calls it** (call time)
- Arrow function → `this` depends on **where it was written** (write time / lexical scope)

### The problem arrow functions solve

```js
const timer = {
  name: "Ram",
  start: function () {
    setTimeout(function () {
      console.log("Hello " + this.name); // undefined ❌
    }, 1000);
  }
};
```

`setTimeout` calls the inner function — not `timer`. So `this` = `window`. `window.name` is `undefined`.

**Old fix — save `this` manually:**
```js
start: function () {
  const self = this; // self = timer, captured via closure
  setTimeout(function () {
    console.log("Hello " + self.name); // works ✅
  }, 1000);
}
// You'll see self / that / _this in old codebases — all the same pattern
```

**Modern fix — arrow function:**
```js
start: function () {
  setTimeout(() => {
    console.log("Hello " + this.name); // Ram ✅
  }, 1000);
}
```

Arrow function has no own `this`. Looks outward to `start`'s scope — where `this` = `timer`.

### Regular vs arrow on an object

```js
const user = {
  name: "Ram",

  regularFn: function () {
    console.log(this.name); // "Ram" ✅ — this = whoever calls it
  },

  arrowFn: () => {
    console.log(this.name); // undefined ❌ — this = outer/global scope
  }
};

user.regularFn(); // Ram
user.arrowFn();   // undefined
```

`arrowFn` has no enclosing regular function — it goes all the way to global. Not `user`.

### The rule that prevents mistakes

```
Object methods    → regular functions   (need this = the object)
Callbacks inside  → arrow functions     (need to inherit this)
```

```js
const user = {
  name: "Ram",
  greet: function () {          // ✅ regular — this = user
    setTimeout(() => {          // ✅ arrow — inherits this from greet = user
      console.log(this.name);   // Ram ✅
    }, 1000);
  }
};
```

### Classic interview question

```js
const obj = {
  name: "Ram",

  outer: function () {
    const inner = () => {
      console.log(this.name);
    };
    inner();
  },

  broken: () => {
    console.log(this.name);
  }
};

obj.outer();  // "Ram" — arrow inherits from outer where this = obj
obj.broken(); // undefined — no enclosing regular function, goes to global
```

### Corner cases

**Nested arrows chain up to the nearest regular function:**
```js
const obj = {
  name: "Ram",
  outer: function () {
    const a = () => {
      const b = () => {
        console.log(this.name); // "Ram" ✅ — chains up to outer
      };
      b();
    };
    a();
  }
};
obj.outer(); // Ram
```

**Arrow as object method — the silent bug:**
```js
const api = {
  url: "https://api.example.com",
  fetch: () => {
    console.log(this.url); // undefined ❌ — this is not api
  }
};
api.fetch(); // undefined

// Fix: use regular function for object methods
const api = {
  url: "https://api.example.com",
  fetch: function () {
    console.log(this.url); // "https://api.example.com" ✅
  }
};
```

### In React

```js
// Class component — arrow class field, no bind needed
class Counter extends React.Component {
  state = { count: 0 };

  increment = () => {
    // arrow captures this = component instance at class definition
    this.setState({ count: this.state.count + 1 }); // ✅
  };
}

// Functional component — arrow functions everywhere for callbacks
function Timer() {
  useEffect(() => {           // arrow — inherits scope
    const id = setInterval(() => { // arrow — inherits scope
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id); // arrow — cleanup
  }, []);
}
```

---

## 6. Pure Functions and Side Effects

### Why it exists

As codebases grow, functions that secretly change things outside themselves become extremely hard to debug. You call a function and something elsewhere breaks — with no obvious connection.

Pure functions solve this by making a guarantee: **call me with the same input, get the same output, and nothing else in the world changes.**

### What is a pure function

A function is pure if it satisfies two rules:

1. **Same input always produces same output** (deterministic)
2. **No side effects** — it does not change anything outside itself

```js
// Pure — same input, same output, nothing changed outside
function add(a, b) {
  return a + b;
}

add(2, 3); // always 5
add(2, 3); // always 5
```

### What is a side effect

A side effect is **anything a function does beyond computing and returning a value.**

```js
// Side effects include:
// - Modifying a variable outside the function
// - Modifying an argument (mutation)
// - console.log
// - API calls
// - Reading/writing to localStorage
// - DOM manipulation
// - setTimeout / setInterval
// - Math.random() / Date.now() — non-deterministic reads
```

### Impure function examples

**Modifying outer variable:**
```js
let total = 0;

function addToTotal(amount) {
  total += amount; // ❌ side effect — modifies outer variable
}
```

**Mutating an argument:**
```js
function addItem(cart, item) {
  cart.push(item); // ❌ side effect — mutates the original array
  return cart;
}

const myCart = ["shoes"];
addItem(myCart, "shirt");
console.log(myCart); // ["shoes", "shirt"] — original was changed
```

**Non-deterministic output:**
```js
function getDiscount(price) {
  return price * Math.random(); // ❌ different output every call — not pure
}
```

### Pure function versions

```js
// ✅ Pure — no mutation, returns new value
function add(total, amount) {
  return total + amount;
}

// ✅ Pure — returns new array, original untouched
function addItem(cart, item) {
  return [...cart, item];
}

const myCart = ["shoes"];
const newCart = addItem(myCart, "shirt");
console.log(myCart);   // ["shoes"] — unchanged
console.log(newCart);  // ["shoes", "shirt"]
```

### Side effects are not evil — they are necessary

The goal is not to eliminate side effects. The goal is to **isolate and control** them.

```
Pure functions   → business logic, transformations, calculations
Side effects     → isolated at the edges — API calls, localStorage, DOM
```

A program with zero side effects does nothing useful. The skill is knowing where to put them.

### In React — this is the entire model

**React components should be pure functions of state:**
```js
// Pure component — same props, same output, no side effects in render
function UserCard({ name, role }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  );
}
```

**Side effects in React belong in `useEffect`:**
```js
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  // ✅ Side effect isolated here — not in render
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]);

  return user ? <UserCard name={user.name} role={user.role} /> : null;
}
```

**Array methods — pure vs impure:**
```js
const numbers = [3, 1, 4, 1, 5];

// ❌ Impure — mutates original
numbers.sort();
numbers.splice(0, 2);

// ✅ Pure — returns new array, original untouched
const sorted = [...numbers].sort();
const sliced = numbers.slice(0, 2);
```

**Reducer pattern — must be pure:**
```js
// ✅ Pure reducer — same state + action = same new state, no mutation
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.item] }; // new object
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    default:
      return state;
  }
}
```

React's `useReducer` and Redux both require pure reducers. If you mutate state inside a reducer, React won't detect the change and won't re-render.

### Corner cases

**A function that reads from outside but doesn't modify — still impure:**
```js
const TAX_RATE = 0.1;

function calculateTax(price) {
  return price * TAX_RATE; // depends on external variable
}

// If TAX_RATE changes, output changes for same input — not deterministic
```

**Fix — pass it in:**
```js
function calculateTax(price, taxRate) {
  return price * taxRate; // pure — all inputs explicit
}
```

**console.log is a side effect:**
```js
function add(a, b) {
  console.log("Adding", a, b); // side effect — writes to console
  return a + b;
}
// Technically impure, but acceptable in development
// In production code — keep logging out of pure business logic
```

### How to identify pure vs impure at a glance

Ask these three questions:
1. Does it modify anything outside itself? → impure
2. Does it read something that could change (global var, Date, Math.random)? → impure
3. If I call it 100 times with the same arguments, do I always get the same result? → if no, impure

---

## 7. Interview Definitions — Say These Out Loud

**What is a first class function?**
> "A first class function means functions are treated as values in JavaScript. They can be stored in variables, passed as arguments to other functions, and returned from functions. This is the foundation for callbacks, closures, higher order functions, and patterns like React hooks."

**What is a closure?**
> "A closure is a function that retains access to variables from its outer scope even after the outer function has finished executing. When an inner function is returned or passed outside, it carries a reference to the variables it needs — like a backpack. This enables patterns like private state, function factories, and custom hooks."

**What is a stale closure?**
> "A stale closure happens when a function closes over a variable, but by the time the function runs, that variable has changed and the function is still reading the old value. In React, this commonly happens in useEffect when state variables are used inside callbacks but not included in the dependency array — the effect closes over the initial value and never sees updates."

**What is `this` in JavaScript?**
> "`this` is a keyword that refers to the execution context of a function — the object that owns the current function call. It is not set when the function is defined. It is determined at call time, based on how the function is invoked."

**What is the difference between call, apply, and bind?**
> "`call` and `apply` both invoke the function immediately with a specific `this`. The difference is how arguments are passed — `call` takes them comma separated, `apply` takes an array. `bind` does not invoke the function — it returns a new function with `this` permanently locked. Once bound, even `call` cannot override it."

**Why don't arrow functions have their own `this`?**
> "Arrow functions were designed to solve the problem of losing `this` context inside callbacks. They don't create their own `this` — instead they capture it lexically from the nearest enclosing regular function's scope at the time they are written. This makes them predictable inside event handlers, array callbacks, and useEffect."

**What is a pure function?**
> "A pure function always returns the same output for the same input, and produces no side effects — it doesn't modify anything outside itself. This makes functions predictable, testable, and easy to reason about. In React, components should be pure functions of props and state, and side effects should be isolated in useEffect."

**What is a side effect?**
> "A side effect is anything a function does beyond computing and returning a value — modifying external state, making API calls, writing to localStorage, manipulating the DOM, or reading non-deterministic values like Date.now or Math.random. Side effects are necessary, but they should be isolated and controlled rather than scattered through business logic."

---

*Phase 1 — Cluster 2 | Concepts: First Class Functions, Closures, Stale Closure, this Binding, Arrow Functions, Pure Functions and Side Effects*
