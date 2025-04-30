'use server';

import prisma from "@/prisma/prisma";
import {cookies} from 'next/headers';
import { auth } from '@/auth';


export async function AddItemToCart(data) {
    const session = await auth();
    console.log("session: ", session)
 try{
    //check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId');

    if(!sessionCartId)
        throw new Error('Cart session not found');

    
    const userId = session?.user?.id ? (session.user.id).toString() : undefined;

    console.log({
        sessioncartId: sessionCartId.value, 
        userID: userId
    })


    return({
        success: true,
        message: 'Item added to cart.'
    })
}
catch(error){
    return({
        success: false,
        message: formatError(error)
    })
}
    
}