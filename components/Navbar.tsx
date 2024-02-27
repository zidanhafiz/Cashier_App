'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logOut } from '@/lib/firebase/authLogin';
import { useSignIn } from '@/context/SignInProvider';

const Navbar = () => {
  return (
    <header>
      <nav className='flex justify-between items-center py-2 px-4 border-b'>
        <Link
          href='/dashboard'
          className='text-xl font-bold'
        >
          Cashier App
        </Link>
        <AccountBtn />
      </nav>
    </header>
  );
};

const AccountBtn = () => {
  const router = useRouter();
  const { user } = useSignIn();

  console.log(user);

  const goToSetting = () => {
    router.push('/settings');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex items-center gap-3 py-3 px-5 border rounded-full'>
        <div className='flex flex-col gap-0 items-end'>
          <span className='text-base font-semibold'>{user?.email}</span>
          <span className='text-xs block text-gray-400'>Admin</span>
        </div>
        <Avatar>
          <AvatarImage src='https://github.com/shadcn.png' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={goToSetting}>Profile</DropdownMenuItem>
        <DropdownMenuItem
          className='text-red-400'
          onClick={logOut}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Navbar;
