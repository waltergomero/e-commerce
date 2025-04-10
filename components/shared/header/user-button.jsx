import React from 'react';
import Link from 'next/link';
import { auth } from '@/auth';
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

const UserButton = async () => {
    const session = await auth();

    if(!session){
        <Button asChild>
            <Link href='/signin'>
            <UserIcon/>
            </Link>
        </Button>
    }

  return (
    <div>UserButton</div>
  )
}

export default UserButton