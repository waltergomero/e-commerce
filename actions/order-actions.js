'use server';

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { auth } from "@/auth";
import { getMyCart } from "./cart-actions";
import { getUserById } from "./user-actions";
import { insertOrderSchema } from "@/schemas/validation-schemas";
import prisma from "@/prisma/prisma";
import { Prisma } from "@prisma/client";
import { convertToPlainObject, formatNumber  } from "@/lib/utils";
import {paypal} from '@/lib/paypal';
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from '@/lib/constants';


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


// Create new paypal order
export async function createPayPalOrder(orderId) {
  try {
    // Get order from database
    const order = await prisma.order.findUnique({
      where: { id: orderId, },
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
    return { success: false, message: error.message + 'calling paypal' };
  }
}

// Approve paypal order and update order to paid
export async function approvePayPalOrder( orderId, data,) {
  try {
    // Get order from database
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error('Order not found');

    const captureData = await paypal.capturePayment(data.orderID);
    console.log("capture data: ", captureData)

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
    return { success: false, message: error.message };
  }
}

// Update order to paid
export async function updateOrderToPaid({  orderId,  paymentResult,}) {
  // Get order from database
  const order = await prisma.order.findFirst({
    where: { id: orderId, },
    include: {
      orderitems: true,
    },
  });

  console.log("updateOrderToPaid: ", order)

  if (!order) throw new Error('Order not found');
console.log("step1: ")
  if (order.isPaid) throw new Error('Order is already paid');
console.log("step2: ")
  // Transaction to update order and account for product stock
  await prisma.$transaction(async (tx) => {
    // Iterate over products and update stock
    for (const item of order.orderitems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: -item.quantity } },
      });
    }
console.log("step3: ")
    // Set the order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });
console.log("step4: ")
  // Get updated order after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });
console.log("updatedOrder: ", updatedOrder)
console.log("step5: ")
  if (!updatedOrder) throw new Error('Order not found');
console.log("step6: ")
  sendPurchaseReceipt({
    order: {
      ...updatedOrder,
      shippingAddress: updatedOrder.shippingAddress,
      paymentResult: updatedOrder.paymentResult,
    },
  });
  console.log("step7: ")
}

// Get user's orders
export async function getMyOrders({  limit = PAGE_SIZE,  page,}) {
  const session = await auth();
  if (!session) throw new Error('User is not authorized');

   console.log("user id : ", session?.user?.id)

  const data = await prisma.order.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  console.log("data: ", data)

  const dataCount = await prisma.order.count({
    where: { userId: session?.user?.id },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// type SalesDataType = {
//   month: string;
//   totalSales: number;
// }[];

// Get sales data and order summary
export async function getOrderSummary() {
  // Get counts for each resource
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  // Calculate the total sales
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });

  // Get monthly sales
  const salesDataRaw = await prisma.$queryRaw(Prisma.sql`
    SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" 
    FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')
  `);

  // Convert sales data to the desired format
  const salesData = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  // Get latest sales
  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true } },
    },
    take: 6,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  };
}

// Get all orders
export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
  query,
}) {
  const queryFilter =
    query && query !== 'all'
      ? {
          user: {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
        }
      : {};

  const data = await prisma.Order.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
    include: { user: { select: { name: true } } },
  });

  const dataCount = await prisma.Order.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete an order
export async function deleteOrder(id) {
  try {
    await prisma.order.delete({ where: { id } });

    revalidatePath('/admin/orders');

    return {
      success: true,
      message: 'Order deleted successfully',
    };
  } catch (error) {
    return { success: false, message: error.message};
  }
}

// Update COD order to paid
export async function updateOrderToPaidCOD(orderId) {
  try {
    await updateOrderToPaid({ orderId });

    revalidatePath(`/order/${orderId}`);

    return { success: true, message: 'Order marked as paid' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}


// Update COD order to delivered
export async function deliverOrder(orderId) {
  try {
    console.log("orderId: ", orderId)
    if (!orderId) throw new Error('Order ID is required');
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
    return { success: false, message: error.message };
  }
}