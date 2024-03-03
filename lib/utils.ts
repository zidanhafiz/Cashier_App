import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Bounce, toast } from 'react-toastify';
import { Timestamp } from 'firebase/firestore';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ShowNotify = {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
};

export const showNotify = ({ type, message }: ShowNotify) => {
  toast[type](message, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
    transition: Bounce,
  });
};
export const toRupiah = (number: number) => {
  return number.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
};

export const formatDate = (timestamp: Timestamp) => {
  const date = timestamp.toDate();
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const capitalizeFirstWord = (str: string) => {
  return str.replace(/\b\w/g, (char) => {
    return char.toUpperCase();
  });
};
