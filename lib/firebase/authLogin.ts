import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';

export const signIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const logOut = () => {
  signOut(auth)
    .then((res) => res)
    .catch((err) => err);
};
