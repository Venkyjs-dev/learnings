// Print All Even Numbers in an Array:

export const printEvenNums = (arr) => {
  // Validation 1: check arr is array type
  if (!Array.isArray(arr)) {
    throw new Error("arr is not an Array");
  }

  // Validation 2: check empty
  if (arr.length === 0) {
    throw new Error("Empty Array");
  }

  // Logic:
  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];

    // validate element
    if (typeof num !== "number" || Number.isNaN(num)) {
      console.log(`${num} is not a valid number`);
      continue; // skip remaining checks for this element
    }

    // print even only
    if (num % 2 === 0) {
      console.log(`${num} is an even number`);
    }
  }
};

// Count Negative Numbers in an Array:
export const negCountInArray = (arr) => {
  // Validation 1: check arr is array type
  if (!Array.isArray(arr)) {
    throw new Error("Invalid array input");
  }

  // Validation 2: empty array
  if (arr.length === 0) {
    throw new Error("Empty input array");
  }

  // Logic:
  let negCount = 0;

  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];

    // validate each element
    if (typeof num !== "number" || Number.isNaN(num)) {
      console.log(`${num} is not a valid number`);
      continue;
    }

    if (num < 0) {
      negCount++;
    }
  }

  return negCount;
};

// Find Smallest Number in an Array: O(n) and O(1)

export const smallestNumInArr = (arr) => {
  // validation 1: check input is Array or not
  if (!Array.isArray(arr)) {
    throw new Error("Invalid input array");
  }

  // validation 2: check for empty array
  if (arr.length === 0) {
    throw new Error("Input array is empty");
  }

  // logic:
  let smallestNum = arr[0];

  for (let i = 1; i < arr.length; i++) {
    const num = arr[i];

    // validate: ensure element is a valid number
    if (typeof num !== "number" || Number.isNaN(num)) {
      console.log(`Invalid item at index ${i}: ${num}`);
      continue;
    }

    if (num < smallestNum) {
      smallestNum = num;
    }
  }

  return smallestNum;
};

// Find Largest Number in an array: O(n) and O(1)

export const largestNumInArr = (arr) => {
  // validation 1: check array is valid input
  if (!Array.isArray(arr)) {
    throw new Error("Invalid input array type");
  }

  // validation 2: check array is empty
  if (arr.length === 0) {
    throw new Error("Input array is empty");
  }

  // validate first element
  if (typeof arr[0] !== "number" || Number.isNaN(arr[0])) {
    throw new Error(`Invalid number at index 0: ${arr[0]}`);
  }

  // logic:
  let largestNum = arr[0];

  for (let i = 1; i < arr.length; i++) {
    const num = arr[i];

    // validate each number
    if (typeof num !== "number" || Number.isNaN(num)) {
      console.log(`${num} is an invalid number`);
      continue;
    }

    if (num > largestNum) {
      largestNum = num;
    }
  }

  return largestNum;
};

//Find Second Largest Number:
