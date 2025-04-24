
import { NextResponse } from "next/server";
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextURL } from "next/dist/server/web/next-url";

const {auth} = NextAuth(authConfig);

export async function middleware(request) {
   const session = await auth();
   const { nextUrl } = request;
   console.log("session: ", session)
   console.log("nextUrl: ", nextUrl)

      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      console.log("isOnDashboard: ", isOnDashboard)
      //  if (isOnDashboard) {
      //   if (isLoggedIn) 
      //     return true;
      //   else 
      //     return false; // Redirect unauthenticated users to login page  
      // } 
       //return true;
}

// import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';

// export default NextAuth(authConfig).auth;

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };