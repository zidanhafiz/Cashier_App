'use client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { DocumentData } from 'firebase/firestore';
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react';
import { FilePenLine, Trash2 } from 'lucide-react';
import { capitalizeFirstWord, formatDate, showNotify, toRupiah } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Input } from './ui/input';
import { deleteCartListById, updateCartList } from '@/lib/firebase/cartService';

type Props = {
  product: DocumentData;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function DialogModalEdit({ product, open, setOpen }: Props) {
  const [quantity, setQuantity] = useState<number>(product.quantity);
  const [newPrice, setNewPrice] = useState<number>(product.totalPrice);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setQuantity(product.quantity);
    setNewPrice(product.totalPrice);
  }, [product]);

  useEffect(() => {
    if (quantity > 0) {
      const sum = quantity * product.price;
      return setNewPrice(sum);
    }
    return setNewPrice(0);
  }, [quantity, product.price]);

  const quantityBtnHandle = (type: 'plus' | 'minus') => {
    if (type === 'plus') {
      return setQuantity(quantity + 1);
    }
    if (quantity > 0) {
      return setQuantity(quantity - 1);
    }
  };

  const deleteHandle = async () => {
    setLoading(true);
    try {
      await deleteCartListById(product.id);
      setLoading(false);
      setOpen(false);
    } catch (err) {
      setLoading(false);
      setOpen(false);
      showNotify({
        type: 'error',
        message: err as string,
      });
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (quantity < 1) {
      setLoading(false);
      return setError('Quantity at least is 1');
    }

    try {
      await updateCartList(product.id, quantity, newPrice);
      setError(null);
      setLoading(false);
      return setOpen(false);
    } catch (err) {
      setLoading(false);
      return setError(err as string);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <div className='flex flex-col items-center gap-6'>
          <p className='mt-1 text-xs'>{formatDate(product.createdAt)}</p>
          <div className='flex flex-col text-slate-800 dark:text-white'>
            <div className='flex items-start justify-between gap-12'>
              <h2 className='text-xl font-semibold'>
                {capitalizeFirstWord(product.name)}
              </h2>
              <p className='text-xl font-semibold'>{toRupiah(newPrice)}</p>
            </div>
            <Separator
              orientation='horizontal'
              className='my-4'
            />
            <p className='text-xs'>Price per item: {toRupiah(product.price)}</p>
            <form
              className='flex gap-4 mt-4'
              onSubmit={onSubmit}
            >
              <Button
                type='button'
                className='p-4'
                onClick={() => quantityBtnHandle('minus')}
                disabled={loading}
              >
                -
              </Button>
              <div>
                <Input
                  type='number'
                  placeholder='Quantity'
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  disabled={loading}
                />
                {error && <span className='text-xs text-red-500'>{error}</span>}
              </div>
              <Button
                type='button'
                className='p-4'
                onClick={() => quantityBtnHandle('plus')}
                disabled={loading}
              >
                +
              </Button>
            </form>
          </div>
        </div>
        <div className='flex justify-center gap-4 mt-6'>
          <Button
            size='lg'
            className='flex gap-2 bg-red-500 hover:bg-red-600 text-white'
            onClick={deleteHandle}
            disabled={loading}
          >
            <Trash2 size={20} /> Delete
          </Button>
          <Button
            size='lg'
            className='flex gap-2 bg-slate-800 hover:bg-slate-700 text-white'
            onClick={onSubmit}
            disabled={loading}
          >
            <FilePenLine size={20} /> Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
