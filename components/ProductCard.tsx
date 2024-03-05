'use client';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { capitalizeFirstWord, toRupiah } from '@/lib/utils';
import { Button } from './ui/button';
import { Loader2, Plus } from 'lucide-react';
import { addToCart } from '@/lib/firebase/cartService';
import { Product } from '@/types';
import { Dispatch, MouseEventHandler, SetStateAction, useState } from 'react';

type ProductCardProps = {
  product: Product;
  setListChanged: Dispatch<SetStateAction<string>>;
  detailHandle: MouseEventHandler<HTMLButtonElement>;
};

const ProductCard = ({ product, detailHandle, setListChanged }: ProductCardProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const addToCartHandle = async () => {
    setLoading(true);
    setListChanged('');
    try {
      await addToCart(product);
      setListChanged(product.id);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className='shadow-md rounded-2xl max-h-[400px] h-full flex flex-col'>
      <CardHeader>
        <Image
          className='w-[120px] h-[120px] rounded-lg object-cover mx-auto'
          src={product.image}
          width={300}
          height={300}
          alt={product.name}
        />
      </CardHeader>
      <CardContent>
        <CardTitle className='text-xl'>{capitalizeFirstWord(product.name)}</CardTitle>
        <p className='text-base mt-1'>{toRupiah(product.price)}</p>
      </CardContent>
      <CardFooter className='pb-6 px-1 flex-1 flex flex-col-reverse md:flex-row md:justify-center justify-start gap-1 items-center md:items-end'>
        <Button
          variant='link'
          onClick={detailHandle}
          disabled={loading}
        >
          Detail
        </Button>
        <Button
          className='space-x-1'
          onClick={addToCartHandle}
          disabled={loading}
        >
          {loading ? <Loader2 className='animate-spin' /> : <Plus />}
          <span>Add to Cart</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
