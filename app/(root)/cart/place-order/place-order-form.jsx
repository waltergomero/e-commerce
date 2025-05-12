'use client';

import { createOrder } from '@/actions/order-actions';
import { Check, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

import React from 'react'

const PlaceOrderForm = () => {
    const router = useRouter();

    const handleSubmit = async (event)=>{
        event.preventDefault();

        const res = await createOrder();

        if(res.redirectTo)
        {
            router.push(res.redirectTo);
        }
    }

    const PlaceOrderButton = () =>{
        const { pending } = useFormStatus();
        return (
            <Button disabled={pending} className='w-full'>
                { pending ? (
                    <Loader className='w-4 h-4 animate-spin'/>
                ) : (
                    <Check className='w-4 h-4'/>
                    
                )} Place Order
            </Button>
        )
    }

  return (
        <form onSubmit={handleSubmit} className='w-full'>
            <PlaceOrderButton/>
        </form>
  )
}

export default PlaceOrderForm