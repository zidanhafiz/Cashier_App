'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from '@/lib/firebase/authLogin';

const formSchema = z.object({
  email: z.string().min(5, {
    message: 'Email must be at least 5 characters.',
  }),
  password: z
    .string()
    .min(5, {
      message: 'Password must be at least 5 characters.',
    })
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/,
      'Password must contain at least one letter, one digit, and be at least 5 characters long'
    ),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { isSubmitting } = form.formState;

  const [error, setError] = useState<boolean>(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await signIn(values.email, values.password);
    if (res) {
      return setError(false);
    }
    return setError(true);
  };

  return (
    <main className='p-5 flex items-center justify-center min-h-screen'>
      <Card className='w-full max-w-md mx-auto'>
        <CardHeader>
          <CardTitle className='mb-2'>Sign In</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='Your email address'
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-red-400' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Your password'
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-red-400' />
                  </FormItem>
                )}
              />
              {error && (
                <p className='text-red-400 text-center'>Invalid email or password</p>
              )}
              <div className='flex justify-around items-center pt-6'>
                <Link
                  href='/forgot-password'
                  className='text-sm opacity-90 hover:underline'
                  aria-disabled={isSubmitting}
                >
                  Forgot password?
                </Link>
                <Button
                  type='submit'
                  size='lg'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Wait' : 'Sign In'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </main>
  );
}
