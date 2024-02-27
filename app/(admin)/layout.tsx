import Navbar from '@/components/Navbar';
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
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
