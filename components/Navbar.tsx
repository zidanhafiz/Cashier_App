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
import { ThemeToggle } from './ThemeToggle';

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
        <div className='flex items-center gap-4 w-fit'>
          <ThemeToggle />
          <AccountBtn />
        </div>
      </nav>
    </header>
  );
};

const AccountBtn = () => {
  const router = useRouter();
  const { user } = useSignIn();

  const goToSetting = () => {
    router.push('/settings');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='grid grid-cols-[1fr,40px] justify-items-end gap-2 py-2 w-fit px-4 border rounded-full'>
        <div className='flex flex-col gap-0 items-end w-full max-w-[100px]'>
          <span className='text-base font-semibold w-full truncate'>
            {user?.displayName}
          </span>
          <span className='text-xs block text-gray-400'>Admin</span>
        </div>
        <Avatar>
          <AvatarImage src={user?.photoURL || ''} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={goToSetting}>Settings</DropdownMenuItem>
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
