import React from 'react';
import ToggleTheme from '@/components/shared/header/toggle-theme'; // Adjust the import path as necessary
import { ShoppingCart, UserIcon } from 'lucide-react';  
import Link from 'next/link';

const Menu = () => {
  return (
    <div className='flex justify-end gap-3'> 
    <nav className='hidden md:flex w-full max-w-xs gap-4'>  
          <ToggleTheme/>
            <Link href='/cart' className='inline-flex pr-4 pt-3'>
                    <ShoppingCart/> Cart
            </Link>
          <button className="bg-gray-900 hover:bg-gray-800 text-white py-1 px-4 border-b-4 border-gray-700 hover:border-gray-500 rounded">
            <Link href='/signin' className='inline-flex'>
                <UserIcon/> Sign In
            </Link>
          </button>
        </nav>  
    </div>
  )
}

export default Menu