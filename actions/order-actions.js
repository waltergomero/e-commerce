'use server';

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { auth } from "@/auth";
import { getMyCart } from "./cart-actions";
import { getUserById } from "./user-actions";
import { insertOrderSchema } from "@/schemas/validation-schemas";
import prisma from "@/prisma/prisma";
import { convertToPlainObject } from "@/lib/utils";


export async function createOrder(){
    try {
        const session = await auth();
        if(!session) throw new Error('User is not authenticated')
        
        const userId = session?.user?.id;
        if(!userId) throw new Error('User is not found')
        
        const user = await getUserById(userId);

        const cart = await getMyCart();

        if(!cart || cart.items.length === 0){
            return{success:false, 
                message: 'Your cart is empty', 
                redirectTo:'/cart'
            }
        }

        if(!user.address){
            return{success:false, 
                message: 'No shipping address', 
                redirectTo:'/cart/shipping-address'
            }
        }

        if(!user.paymentMethod){
            return{success:false, 
                message: 'No payment method', 
                redirectTo:'/cart/payment-method'
            }
        }

        //create order object
        const order = insertOrderSchema.parse({
            userId: user.id,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: Number(cart.itemsPrice),
            shippingPrice: Number(cart.shippingPrice),
            taxPrice: Number(cart.taxPrice),
            totalPrice: Number(cart.totalPrice),
        })

        //create a transaction
        const insertedOrderId = await prisma.$transaction(async (tx) => {
            //create order
            const insertedOrder = await tx.order.create({ data: order });
             console.log("inserted Order: ", insertedOrder)
            //create order items from cart items
            for(const item of cart.items){
                console.log("item: ", item)
                await tx.orderItem.create({
                    data: {
                        orderId: insertedOrder.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price:  item.price,
                        product_name: item.product_name,
                        slug: item.slug,
                        image: item.image,
                    }
                });
            }
            //clear cart
            await tx.cart.update({
                where: {id: cart.id},
                data: {
                    items:[],
                    totalPrice:0,
                    taxPrice: 0,
                    shippingPrice: 0,
                    itemsPrice:0
                }
            })

            return insertedOrder.id;

        });

        if(!insertedOrderId) throw new Error('Order not created')
        
            return {
                success: true, 
                message: 'Order created',
                redirectTo: `/order/${insertedOrderId}`}
                
    } catch (error) {
        console.log("error:", error.message)
        return {success: false, message: error.message}
    }
}

// Get order by id
export async function getOrderById(orderId) {
  try {
    if (!orderId) throw new Error('Order ID is required');

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderitems: true,
        user: { select: { name: true, email: true } },
      },
    });

    if (!order) {
      return { success: false, data: null, message: 'Order not found' };
    }

    return { success: true, data: convertToPlainObject(order) };
  } catch (error) {
    return { success: false, data: null, message: error.message };
  }
}
// export async function getOrderById(orderId) {
//     console.log("orderid: ", orderId)
//   const data = await prisma.order.findFirst({
//     where: {
//       id: orderId,
//     },
//     include: {
//       orderitems: true,
//       user: { select: { name: true, email: true } },
//     },
//   });

//   return convertToPlainObject(data);
// }

// Create new paypal order
export async function createPayPalOrder(orderId) {
  try {
    // Get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (order) {
      // Create paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      // Update order with paypal order id
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: '',
            status: '',
            pricePaid: 0,
          },
        },
      });

      return {
        success: true,
        message: 'Item order created successfully',
        data: paypalOrder.id,
      };
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Approve paypal order and update order to paid
export async function approvePayPalOrder(
  orderId,
  data,
) {
  try {
    // Get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error('Order not found');

    const captureData = await paypal.capturePayment(data.orderID);

    if (
      !captureData ||
      captureData.id !== (order.paymentResult)?.id ||
      captureData.status !== 'COMPLETED'
    ) {
      throw new Error('Error in PayPal payment');
    }

    // Update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: 'Your order has been paid',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update COD order to paid
export async function updateOrderToPaidCOD(orderId) {
  try {
    await updateOrderToPaid({ orderId });

    revalidatePath(`/order/${orderId}`);

    return { success: true, message: 'Order marked as paid' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}


// Update COD order to delivered
export async function deliverOrder(orderId) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error('Order not found');
    if (!order.isPaid) throw new Error('Order is not paid');

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: 'Order has been marked delivered',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}