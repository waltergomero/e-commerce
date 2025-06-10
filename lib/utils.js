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

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits:2,
})

export function formatCurrency(amount){
    if(typeof amount === 'number'){
      return CURRENCY_FORMATTER.format(amount)
    }
    else if(typeof amount === 'string'){
      return CURRENCY_FORMATTER.format(Number(amount))
    }
    else {
      return 'NAN'
    }
}

// Format Number
const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');

export function formatNumber(number) {
  return NUMBER_FORMATTER.format(number);
}

//shortend uuid
export function formatId(id){
  if (!id)
     throw new Error('Order ID is required to shortend uuid');
  else
    return `...${id.substring(id.length - 12)}`;
}

// Format date and times
export const formatDateTime = (dateString) => {
  const dateTimeOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };
  const timeOptions= {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime= new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  );
  const formattedDate = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  );
  const formattedTime= new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// Form the pagination links
export function formUrlQuery({
  params,
  key,
  value,
}) {
  const query = qs.parse(params);

  query[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    {
      skipNull: true,
    }
  );
}