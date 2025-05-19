 const APP_NAME = "Luisa's Store";
 const APP_TAGLINE = "Your one-stop shop for everything fabulous done by hand!";
 const LATEST_PRODUCTS_LIMIT = 8

 
export { APP_NAME, APP_TAGLINE, LATEST_PRODUCTS_LIMIT  };

export const signUpDefaultValues = {
    first_name: '',
    last_name: '',
    email: '',
    isadmin: false,
}

export const shippingAddressDefaultValues = {
    fullName: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    lat: '',
    lng: '',
}

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.PAYMENT_METHODS.split(', ') : ['PayPal', 'Stripe', 'CashOnDelivery'];

export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;