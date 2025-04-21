import React from 'react';
import SignUpForm from '@/components/auth/signup-form';
import SocialButtons from '@/components/auth/social-buttons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const SignUpPage = async ({searchParams}) => {
  const {callbackUrl} = await searchParams;

  const session = await auth();

  //if (session) return redirect(callbackUrl || "/"); //return to page in the url or to home page

  return (
    <div className='w-full max-w-lg mx-auto rounded-lg'>
        <Card>
          <CardHeader className='space-y-4'>
            <Link href='/' className='flex-center'>
              <Image src='/images/logo.svg' width={50} height={50} alt={`${APP_NAME} logo`} priority={true} />
            </Link>
            <CardTitle className='text-center text-2xl font-bold '>Sign Up</CardTitle>
            <CardDescription className='text-center'><SocialButtons/></CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <SignUpForm/>
          </CardContent>
        </Card>
       
    </div>

  )
}

export default SignUpPage