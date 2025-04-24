import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { authConfig } from './auth.config';
import { userSigninSchema } from "@/schemas/validation-schemas";
import bcryptjs from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import  prisma from "@/prisma/prisma";
import {fetchUserById,} from "@/actions/user-actions";

export const { auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
  ...authConfig,
      providers: [
        Credentials({
          credentials: {
              email: {},
              password: {},
          },
          async authorize(credentials) {
              const validateFields = userSigninSchema.safeParse(credentials);
  
              if (validateFields.error) {
                  throw new Error(validateFields.error.message);
              }
  
              const { email, password, } = credentials;
              console.log("email, password: ", email, password)
              try {         
                 const user = await prisma.User.findFirst({where: {email: email}});
 
                 if(!user.password)
                 {
                  throw new Error("Another account already exists with the same e-mail address. This email was registered with Google app.");
                 }
  
                 if (user) {
                      const isMatch =  await bcryptjs.compare(password, user.password); 
  
                      if (isMatch) {
                          return {
                              id: user.id,
                              email: email
                          };
                      } else {
                          throw new Error("Password is not correct");
                      }
                  } else {
                      throw new Error("User not found");
                  }
              } catch (error) {
                  throw new Error(error);
              }
          },
      }),
      GitHub({
          clientId: process.env.AUTH_GITHUB_ID,
          clientSecret: process.env.AUTH_GITHUB_SECRET,
          // authorization: {
          //     params: {
          //         prompt: "consent",
          //         access_type: "offline",
          //         response_type: "code",
          //     },
          // },
      }),
      Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
          // authorization: {
          //     params: {
          //         prompt: "consent",
          //         access_type: "offline",
          //         response_type: "code",
          //     },
          // },
          
      }),
      ],
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
});