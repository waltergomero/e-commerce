import React from 'react';
import ToggleTheme from '@/components/shared/header/toggle-theme'; // Adjust the import path as necessary
import { EllipsisVertical, ShoppingCart, UserIcon } from 'lucide-react';  
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const Menu = () => {
  return (
    <div className='flex justify-end gap-3'> 
    <nav className='hidden md:flex w-full max-w-xs gap-1'>  
          <ToggleTheme/>
          <Button   asChild variant='ghost'>
            <Link href='/cart'>
                    <ShoppingCart/> Cart
            </Link>
          </Button>
          <Button   asChild variant='ghost'>
            <Link href='/signin' className='inline-flex'>
                <UserIcon/> Sign In
            </Link>
          </Button>
        </nav> 
        <nav className='md:hidden'>
          <Sheet>
            <SheetTrigger className='align-middle'>
              <EllipsisVertical/>
            </SheetTrigger>
            <SheetContent className='flex flex-col items-start'>
              <SheetTitle>Menu</SheetTitle>
              <ToggleTheme/>
              <Button asChild variant='ghost'>
                <Link href='/cart'>
                  <ShoppingCart/> Cart
                </Link>
              </Button>
              <Button   asChild variant='ghost'>
                <Link href='/signin' className='inline-flex'>
                    <UserIcon/> Sign In
                </Link>
              </Button>
              <SheetDescription></SheetDescription>
            </SheetContent>
          </Sheet>
        </nav>
    </div>
  )
}

export default Menu