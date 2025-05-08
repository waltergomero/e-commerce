import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { PrismaAdapter } from "@auth/prisma-adapter";
import  prisma from "@/prisma/prisma";
import {fetchUserById,} from "@/actions/user-actions";
import { cookies } from 'next/headers';

export const {handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  pages: {
    signIn: "/signin",
    signOut: "/",
    error: "/signin",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if(!token.sub) 
        return token;

      const existingUser = await fetchUserById(token.sub)

      if(!existingUser) 
        return token;
  
      token.first_name = existingUser.first_name || "";
      token.last_name = existingUser.last_name || "";
      token.name = existingUser.name;
      token.isadmin = existingUser.isadmin || false;

      if(trigger === 'signIn' || trigger === 'signUp') {
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

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.first_name = token.first_name;
      session.user.last_name = token.last_name;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.isadmin = token.isadmin;
      return session;
    },  
  },
});