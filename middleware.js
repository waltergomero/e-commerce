
import { NextResponse } from "next/server";
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
//import { NextURL } from "next/dist/server/web/next-url";

const {auth} = NextAuth(authConfig);

export async function middleware(request) {
  let isLoggedIn = false;
  const {nextUrl} = request;

  const session = await auth();
  
  if(session)
    isLoggedIn = true;


  const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
  console.log("isOnDashboard", isOnDashboard)
  if (isOnDashboard) {
      if (isLoggedIn) 
          return Response.redirect(new URL('/dashboard', nextUrl))
        else 
        return Response.redirect(new URL('/signin', nextUrl))
      } 
    return null;
}


export const config = {
  //invoque middleware everywhere
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)','/', '/(api|trpc)(.*)']

};