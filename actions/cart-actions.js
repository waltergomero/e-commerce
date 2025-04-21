'use server';

import prisma from "@/prisma/prisma";


export async function AddItemToCart(data) {

    return({
        success: true,
        message: 'Item added to cart.'
    })
    
}