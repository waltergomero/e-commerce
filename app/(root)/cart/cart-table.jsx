'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useTransition } from 'react';
import { AddItemToCart, removeItemFromCart } from '@/actions/cart-actions';
import { ArrowRight, Plus, Minus, Loader } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';


export const metadata = {
    title: 'Shopping cart'
}

const CartTable = ({cart}) => {
    console.log('cart: ', cart)
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

  return (
    <>
        <h2 className='py-4 h2-bold'>Shopping Cart</h2>
        {
          !cart || cart.items.length === 0 ? (
            <div>
                Cart is empty. <Link href='/'>Go Shopping</Link>
            </div>
          ) : (
            <div className='grid md:grid-cols-4 md:gap-5'>
                <div className='overflow-x-auto md:col-span-3'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead className='text-center'>Quantity</TableHead>
                                <TableHead className='text-center'>Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { cart.items.map((item) => (
                                <TableRow key={item.slug}>
                                    <TableCell>
                                        <Link href={`/product/${item.slug}`} className='flex items-center'>
                                            <Image src={item.image} alt={item.product_name} width={50} height={50}/>
                                            <span className='px-2'>{item.product_name}</span>
                                        </Link>
                                    </TableCell>
                                    <TableCell className='flex-center gap-2'>
                                        <Button disabled={isPending} variant='outline' type='button'
                                        onClick={() => startTransition(async () => {
                                            const res = await removeItemFromCart(item.productId);
                                            if(!res.success){
                                                toast.success(CustomNotification, {
                                                data: {
                                                title: "",
                                                content: res.message,
                                                            },
                                                        })
                                                    }
                                                }
                                                )}>
                                                {isPending ? (
                                                    <Loader className='w-4 h-4 animate-spin'/>
                                                ) : (
                                                    <Minus/>
                                                )}
                                        </Button>
                                        <span>{item.quantity}</span>
                                        <Button disabled={isPending} variant='outline' type='button'
                                        onClick={() => startTransition(async () => {
                                            const res = await AddItemToCart(item);
                                            if(!res.success){
                                                toast.success(CustomNotification, {
                                                data: {
                                                title: "",
                                                content: res.message,
                                                            },
                                                        })
                                                    }
                                                }
                                                )}>
                                                {isPending ? (
                                                    <Loader className='w-4 h-4 animate-spin'/>
                                                ) : (
                                                    <Plus/>
                                                )}
                                        </Button>
                                    </TableCell>
                                    <TableCell className='text-center'>{item.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <Card>
                    <CardContent className='p-4 gap-4'>
                        <div className='pb-3 text-xl'>
                            Subtotal ({cart.items.reduce((a, c) => a + c.quantity, 0)}) :
                            <span className='pl-2 font-bold'>
                                {formatCurrency(cart.itemsPrice)}
                            </span>
                        </div>
                        <Button className='w-full' disabled={isPending} onClick={() =>
                            startTransition(() => router.push('/shipping'))}>
                                {isPending ? (
                                    <Loader className='w-4 h-4 animate-spin'/>
                                ) : (
                                    <ArrowRight className='w-4 h-4'/>                              
                                )} Proceed to Checkout
                            </Button>
                    </CardContent>
                </Card>
            </div>
          )
        }
    </>
  )
}

export default CartTable