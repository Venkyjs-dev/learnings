// map pollyfil;

const arr = [1, 2, 3];

const mul = (num) => num * 3;

// const myMap = (arr, mul) => {
//   const output = [];

//   for (let i = 0; i < arr.length; i++) {
//     const res = mul(arr[i]);
//     output.push(res);
//   }
//   return output;
// };

Array.prototype.myMap = function (callback) {
  const output = [];

  const currentArr = this;

  for (let i = 0; i < currentArr.length; i++) {
    output.push(callback(currentArr[i]));
  }

  return output;
};

Array.prototype.myFilter = function (callback) {
  const outputArr = [];

  for (let i = 0; i < this.length; i++) {
    if (callback(this[i])) {
      outputArr.push(this[i]);
    }
  }

  return outputArr;
};

const dArr = arr.myMap(mul);
console.log(dArr);

const evenArr = arr.myFilter((ele) => {
  if (ele > 2) {
    return true;
  }

  return false;
});

console.log("evenArr", evenArr);
