'use server';

import prisma from "@/prisma/prisma";
import {cookies} from 'next/headers';
import { auth } from '@/auth';
import { cartItemSchema, insertCartSchema } from "@/schemas/validation-schemas";
import { convertToPlainObject, round2 } from "@/lib/utils";
import { revalidatePath } from "next/cache";


//calculate cart prices
const calcPrice = (items) => {
    const itemsPrice = round2(
        items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.825 * itemsPrice),
    totalPrice = round2( itemsPrice + taxPrice + shippingPrice);

    return {
        itemsPrice: Number(itemsPrice.toFixed(2)),
        shippingPrice: Number(shippingPrice.toFixed(2)),
        taxPrice: Number(taxPrice.toFixed(2)),
        totalPrice: Number(totalPrice.toFixed(2)),
    }

}


export async function AddItemToCart(data) {
     try{
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
    });

    if(!product)
        throw new Error('Product not found')

    if(!cart){
        const newCart = insertCartSchema.parse({
            userId: userId,
            sessionCartId: sessionCartId.value,
            items: [item],
            ...calcPrice([item])
        })

       // add cart to database
       await prisma.cart.create({ data: newCart});

       //revalidate product page
       revalidatePath(`/product/${product.slug}`);

       return({
        success: true,
        message: 'Item added to cart.'
     })
    }
}
catch(error){
    console.log(error.message);
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

    //get cart from database
    const cart = await prisma.cart.findFirst({
        where: userId ? {userId: userId} : {sessionCartId: sessionCartId}
    });
    if(!cart)
        return undefined

    return convertToPlainObject({...cart, 
        items: cart.items,
        itemsPrice: cart.itemsPrice.number(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),

    });

}