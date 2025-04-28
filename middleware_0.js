import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const {auth} = NextAuth(authConfig,);

export async function middleware(request) {

  const {nextUrl} = request;
  const session = await auth();

 const path = nextUrl.pathname;
 const privatePath = ['/dashboard'];
 const isPrivatePath = privatePath.includes(path);


 if(isPrivatePath)
 {
  if(session===null)
      return NextResponse.redirect(new URL('/signin', nextUrl))
 }
 return null;

}

export const config = {
  //invoque middleware everywhere
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)','/', '/(api|trpc)(.*)']
};

//export default  NextAuth(authConfig).auth; 