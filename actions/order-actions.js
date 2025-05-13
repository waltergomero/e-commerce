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
                redirectTo: `/cart/order/${insertedOrderId}`}
                
    } catch (error) {
        console.log("error:", error.message)
        return {success: false, message: error.message}
    }
}

//get order by id
export async function getOrderById(orderId) {
    const data = await prisma.order.findFirst({
        where: {id: orderId},
        include: {
            orderitems: true,
            user: {select: {name: true, email:true}}
        }

    })

    return convertToPlainObject(data);
}