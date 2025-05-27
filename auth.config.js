
import bcryptjs from "bcryptjs";
import Credentials from 'next-auth/providers/credentials';
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { userSigninSchema } from "@/schemas/validation-schemas";

const ERROR_MESSAGES = {
  EMAIL_EXISTS: "Another account already exists with the same e-mail address. This email was registered with Google app.",
  PASSWORD_INCORRECT: "Password is not correct",
  USER_NOT_FOUND: "User not found",
};


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
          try {         
             if(!dbpassword)
             {
              throw new Error(ERROR_MESSAGES.EMAIL_EXISTS);
             }

             if (dbpassword) {
                  const isMatch =  await bcryptjs.compare(password, dbpassword); 

                  if (isMatch) {
                      return {                    
                          id: id,
                          email: email
                      };
                  } 
                  else {
                      throw new Error(ERROR_MESSAGES.PASSWORD_INCORRECT);
                  }
              } else {
                  throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
              }
          } catch (error) {
              throw new Error(error);
          }
      },
  }),
  GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
  }),
  Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,  
  }),
  ],
};