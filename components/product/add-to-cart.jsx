'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Loader } from 'lucide-react';
import { toast  } from 'react-toastify';
import {AddItemToCart, removeItemFromCart} from '@/actions/cart-actions';
import cx from 'clsx';
import Link from 'next/link';
import { useTransition } from 'react';

const AddToCart = ({cart, item }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();


  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await AddItemToCart(item) 

      if(!res.success){
            toast.error(res.message,)
            return;
          }
          //add to cart was a success
          toast.success(CustomNotification, {
          data: {
            title: `${item.product_name} `,
            content: res.message,
          },
          ariaLabel: 'was added to cart',
          autoClose: true,
        });
        })
  }

    //check if item is in cart
    const existItem = cart && cart.items.find((x) => x.productId === item.productId);

    //remove from cart
    const handleReemoveItemFromCart = async() =>{
      startTransition(async () => {
        const res = await removeItemFromCart(item.productId);
      
        if(!res.success){
          toast.error(res.message,)
          return;
        }
        //remove item from cart was a success
        toast.success(CustomNotification, {
        data: {
          title: `${item.product_name} `,
          content: res.message,
        },
        ariaLabel: 'was removed from cart',
        autoClose: true,
        });
      })
    }

  return existItem ? (
    <div>
      <div className='text-xs'>Quantity in cart</div>
      <Button type='button' className='bg-gray-100' variant='outline' onClick={handleReemoveItemFromCart}>
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin'/>
        ) : (<Minus/>)}
      </Button>
      <span className='px-2'>{existItem.quantity}</span>
      <Button type='button' className='bg-gray-100' variant='outline' onClick={handleAddToCart}>
      {isPending ? (
          <Loader className='w-4 h-4 animate-spin'/>
        ) : (<Plus/>)}
      </Button>
    </div>
  ) : 
    (
      <Button className='w-full' type='button' onClick={handleAddToCart}>
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin'/>
        ) : (<Plus/>)} add to cart
        </Button>
    );
}

export default AddToCart;

function CustomNotification({data,  toastProps,}) 
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