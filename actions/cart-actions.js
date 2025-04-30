'use server';

import prisma from "@/prisma/prisma";
import {cookies} from 'next/headers';
import { auth } from '@/auth';
import { cartItemSchema } from "@/schemas/validation-schemas";
import { convertToPlainObject, round2 } from "@/lib/utils";


//calculate cart prices
const calcPrice = (items) => {
    const itemsPrice = round2(
        items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 100),
    taxPrice = round2(0.825 * itemsPrice),
    totalPrice = round2( itemsPrice + taxPrice + shippingPrice)
}


export async function AddItemToCart(data) {
     try{
        //console.log("data: ", data)
    //check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId');

    if(!sessionCartId)
        throw new Error('Cart session not found');

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id).toString() : undefined;

    const cart = await getMyCart();

    const item = cartItemSchema.parse(data);

    //find product in database
    const product = await prisma.product.findFirst({
        where: { id: item.productId}
    })

    console.log({
        'sessioncartId': sessionCartId.value, 
        'userID': userId,
        'item requested': item,
        'found product': product,
    })


    return({
        success: true,
        message: 'Item added to cart.'
    })
}
catch(error){
    return({
        success: false,
        message: (error.message)
    })
}
    
}

export async function getMyCart() {
    
    const sessionCartId = (await cookies()).get('sessionCartId');

    if(!sessionCartId)
        throw new Error('Cart session not found');

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id).toString() : undefined;

    console.log({
        'sessioncartId-func': sessionCartId.value, 
        'userID-func': userId
    })
    //get cart from database
    const cart = await prisma.cart.findFirst({
        where: userId ? {userId: userId} : {sessionCartId: sessionCartId}
    });
    if(!cart)
        return undefined

    return convertToPlainObject({...cart, 
        items: cart.items,
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),

    });

}