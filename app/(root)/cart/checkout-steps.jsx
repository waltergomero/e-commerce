import React, { Fragment } from 'react';
import {cn} from '@/lib/utils';

const CheckoutSteps = ({current =  0}) => {
  const steps = ['User Login', 'Shipping Address', 'Payment Method', 'Place Order'];

  return (
    <div className='flex-between flex-col md:flex-row space-x-2 space-y-2 mb-10'>
        {
          steps.map((step, index) => (
            <Fragment key={step}>
              <div className={cn('p-2 w-56 rounded-md text-center text-sm', 
                index === current ? 'bg-gray-200' : '')}>{step}</div>
                {step !== 'Place Order' && (
                  <hr className='w-16 border-t border-gray-300 mx-2'/>
                )}
            </Fragment>
          )) 
        }
    </div>
  )
}

export default CheckoutSteps;