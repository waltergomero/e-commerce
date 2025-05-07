import React from 'react';

import { auth } from '@/auth';
import { getUserById } from '@/actions/user-actions';
import PaymentMethodForm from './payment-method-form';
import CheckoutSteps from '../checkout-steps';


export const metadata = {
    title: 'Payment Method'
}

const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if(!userId) throw new Error("User not found")

  const user = await getUserById(userId);
  
  return (
    <div>
        <CheckoutSteps current={2}/>
        <PaymentMethodForm preferredPaymentMethod={user.paymentMethod}/>
    </div>
  )
}

export default PaymentMethodPage