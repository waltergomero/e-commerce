'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { ToastContainer, ToastContentProps, toast  } from 'react-toastify';
import {Toaster} from '@/components/ui/sonner';
import {AddItemToCart} from '@/actions/cart-actions';
import cx from 'clsx';
import Link from 'next/link';

const AddToCart = ({item}) => {
    const router = useRouter();
    console.log("item paased: ", item)

    const handleAddToCart = async () => {
         const res = await AddItemToCart(item) 

         if(!res.success){
            toast.error(res.message,)
            return;
         }
         //add to cart was a success
         toast.success(CustomNotification, {
          data: {
            title: `${item.product_name} `,
            content: 'was added to cart',
          },
          progress: 0.2,
          ariaLabel: 'was added to cart',
          autoClose: true,
        });
    }
  return (
    <Button className='w-full' type='button' onClick={handleAddToCart}>Add To Cart</Button>
  )
}

export default AddToCart;

function CustomNotification({
  closeToast,
  data,
  toastProps,
}) 
{
  const isColored = toastProps.theme === 'colored';

  return (
    <div className="flex flex-col w-full">
      <h3
        className={cx(
          'text-sm font-semibold',
          isColored ? 'text-white' : 'text-zinc-800'
        )}
      >
        {data.title}
      </h3>
      <div className="flex items-center justify-between">
        <p className="text-sm">{data.content}</p>
        <Link
          href='/dashboard'
          className={cx(
            'ml-auto transition-all text-xs mt-2 border rounded-md px-4 py-2 text-white active:scale-[.95]',
            isColored ? 'bg-gray-800' : 'bg-zinc-900'
          )}
        >
          Go To Cart
        </Link>
      </div>
    </div>
  );
}