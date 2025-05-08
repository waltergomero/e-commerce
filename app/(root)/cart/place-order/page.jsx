import React from 'react';
import PlaceOrderForm from './placeorder-form';
import { getMyCart } from '@/actions/cart-actions';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserById } from '@/actions/user-actions';
import CheckoutSteps from '../checkout-steps';


export const metadata = {
    title: 'Place Order'
}


const PlaceOrderPage = async () => {
    const session = await auth();
    const userId = session?.user?.id;

    if(!userId) throw new Error ('User not found')
    
    const user = await getUserById(userId);

    const cart = await getMyCart();

    if(!cart || cart.items.length === 0) redirect('/cart');
    if(!user.address) redirect('/cart/shipping-address');
    if(!user.paymentMethod) redirect('/cart/payment-method');

    const userAddress = user.address;

  return (
    <div>
        <CheckoutSteps current={3}/>
        <PlaceOrderForm/>
    </div>
  )
}

export default PlaceOrderPage