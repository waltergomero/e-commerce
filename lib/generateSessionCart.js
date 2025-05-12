import { cookies } from 'next/headers';
import  prisma from "@/prisma/prisma";


export async function generateSessionCart(existingUser){
        const cookiesObject = await cookies();
        const sessionCartId = cookiesObject.get('sessionCartId').value;
        console.log("sessionCartId: ", sessionCartId)
        let sessionCart ='';

        if(sessionCartId){
          try{
            sessionCart = await prisma.cart.findFirst({
              where: {sessionCartId}
            });
          }
          catch(e){
            //console.log("Error fetching session cart: ", e)
            throw new Error("Error fetching session cart: ", e)
          }
          
          console.log("sessioncart: ", sessionCart)
          
          if(sessionCart){
            try {
            //delete current user cart
            await prisma.cart.deleteMany({
              where: {userId: existingUser.id}
            });
          }
            catch(e){
              //console.log("Error deleting user cart: ", e)
              throw new Error("Error deleting user cart: ", e)
            }
            try{
            //asign new cart 
            await prisma.cart.update({
              where: {id: sessionCart.id},
              data: {userId: existingUser.id}
            })
          }
          catch(e){
            //console.log("Error assigning session cart to user: ", e)
            throw new Error("Error updating session cart to user: ", e)  
          } 
        }

      }

}