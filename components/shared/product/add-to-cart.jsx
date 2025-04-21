'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import {Toaster} from '@/components/ui/sonner';
import {AddItemToCart} from '@/actions/cart-actions'

const AddToCart = ({item}) => {
    const router = useRouter();
    const {toast} = Toaster();

    const handleAddToCart = async()=>{

    }
  return (
    <Button className='w-full' type='button' onClick={handleAddToCart}>Add To Cart</Button>
  )
}

export default AddToCart