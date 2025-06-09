import { title } from 'process';
import React from 'react';
import { getMyCart } from '@/actions/cart-actions';
import CartTable from './cart-table';

export const metadata = {
    title: 'Shopping cart'
}

const CartPage = async () => {
    const cart = await getMyCart();
    console.log("CartPage cart:", cart);
  return (
    <>
        <CartTable cart={cart}/>
    </>
  )
}

export default CartPage