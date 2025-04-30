import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function convertToPlainObject(value){
  return JSON.parse(JSON.stringify(value));
}


export function formatNumberWithDecimal(number){
  const [int, decimal] = number.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

//round number to 2 decimal point

export function round2(num){
  if(typeof num === 'number')
  {
  return +(Math.round(num + "e+2")  + "e-2");
  }
  else if (typeof num === 'string') {
    return +(Math.round(Number(num) + "e+2")  + "e-2");
  }
  else{
    throw new Error('Value is not a number or string')
  }
}