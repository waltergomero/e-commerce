import { NextResponse } from "next/server";
import { NextAuthConfig } from 'next-auth';


export default function GenerateCartCookie(request){

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
