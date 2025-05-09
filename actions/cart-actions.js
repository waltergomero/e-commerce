'use server';

import prisma from "@/prisma/prisma";
import {cookies} from 'next/headers';
import { auth } from '@/auth';
import { cartItemSchema, insertCartSchema, paymentMethodSchema, shippingAddressSchema } from "@/schemas/validation-schemas";
import { convertToPlainObject, round2 } from "@/lib/utils";
import { revalidatePath } from "next/cache";


//calculate cart prices
const calcPrice = (items) => {
    const itemsPrice = round2(
        items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.0825 * itemsPrice),
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
        console.log("newCart: ", newCart);
       // add cart to database
       await prisma.cart.create({ data: newCart});

       //revalidate product page
       revalidatePath(`/product/${product.slug}`);

       return({
        success: true,
        message: `${product.product_name} added to cart.`
        })
        }
    else {
            //check if item already in cart
            const existItem = (cart.items).find((x) => x.productId === item.productId);

            if(existItem){
                //check stock
                if(product.stock < existItem.quantity + 1)
                {
                    throw new Error('Not enough stock');
                }
                // increase quantity
                (cart.items).find((x) => x.productId === item.productId).quantity = existItem.quantity + 1;
                }
            else {
                //check stock
                if(product.stock < 1) throw new Error('Not enough stock')

                //add item to cart
                cart.items.push(item);
            }
            //save to database
            await prisma.cart.update({
                where: { id: cart.id},
                data: {
                    items: cart.items,
                    ...calcPrice(cart.items)
                }
            });

            //revalidate product page
            revalidatePath(`/product/${product.slug}`);

            return({
                success: true,
                message: `${product.product_name} ${existItem ? 'updated in' : 'added to'} cart.`
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
        where: userId ? {userId: userId} : {sessionCartId: sessionCartId.value}
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

export async function removeItemFromCart(productId) {
    try {
        const sessionCartId = (await cookies()).get('sessionCartId');

        if(!sessionCartId)
            throw new Error('Cart session not found');

        //get Product
        const product = await prisma.product.findFirst({
            where: { id: productId}
        })

        if(!product) throw new Error('Product not found.')
        
        // get user cart
        const cart = await getMyCart();
        if(!cart) throw new Error('Cart not found')
        
        //check for item
        const existItem = (cart.items).find((x) => x.productId === productId);
        if(!existItem) throw new Error('Item not found')
        
        //check and remove if quantity is 1
        if(existItem.quantity===1)
        {
            cart.items = cart.items.filter((x) => x.productId !== existItem.productId);
        }
        else{
            //decrease quantity
            (cart.items).find((x) => x.productId === productId).quantity = existItem.quantity - 1;
        }
       
        //update cart in database
        await prisma.cart.update({
            where: {id : cart.id},
            data: {
                items: cart.items,
                ...calcPrice(cart.items),
            }
        });

        //revalidate product page
        revalidatePath(`/product/${product.slug}`);

        return {
            success: true,
            message: `${product.product_name} was removed from cart`
        };

    } catch (error) {
        return {
            success: false,
            message: error.message,
        }
    }

}


