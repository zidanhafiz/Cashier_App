import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { DocumentData } from 'firebase/firestore';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import { FilePenLine, Trash2 } from 'lucide-react';
import { capitalizeFirstWord, formatDate, toRupiah } from '@/lib/utils';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

type Props = {
  product: DocumentData;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  deleteHandle: (id: string) => void;
};

export default function DialogModal({ product, open, setOpen, deleteHandle }: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <div className='flex flex-col items-center gap-6'>
          <p className='mt-1'>{formatDate(product.createdAt)}</p>
          <Image
            src={product.image}
            width={300}
            height={300}
            alt={product.name}
            className='w-[230px] shadow-lg rounded-xl'
          />
          <div className='flex flex-col text-slate-800 dark:text-white'>
            <div className='flex items-start justify-between gap-8'>
              <h2 className='text-xl font-semibold'>
                {capitalizeFirstWord(product.name)}
              </h2>
              <p className='text-xl font-semibold'>{toRupiah(product.price)}</p>
            </div>
            <Separator
              orientation='horizontal'
              className='my-2'
            />
            <p>{product.description}</p>
            <p className='mt-4'>Category: {capitalizeFirstWord(product.category)}</p>
            <p className='mt-1'>Stock: {product.stock}</p>
          </div>
        </div>
        <div className='flex justify-center gap-4 mt-4'>
          <Button
            size='lg'
            className='flex gap-2 bg-red-500 hover:bg-red-600 text-white'
            onClick={() => deleteHandle(product.id)}
          >
            <Trash2 size={20} /> Delete
          </Button>
          <Button
            size='lg'
            className='flex gap-2 bg-slate-800 hover:bg-slate-700 text-white'
            asChild
          >
            <Link href={`/products/${product.id}`}>
              <FilePenLine size={20} /> Edit
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
