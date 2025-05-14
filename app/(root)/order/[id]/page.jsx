import React from 'react';
import { getOrderById } from '@/actions/order-actions';
import { notFound } from 'next/navigation';
import OrderDetailsTable from './order-details-table';

export const metadata = {
    title: 'Order Details'
}


const OrderDetailsPage = async ({params}) => {
    const {id} = await params;

    const order = await getOrderById(id);

    if(!order) notFound();
    console.log("orders to pass: ", order)
    
  return (
    <div>
      <OrderDetailsTable order={order}/>
    </div>
  )
}

export default OrderDetailsPage