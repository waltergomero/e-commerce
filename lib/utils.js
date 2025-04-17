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