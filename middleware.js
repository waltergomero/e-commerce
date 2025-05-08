import { NextResponse } from "next/server";
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import crypto from 'crypto';

// Initialize NextAuth once
const { auth } = NextAuth(authConfig);

export async function middleware(request) {
  // Get sessionCartId from cookies
  let sessionCartId = request.cookies.get('sessionCartId');
  
  if (!sessionCartId) {
    // Generate a new sessionCartId
    sessionCartId = crypto.randomUUID();

    // Clone request headers
    const newRequestHeaders = new Headers(request.headers);

    // Create a new response and set the sessionCartId cookie
    const response = NextResponse.next({
      request: {
        headers: newRequestHeaders,
      },
    });
    response.cookies.set('sessionCartId', sessionCartId);
    return response;
  }

  const { nextUrl } = request;
  const session = await auth();
  const path = nextUrl.pathname;

  // Check if the path is private
  const isPrivatePath = path.startsWith('/cart') || path.startsWith('/dashboard');
  if (isPrivatePath && !session) {
    const redirectUrl = `/signin?redirect_uri=${encodeURIComponent(path)}`;
    return NextResponse.redirect(new URL(redirectUrl, request.url), 302);
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to specific routes
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};


// import { NextResponse } from "next/server";
// import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';
// import crypto from 'crypto';

// const {auth} = NextAuth(authConfig,);

// export default  NextAuth(authConfig) //.auth; 

// export async function middleware(request) {
  
//   //sessionCartId
//   let sessionCartId = request.cookies.get('sessionCartId');
//   if(!sessionCartId) {

//     //generate new session cart id cookie
//     sessionCartId = crypto.randomUUID();
                  
//     //clone the req headers
//     const newrequestHeaders = new Headers(request.headers);
  
//     //create new response and add the new headers
//     const response = NextResponse.next({
//         request: {
//         headers: newrequestHeaders
//         }
//     })
//     // set newly generated sessionCartId int the response cookies
//     response.cookies.set('sessionCartId', sessionCartId);
//     return response;
//   }


//  const {nextUrl} = request;
//  const session =  await auth();
//  const path = nextUrl.pathname;

//  const isPrivatePath = request.nextUrl.pathname.startsWith('/cart') || 
//                        request.nextUrl.pathname.startsWith('/dashboard');
//  if(isPrivatePath)
//  {
//   if(session===null){
//     const redirectUrl = `/signin?redirect_uri=${path}`;
//     return NextResponse.redirect(new URL(redirectUrl, request.url), 302);
//     // return NextResponse.redirect(new URL('/signin', nextUrl))
//   }
//  }
//  return null;

// }

// export const config = {
//   //invoque middleware everywhere
//   matcher: ['/((?!.+\\.[\\w]+$|_next).*)','/', '/(api|trpc)(.*)']
// };

