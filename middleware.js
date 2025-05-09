import { NextResponse } from "next/server";
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

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

  //define private paths
  const privatePaths = ['/cart', '/dashboard'];

  // Check if the path is private
  const isPrivatePath = privatePaths.some((privatePath) => path.startsWith(privatePath));

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
