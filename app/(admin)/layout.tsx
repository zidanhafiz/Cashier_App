import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cashier App | Admin',
  description: 'The application to manage your sales.',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='h-screen flex flex-col'>
      <Navbar />
      <div className='flex flex-1 flex-col md:flex-row'>
        <Sidebar />
        <main className='px-4 py-6 order-1 flex-1 bg-slate-200 dark:bg-background'>
          {children}
        </main>
      </div>
    </div>
  );
}
