'use client';
import { useSignIn } from '@/context/SignInProvider';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

const IsAuth = (Component: any) => {
  return function Container(props: any) {
    const { isLogin } = useSignIn();

    useEffect(() => {
      if (isLogin) {
        redirect('/dashboard');
      }
    }, [isLogin]);

    if (!isLogin) {
      return <Component {...props} />;
    }
  };
};

export default IsAuth;
