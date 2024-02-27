'use client';
import { auth } from '@/lib/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface SignInContextType {
  isLogin: boolean;
}

const SignInContext = createContext<SignInContextType | null>(null);

export const useSignIn = () => {
  const context = useContext(SignInContext);
  if (!context) {
    throw new Error('useSignIn must be used within a SignInProvider');
  }
  return context;
};

export const SignInProvider = ({ children }: { children: ReactNode }) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  onAuthStateChanged(auth, (user) => {
    if (user?.uid) {
      return setIsLogin(true);
    }
    return setIsLogin(false);
  });

  useEffect(() => {
    if (isLogin) {
      return router.push('/dashboard');
    }
    if (!isLogin && pathname !== '/forgot-password' && pathname !== '/') {
      return router.push('/');
    }
  }, [isLogin, router, pathname]);

  const value = { isLogin };
  return <SignInContext.Provider value={value}>{children}</SignInContext.Provider>;
};
