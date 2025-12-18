import Big from "big.js";
// precision mentioned in the problem statement
export const add = (a: number, b: number) => 
  Number(Big(a).plus(b).toFixed(4));

export const subtract = (a: number, b: number) => 
  Number(Big(a).minus(b).toFixed(4));
