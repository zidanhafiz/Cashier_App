import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Bounce, toast } from 'react-toastify';

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
