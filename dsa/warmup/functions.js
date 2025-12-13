// Sum of two integers with proper validation
export const sumOfTwoInt = (a, b) => {
  // Validate: both inputs must be provided
  if (a === undefined || b === undefined) {
    throw new Error("Both inputs are required.");
  }

  // Validate: must be numbers
  if (typeof a !== "number" || typeof b !== "number") {
    throw new Error("Inputs must be numbers.");
  }

  // Validate: must be integers
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new Error("Inputs must be integers.");
  }

  // Validate: inputs must be within safe integer range
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b)) {
    throw new Error("Inputs exceed JavaScript's safe integer limit.");
  }

  // Return sum (safe operation at this point)
  return a + b;
};

// Square of a number

export const sqrtOfNum = (num) => {
  //validate: num must provided
  if (num === undefined) {
    throw new Error("Number must be passed");
  }

  // validate: num must be number
  if (num !== "number") {
    throw new Error("Num is not a number type ");
  }

  // validate: must be integer
  if (!Number.isInteger(num)) {
    throw new Error("Number must be integer type ");
  }

  // validate: num must be in safe range
  if (!Number.isSafeInteger(num)) {
    throw new Error("Number must be in safe rage ");
  }

  // return sqr
  return num * num;
};

// Check voting eligibility:
export const checkVoteElig = (age) => {
  // validate: age must be provided (not undefined or null)
  if (age === undefined || age === null) {
    throw new Error("Age must be provided");
  }

  // validate: age must be a number
  if (typeof age !== "number") {
    throw new Error("Age must be a number");
  }

  // validate: age must be a positive integer
  if (!Number.isInteger(age) || age <= 0) {
    throw new Error("Age must be a positive integer");
  }

  // main logic:
  if (age >= 18) {
    return "You are eligible to vote";
  } else {
    return "You are not eligible to vote";
  }
};

// Check Even or Odd:
export const evenOrOdd = (num) => {
  // validate 1: check num is provided
  if (num === undefined || num === null) {
    throw new Error("Must provide num");
  }

  // validate 2: check num is number type
  if (typeof num !== "number" || Number.isNaN(num)) {
    throw new Error("Num is not a valid number");
  }

  // validate 3: check num is positive integer
  if (!Number.isInteger(num)) {
    throw new Error("Num must be integer");
  }

  // logic:
  return num % 2 === 0 ? "EVEN" : "ODD";
};
