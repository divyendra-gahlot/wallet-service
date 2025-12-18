import Big from "big.js";

export const add = (a: number, b: number) => 
  Number(Big(a).plus(b).toFixed(4));

export const subtract = (a: number, b: number) => 
  Number(Big(a).minus(b).toFixed(4));
