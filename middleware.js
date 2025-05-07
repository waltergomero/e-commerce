
import { NextResponse } from "next/server";
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

const {auth} = NextAuth(authConfig,);

export default  NextAuth(authConfig).auth; 

export async function middleware(request) {
  
  //sessionCartId
  const sessionCartId = request.cookies.get('sessionCartId');
  if(!sessionCartId) {

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


  const {nextUrl} = request;
  const session =  await auth();

 const path = nextUrl.pathname;
 const privatePath = ['/dashboard/:path*', '/cart/:path*'];
 const isPrivatePath = privatePath.includes(path);
console.log("path: ", path)
console.log("isPrivatePath: ", isPrivatePath)

const _private = privatePath.some((p) => p.test(path));

console.log("_private: ", _private);

 if(isPrivatePath)
 {
  if(session===null){
    const redirectUrl = `/signin?redirect_uri=${path}`;
    return Response.redirect(new URL(redirectUrl, request.url), 302);
    // return NextResponse.redirect(new URL('/signin', nextUrl))
  }
 }
 return null;

}

export const config = {
  //invoque middleware everywhere
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)','/', '/(api|trpc)(.*)']
};

