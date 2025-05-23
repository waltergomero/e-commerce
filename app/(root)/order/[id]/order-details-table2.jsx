'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {  Table,  TableBody,  TableCell,  TableHead,  TableHeader,  TableRow,} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useTransition } from 'react';
import {  PayPalButtons,  PayPalScriptProvider,  usePayPalScriptReducer,} from '@paypal/react-paypal-js';
import {  createPayPalOrder,  approvePayPalOrder,  updateOrderToPaidCOD,  deliverOrder,} from '@/actions/order-actions';

const OrderDetailsTable = ({order, paypalClientId}) => {
    const {
    id,
    shippingAddress,
    orderitems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order.data;

  const PrintLoadingState = () => {
      const [{ isPending, isRejected }] = usePayPalScriptReducer();
      let status = '';

      if (isPending) {
        status = 'Loading PayPal...';
      } else if (isRejected) {
        status = 'Error Loading PayPal';
      }
      return status;
    };

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(id);

    if (!res.success) {
      toast({
        variant: 'destructive',
        description: res.message,
      });
    }

    return res.data;
  };

  const handleApprovePayPalOrder = async (data) => {
    const res = await approvePayPalOrder(id, data);

    toast({
      variant: res.success ? 'default' : 'destructive',
      description: res.message,
    });
  };



  return (
        <>
          <h1 className='py-4 text-2xl'>Order {formatId(id)}</h1>
          <div className='grid md:grid-cols-3 md:gap-5'>
            <div className='col-span-2 space-4-y overlow-x-auto'>
              <Card>
                <CardContent className='p-4 gap-4'>
                  <h2 className='text-xl pb-4'>Payment Method</h2>
                  <p className='mb-2'>{paymentMethod}</p>
                  {isPaid ? (
                    <Badge variant='secondary'>
                      Paid at {formatDateTime(paidAt).dateTime}
                    </Badge>
                  ) : (
                    <Badge variant='destructive'>Not paid</Badge>
                  )}
                </CardContent>
              </Card>
              <Card className='my-2'>
                <CardContent className='p-4 gap-4'>
                  <h2 className='text-xl pb-4'>Shipping Address</h2>
                  <p>{shippingAddress.fullName}</p>
                  <p className='mb-2'>
                    {shippingAddress.streetAddress}, {shippingAddress.city}
                    {shippingAddress.postalCode}, {shippingAddress.country}
                  </p>
                  {isDelivered ? (
                    <Badge variant='secondary'>
                      Delivered at {formatDateTime(deliveredAt).dateTime}
                    </Badge>
                  ) : (
                    <Badge variant='destructive'>Not Delivered</Badge>
                  )}
                </CardContent>
             </Card>
             <Card>
              <CardContent className='p-4 gap-4'>
                <h2 className='text-xl pb-4'>Order Items</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderitems.map((item) => (
                      <TableRow key={item.slug}>
                        <TableCell>
                          <Link
                            href={`/product/{item.slug}`}
                            className='flex items-center'
                          >
                            <Image
                              src={item.image}
                              alt={item.product_name}
                              width={50}
                              height={50}
                            />
                            <span className='px-2'>{item.product_name}</span>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span className='px-2'>{item.quantity}</span>
                        </TableCell>
                        <TableCell className='text-right'>
                          ${item.price}
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
            <CardContent className='p-4 gap-4 space-y-4'>
              <div className='flex justify-between  pl-2 pr-2'>
                <div>Items</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className='flex justify-between   pl-2 pr-2'>
                <div>Tax</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className='flex justify-between   pl-2 pr-2 '>
                <div>Shipping</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className='flex justify-between bg-gray-300 p-2 rounded-md'>
                <div><span className='font-semibold'>Total</span></div>
                <div><span className='font-semibold'>{formatCurrency(totalPrice)}</span></div>
              </div>
              {/* PayPal Payment */}
              {!isPaid && paymentMethod === 'PayPal' && (
                <div>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePayPalOrder}
                      onApprove={handleApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}

             {/* Stripe Payment */}
               {!isPaid && paymentMethod === 'Stripe' && stripeClientSecret && (
                <StripePayment
                  priceInCents={Number(order.totalPrice) * 100}
                  orderId={order.id}
                  clientSecret={stripeClientSecret}
                />
              )}

              {/* Cash On Delivery */}
               {isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
                <MarkAsPaidButton />
              )}
              {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
            </CardContent>
          </Card>
            </div>
        </div>
      </>
  )
}

export default OrderDetailsTable