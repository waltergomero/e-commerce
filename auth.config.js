import { NextAuthConfig } from 'next-auth';
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import Credentials from 'next-auth/providers/credentials';
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { userSigninSchema } from "@/schemas/validation-schemas";

export const authConfig = {
  pages: {
    signIn: '/signin',
  },
  providers: [
    Credentials({
      credentials: {
          email: {},
          password: {},
          dbpassword:{},
          id:{},
      },
      async authorize(credentials) {
          const validateFields = userSigninSchema.safeParse(credentials);

          if (validateFields.error) {
              throw new Error(validateFields.error.message);
          }

          const { email, password, dbpassword, id} = credentials;
          console.log("email, password: ", email, password, dbpassword, id)
          try {         
            // const user = await prisma.User.findFirst({where: {email: email}});

             if(!dbpassword)
             {
              throw new Error("Another account already exists with the same e-mail address. This email was registered with Google app.");
             }

             if (dbpassword) {
                  const isMatch =  await bcryptjs.compare(password, dbpassword); 

                  if (isMatch) {
                    console.log("match id: ", id)
                      return {                    
                          id: id,
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
};