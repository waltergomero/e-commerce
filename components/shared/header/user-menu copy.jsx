
"use client"
import { signOut, useSession } from "next-auth/react";

import Link from 'next/link';
import { signoutUser } from '@/actions/user-actions';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { UserIcon } from '@heroicons/react/24/solid';



const UserMenu =  () => {
  const { data: session } = useSession()
    if(!session){
      return(
        <Button asChild className='default'>
            <Link href='/signin'>
            <UserIcon/>Sign In
            </Link>
        </Button>
      )
    }

  return (
    <div>    
      <Button onClick={() => signOut()}>Sign Out</Button>
      </div>
  )
}

export default UserMenu