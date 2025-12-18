export function validatePrecision(num: number) {
  const str = num.toString();
  const parts = str.split(".");
  if (parts.length === 2 && parts[1].length > 4) {
    throw new Error("Amount/Balance can have at most 4 decimal places.");
  }
}
