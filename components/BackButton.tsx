import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

const BackButton = ({
  children,
  link,
  className,
}: {
  children: ReactNode;
  link: string;
  className?: string;
}) => {
  return (
    <Link
      href={link}
      className={cn(
        className,
        'flex gap-2 text-base items-center text-slate-700 dark:text-slate-300'
      )}
    >
      <ChevronLeft /> {children}
    </Link>
  );
};

export default BackButton;
