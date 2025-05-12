import React from 'react';
import PlaceOrderForm from './place-order-form';
import { getMyCart } from '@/actions/cart-actions';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserById } from '@/actions/user-actions';
import CheckoutSteps from '../checkout-steps';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';


export const metadata = {
    title: 'Place Order'
}


const PlaceOrderPage = async () => {
    const session = await auth();
    const userId = session?.user?.id;

    if(!userId) throw new Error ('User not found')
    
    const user = await getUserById(userId);
    const cart = await getMyCart();

    if(!cart || cart.items.length === 0) redirect('/cart');
    if(!user.address) redirect('/cart/shipping-address');
    if(!user.paymentMethod) redirect('/cart/payment-method');

    const userAddress = user.address;

  return (
    <div>
        <CheckoutSteps current={3}/>
        <h1 className='py-4 text-xl'>Place Order</h1>
        <div className='grid md:grid-cols-3 md:gap-5'>
          <div className='md:col-span-2 overflow-x-auto space-y-2'>
            <Card>
              <CardContent className='gap-2'>
                  <h2 className='text-lg pb-2'>Shipping Address:</h2>
                  <p className='text-sm'>{userAddress.fullName}</p>
                  <p className='text-sm'>{userAddress.streetAddress}, {userAddress.city}</p>
                  <p className='text-sm'>{userAddress.state}, {userAddress.zipCode}</p>
                  <p className='text-sm'> {userAddress.country}</p>
                 
                 <div className='mt-2'>
                    <Link href='/cart/shipping-address'>
                      <Button variant='outline'>Edit</Button>
                    </Link>
                 </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className=' gap-2'>
                  <h2 className='text-lg pb-2'>Payment Method:</h2>
                  <p className='text-sm'>{user.paymentMethod}</p>        
                 <div className='mt-2'>
                    <Link href='/cart/paymemt-method'>
                      <Button variant='outline'>Edit</Button>
                    </Link>
                 </div>
              </CardContent>
            </Card>
             <Card>
              <CardContent className=' gap-2'>
                  <h2 className='text-lg pb-2'>Order Items:</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.items.map((item) => (
                        <TableRow key={item.slug}>
                          <TableCell>
                            <Link href={`/product/${item.slug}`} className='flex items-center'>
                              <Image
                                src={item.image}
                                alt={item.product_name}
                                width={50}
                                height={50}/>
                                <span className='px-2 text-sm'>{item.product_name}</span>
                            </Link>
                          </TableCell>
                          <TableCell>
                            <span className='px-2 text-sm'>{item.quantity}</span>
                          </TableCell>
                          <TableCell>
                            <span className='px-2 text-sm'>${item.price}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </CardContent>
            </Card>
          </div>
          <div>
           <Card>
              <CardContent className=' gap-4 space-y-4'>
                  <div className='flex justify-between'>
                    <div>Items:</div>
                    <div>{formatCurrency(cart.itemsPrice)}</div>
                  </div>
                  <div className='flex justify-between'>
                    <div>Tax:</div>
                    <div>{formatCurrency(cart.taxPrice)}</div>
                  </div>
                  <div className='flex justify-between'>
                    <div>Shipping:</div>
                    <div>{formatCurrency(cart.shippingPrice)}</div>
                  </div>
                  <div className='flex justify-between'>
                    <div className='font-semibold'>Total:</div>
                    <div className='font-semibold'>{formatCurrency(cart.totalPrice)}</div>
                  </div>
              </CardContent>
              <PlaceOrderForm/>
            </Card>
        </div>
        </div>
    </div>
  )
}

export default PlaceOrderPage