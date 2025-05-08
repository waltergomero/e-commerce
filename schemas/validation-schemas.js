import { PAYMENT_METHODS } from '@/lib/constants';
import { Currency } from 'lucide-react';
import { z } from 'zod';


export const productSchema = z.object({
  product_name: z.string().min(2, { message: 'Product name must be at least 2 characters long' }),
  slug: z.string().min(2, { message: 'Code name must be at least 2 characters long' }),
  category: z.string().min(2, { message: 'Category name must be selected' }),
  brand: z.string().min(2, { message: 'Brand name must be selected' }),
  description: z.string().min(2, { message: 'Description must be at least 3 characters long' }),
  stock: z.coerce.number(),
  images: z.array(z.string()),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: z.number()
});

export const userSigninSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 8 characters long' }),
});


export const userSignupSchema = z.object({
  first_name: z.string().min(2, { message: 'First name must be at least 2 characters long' }),
  last_name: z.string().min(2, { message: 'Last name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

export const userUpdateSchema = z.object({
  first_name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  last_name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
});


export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  product_name: z.string().min(1, { message: 'Product name is required' }),
  slug: z.string().min(1, { message: 'Code name is required' }),
  quantity: z.number().int().nonnegative('Quantity must be a positive number'),
  image: z.string().min(1, 'Image is required'),
  price: z.number(),
});


export const insertCartSchema = z.object({
  userId: z.string().optional().nullable(),
  sessionCartId: z.string().min(1, 'Session cart id is required'),
  items: z.array(cartItemSchema),
  itemsPrice: z.number(),
  totalPrice: z.number(),
  shippingPrice: z.number(),
  taxPrice: z.number(),
})


export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  streetAddress: z.string().min(3, 'Address must be at least 3 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(3, 'Zip code must be at least 3 characters'),
  country: z.string().min(3, 'Country must be at least 3 characters'),
  lat: z.number().optional(),
  lng: z.number().optional(),
})


export const paymentMethodSchema = z.object({
  type: z.string().min(1, 'Payment method requiered'),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
  path: ['type'],
  message: 'Invalid payment method'
});



export const insertOrderSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  itemsPrice: z.number(),
  shippingPrice: z.number(),
  taxPrice: z.number(),
  totalPrice: z.number(),
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data.type), {
    message: 'Invalid payment method'}),
  shippingAddress: shippingAddressSchema
});


export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  product_name: z.string(),
  price: z.number(),
  quantity: z.number(),
  })















export const statusSchema = z.object({
  status_name: z.string().min(2, { message: 'Status name must be at least 2 characters long' }),

});

export const categorySchema = z.object({
  category_name: z.string().min(2, { message: 'Category name must be at least 2 characters long' }),

});
