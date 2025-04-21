import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {fetchUserById, fetchUserByEmailInAccount} from "@/actions/user-actions";

 
export const { auth, handlers, signIn, signOut } = NextAuth({
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

  })