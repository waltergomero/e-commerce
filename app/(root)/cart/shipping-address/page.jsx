import React from 'react';
import { auth } from '@/auth';
import { getMyCart } from '@/actions/cart-actions';
import { getUserById } from '@/actions/user-actions';
import { redirect } from 'next/navigation';
import ShippingAddressForm from './shipping-form';
import CheckoutSteps from '../checkout-steps';

export const metadata = {
    title: 'Shipping Address'
}

const ShippingAddressPage = async() => {
const cart = await getMyCart();

if(!cart || cart.items.length === 0) 
    redirect('/cart')

const session = await auth();
const userId = session.user?.id;
if(!userId)
    throw new Error('User not found')

const user = await getUserById(userId);


  return (
    <>
        <CheckoutSteps current={1}/>
        <ShippingAddressForm address={user.address}/>
    </>
  )
}

export default ShippingAddressPage