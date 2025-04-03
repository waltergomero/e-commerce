import NextAuth from "next-auth";
import authConfig from "./auth.config";
//import {fetchUserById, fetchUserByEmailInAccount} from "@/actions/user-actions";
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
    ...authConfig,
  pages: {
    signIn: "/login",
    signOut: "/",
    signIn: "/error",
  },
  callbacks: {
    async session({ session, user, trigger, token }) {
      session.user.id = token.sub;
      session.user.first_name = token.first_name;
      session.user.last_name = token.last_name;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.isadmin = token.isadmin;
      session.user.provider = token.provider;

      //if there is an update, set the user name
      if(trigger === 'update'){
        session.user.name = user.name;
      }
  
      return session;
    },
    
  },
 
  
  })