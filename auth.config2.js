import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcryptjs from "bcryptjs";
import { userSigninSchema } from "@/schemas/validation-schemas";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export default {
callbacks:
  {
    authorized({ auth, request: { nextUrl }}){
        //check for session cart cookies
        if(!request.cookies.get('sessionCartId'))
        {
          //generate new session cart id cookie
          const sessionCartId = crypto.randomUUID();
          
          //clone the req headers
          const newrequestHeaders = new Headers(request.headers);
  
          //create new response and add the new headers
          const response = NextResponse.next({
            request: {
              headers: newrequestHeaders
            }
          })
          // set newly generated sessionCartId int the response cookies
          response.cookies.set('sessionCartId', sessionCartId);
          return response;
        }
        else {
          return true;
        }
      }
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

            const { email, password, dbpassword, id } = credentials;
            
            try {         
               //const user = await prisma.User.findFirst({where: {email: email}});
               if(!dbpassword)
               {
                throw new Error("Another account already exists with the same e-mail address. This email was registered with Google app.");
               }

               if (dbpassword) {
                    const isMatch =  await bcryptjs.compare(password, dbpassword); 

                    if (isMatch) {
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