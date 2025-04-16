
import Link from 'next/link';
import { signoutUser } from '@/actions/user-actions';
import { auth } from '@/auth';
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


const UserMenu = async () => {
  const session  = await auth();
  console.log("session: ", session)

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
    <div>User Button</div>
  )
}

export default UserMenu