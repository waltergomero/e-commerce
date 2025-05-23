import { Metadata } from 'next';
import { getOrderById } from '@/actions/order-actions';
import { notFound, redirect } from 'next/navigation';
import OrderDetailsTable from './order-details-table';
import { auth } from '@/auth';
//import Stripe from 'stripe';

export const metadata = {
    title: 'Order Details'
}

const OrderDetailsPage = async (props) => {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();

  // Redirect the user if they don't own the order
  if (order.userId !== session?.user.id && session?.user.isadmin !== true) {
    return redirect('/unauthorized');
  }

  let client_secret = null;

  // Check if is not paid and using stripe
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    // Init stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'USD',
      metadata: { orderId: order.id },
    });
    client_secret = paymentIntent.client_secret;
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress,
      }}
      stripeClientSecret={client_secret}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      isadmin={session?.user?.isadmin === true || false}
    />
  );
};

export default OrderDetailsPage;


// import React from 'react';
// import { getOrderById } from '@/actions/order-actions';
// import { notFound } from 'next/navigation';
// import OrderDetailsTable from './order-details-table';

// export const metadata = {
//     title: 'Order Details'
// }


// const OrderDetailsPage = async ({params}) => {
//     const {id} = await params;

//     const order = await getOrderById(id);

//     if(!order) notFound();
//     console.log("orders to pass: ", order)
    
//   return (
//     <div>
//       <OrderDetailsTable order={order} paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}/>
//     </div>
//   )
// }

// export default OrderDetailsPage