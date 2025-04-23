import { NextAuthConfig } from 'next-auth';
import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export const authConfig = {
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    authorized({ auth, request: {nextUrl}}) {
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

      // const isLoggedIn = !!auth?.user;
      // const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      // if (isOnDashboard) {
      //   if (isLoggedIn) 
      //     return true;
      //   else 
      //     return false; // Redirect unauthenticated users to login page  
      // } 
      //  return true;
    },
    
  },
  providers: [], // Add providers with an empty array for now
};