'use client';
import IsAuth from '@/components/IsAuth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const ForgotPassword = () => {
  return (
    <main className='p-5 flex items-center justify-center min-h-screen'>
      <Card className='w-full max-w-md mx-auto'>
        <CardHeader>
          <Link
            href='/'
            className='opacity-80 mb-4 flex items-center gap-2'
          >
            <ChevronLeft /> Back to login page
          </Link>
          <CardTitle className='mb-4'>Forgot Password</CardTitle>
          <CardDescription>Please contact us if you forgot your password</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href='https://wa.me/6285333416372'>Contact Us</Link>
          </Button>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </main>
  );
};

export default IsAuth(ForgotPassword);
