'use client';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { AlertProvider } from '@/context/AlertProvider';
import { useSignIn } from '@/context/SignInProvider';
import { redirect } from 'next/navigation';
import { useLayoutEffect } from 'react';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLogin } = useSignIn();

  useLayoutEffect(() => {
    if (!isLogin) {
      redirect('/');
    }
  }, [isLogin]);

  if (isLogin) {
    return (
      <AlertProvider>
        <div className='h-screen flex flex-col'>
          <Navbar />
          <div className='flex flex-1 flex-col lg:flex-row'>
            <Sidebar />
            <main className='px-4 py-6 order-1 flex-1 bg-slate-200 dark:bg-background'>
              {children}
            </main>
          </div>
        </div>
      </AlertProvider>
    );
  }
}
