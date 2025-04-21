'use server';

import prisma from "@/prisma/prisma";


export async function AddItemToCart(data) {

    console.log("add to cart: ", data)

    return({
        success: true,
        message: 'Item added to cart.'
    })
    
}