'use client';
import { Eraser, Loader2, Pencil, Save, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { ProductCart } from '@/types';
import { capitalizeFirstWord, cn, toRupiah } from '@/lib/utils';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { deleteAllCartList, getAllCartList } from '@/lib/firebase/cartService';
import { useAlert } from '@/context/AlertProvider';
import { showAlert } from './Alert';

const clearMessage = {
  title: 'Clear this cart?',
  description: 'Are you sure to delete all of this?',
  cancel: 'Cancel',
  continue: 'Yes',
};

type CartProps = {
  listChanged: string;
  setListChanged: Dispatch<SetStateAction<string>>;
  openCart: boolean;
};

const Cart = ({ listChanged, setListChanged, openCart }: CartProps) => {
  const [cartList, setCartList] = useState<ProductCart[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { showAlertHandle } = useAlert();

  useEffect(() => {
    getAllCartList()
      .then((res) => {
        setCartList(res as ProductCart[]);

        const sum = res.reduce((prev, curr) => prev + curr.totalPrice, 0);
        setTotalPrice(sum);
      })
      .catch((err) => console.error(err));
  }, [listChanged]);

  const clearCartHandle = async () => {
    setLoading(true);

    showAlert(clearMessage, 'discard', showAlertHandle)
      .then(() => {
        return deleteAllCartList(cartList);
      })
      .then(() => {
        setListChanged('');
        setLoading(false);
        setCartList([]);
      })
      .catch((err) => {
        console.error(err);
        setListChanged('');
        setLoading(false);
      });
  };

  if (openCart)
    return (
      <Card className='absolute inset-x-0 -inset-y-4 lg:static lg:h-fit'>
        <CardHeader>
          <CardTitle className='flex gap-4'>
            <ShoppingCart />
            Cart
          </CardTitle>
          <CardDescription className='pt-2'>This is list of your cart</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea
            className={cn(
              cartList.length > 0 ? 'h-[410px] lg:h-[500px]' : 'h-fit',
              'px-2'
            )}
          >
            {cartList.length > 0 ? (
              cartList.map((list) => (
                <CartList
                  key={list.id}
                  productCart={list}
                  listChanged={listChanged}
                />
              ))
            ) : (
              <p className='w-full text-center mt-4 italic'>Empty cart list</p>
            )}
          </ScrollArea>
        </CardContent>
        <Footer
          totalPrice={totalPrice}
          loading={loading}
          cartList={cartList}
          clearCartHandle={clearCartHandle}
        />
      </Card>
    );
};

const CartList = ({
  productCart,
  listChanged,
}: {
  productCart: ProductCart;
  listChanged: string;
}) => {
  const animate = listChanged === productCart.id ? 'animate-show-price' : '';

  return (
    <div className='flex items-center gap-3 w-full border-y py-3'>
      <Button className='p-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white'>
        <Pencil size={18} />
      </Button>
      <span
        className={cn('w-full max-w-[100px] leading-5 text-lg font-semibold', animate)}
      >
        {capitalizeFirstWord(productCart.name)}
      </span>
      <span className={cn('flex-1 text-center', animate)}>{productCart.quantity}x</span>
      <span className={cn('text-lg text-end w-full max-w-[150px]', animate)}>
        {toRupiah(productCart.totalPrice)}
      </span>
    </div>
  );
};

const Footer = ({
  totalPrice,
  clearCartHandle,
  cartList,
  loading,
}: {
  totalPrice: number;
  loading: boolean;
  cartList: ProductCart[];
  clearCartHandle: () => Promise<void>;
}) => {
  return (
    <CardFooter className='flex flex-col gap-8'>
      <div className='flex justify-between w-full text-lg font-semibold'>
        <span>Total:</span>
        <span>{toRupiah(totalPrice)}</span>
      </div>
      <div className='flex justify-center gap-4 w-full'>
        <Button
          className='flex gap-2 text-lg w-1/2 py-6 rounded-lg bg-red-500 hover:bg-red-600 text-white'
          onClick={clearCartHandle}
          disabled={loading || cartList.length === 0}
        >
          {loading ? (
            <Loader2 className='animate-spin' />
          ) : (
            <>
              <Eraser />
              Clear
            </>
          )}
        </Button>
        <Button
          className='flex gap-2 text-lg w-1/2 py-6 rounded-lg'
          disabled={loading || cartList.length === 0}
        >
          {loading ? (
            <Loader2 className='animate-spin' />
          ) : (
            <>
              <Save />
              Save
            </>
          )}
        </Button>
      </div>
    </CardFooter>
  );
};

export default Cart;
