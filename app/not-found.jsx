'use client';

import React from 'react';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';


const NotFoundPage = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800'>
        <Image
        src='/images/logo.svg'
        alt={`${APP_NAME} Logo`}
        width={48}
        height={48}
        priority={true}/>
        <div className='p-6 w-1/3 rounded-lg shadow-md text-center'>
        <h1 className='text-3xl font-bold mb-4'>Page Not Found</h1>
        <p className='text-destructive text-lg mb-4'>Could not find requested Page </p>
        <Link href='/' className='text-blue-500 hover:text-blue-700 ml-2'>
            Return To Home Page</Link>      
        </div>
    </div>
  )
}

export default NotFoundPage