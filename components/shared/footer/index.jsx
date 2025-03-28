import React from 'react';
import { APP_NAME } from '@/lib/constants';

const Footer = () => {
    const currentYear = new Date().getFullYear(); // Get the current year
    return (
        <footer className='w-full border-t mt-10'>
            <div className='max-w-7xl lg:mx-auto p-5 md:px-10 w-full text-center'>
                <p className='text-sm text-gray-600'>
                    &copy; {currentYear} {APP_NAME}. All rights reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer