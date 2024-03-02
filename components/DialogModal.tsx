import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { DocumentData } from 'firebase/firestore';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import { FilePenLine, Trash2 } from 'lucide-react';
import { toRupiah } from '@/lib/utils';
import Link from 'next/link';

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
        <DialogDescription className='flex flex-col items-center gap-6'>
          <Image
            src={product.image}
            width={300}
            height={300}
            alt={product.name}
            className='w-[230px] shadow-lg rounded-xl'
          />
          <div className='flex flex-col'>
            <div className='flex items-start gap-20'>
              <div>
                <h2 className='text-xl text-slate-800 dark:text-white font-semibold'>
                  {product.name}
                </h2>
                <p>{product.description}</p>
              </div>
              <p className='text-xl text-slate-800 dark:text-white font-semibold'>
                {toRupiah(product.price)}
              </p>
            </div>
            <p className='mt-2'>Stock : {product.stock}</p>
          </div>
        </DialogDescription>
        <DialogFooter className='mt-6 flex flex-row justify-center gap-4'>
          <Button
            size='lg'
            className='flex gap-2 bg-red-500 hover:bg-red-600 text-white'
            onClick={() => deleteHandle(product.id)}
          >
            <Trash2 size={20} /> Delete
          </Button>
          <Button
            size='lg'
            className='flex gap-2'
            variant='outline'
            asChild
          >
            <Link href={`/products/${product.id}`}>
              <FilePenLine size={20} /> Edit
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
