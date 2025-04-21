'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
//import {useToast} from '@/hooks/use-toast';
import {Toaster} from '@/components/ui/sonner';
import {AddItemToCart} from '@/actions/cart-actions'

const AddToCart = ({item}) => {
    const router = useRouter();
    const {toast} = Toaster();

    const handleAddToCart = async () => {
         const res = await AddItemToCart(item) 

         if(!res.success){
            toast({
                variant: 'destructive',
                description: res.message,
            })
            return;
         }
         //add to cart was a success
         toast({
            description: `${item.name} added to cart`,
            action: (
                <Toaster className='bg-primary text-white hover:bg-gray-800' altText='Go to Cart'
                onClick={() => router.push('/cart')}>
                 Go To Cart
                </Toaster>
            )
        })
    }
  return (
    <Button className='w-full' type='button' onClick={handleAddToCart}>Add To Cart</Button>
  )
}

export default AddToCart