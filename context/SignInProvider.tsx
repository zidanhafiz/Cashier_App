'use client';
import { auth } from '@/lib/firebase/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface SignInContextType {
  isLogin: boolean;
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user?.uid) {
        setUser(user);
        return setIsLogin(true);
      }
      setUser(null);
      return setIsLogin(false);
    });
  }, []);

  const value = { isLogin, user };
  return <SignInContext.Provider value={value}>{children}</SignInContext.Provider>;
};
