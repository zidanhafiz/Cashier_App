'use client';
import { cn } from '@/lib/utils';
import { ArrowLeftRight, Home, PackageOpen, Settings2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const sideList = [
  {
    name: 'Dashboard',
    link: '/dashboard',
    icon: () => <Home />,
  },
  {
    name: 'Products',
    link: '/products',
    icon: () => <PackageOpen />,
  },
  {
    name: 'Transaction',
    link: '/transaction',
    icon: () => <ArrowLeftRight />,
  },
  {
    name: 'Settings',
    link: '/settings',
    icon: () => <Settings2 />,
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className='h-fit text-base p-2 text-slate-700 dark:text-gray-200 order-2 border-t'>
        <ul className='flex justify-around'>
          {sideList.map((list) => (
            <li key={list.name}>
              <Link
                href={list.link}
                className={cn(
                  pathname === list.link && 'bg-primary text-white dark:text-black',
                  'flex flex-col gap-2 items-center transition hover:bg-primary hover:text-white dark:hover:text-black py-3 px-5 w-[100px] rounded-full'
                )}
              >
                {list.icon()}
                <span className='text-xs'> {list.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className='max-w-[270px] w-full text-base py-6 px-4 text-slate-700 dark:text-gray-200 border-r'>
      <ul className='flex flex-col gap-4'>
        {sideList.map((list) => (
          <li key={list.name}>
            <Link
              href={list.link}
              className={cn(
                pathname === list.link && 'bg-primary text-white dark:text-black',
                'flex gap-4 items-center transition hover:bg-primary hover:text-white dark:hover:text-black p-4 rounded-full'
              )}
            >
              {list.icon()} {list.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
