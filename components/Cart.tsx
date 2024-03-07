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
import { capitalizeFirstWord, cn, showNotify, toRupiah } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { deleteAllCartList } from '@/lib/firebase/cartService';
import { useAlert } from '@/context/AlertProvider';
import { showAlert } from './Alert';
import DialogModalEdit from './DialogModalEdit';
import { DocumentData, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { createTransaction } from '@/lib/firebase/transactionService';

const clearMessage = {
  title: 'Clear Cart',
  description: 'Are you sure to delete all of this?',
  cancel: 'Cancel',
  continue: 'Yes',
};

const saveMessage = {
  title: 'Save Transaction',
  description: 'Are you sure to save this transaction?',
  cancel: 'Cancel',
  continue: 'Yes',
};

type CartProps = {
  listChanged: string;
  openCart: boolean;
};

const Cart = ({ listChanged, openCart }: CartProps) => {
  const [cartList, setCartList] = useState<ProductCart[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [productEdit, setProductEdit] = useState<ProductCart | null>(null);

  const { showAlertHandle } = useAlert();

  useEffect(() => {
    const colRef = collection(db, 'cart');
    const q = query(colRef, orderBy('createdAt', 'asc'));

    onSnapshot(
      q,
      (docs) => {
        const data: DocumentData[] = [];
        docs.forEach((doc) => {
          data.push(doc.data());
        });
        setCartList(data as ProductCart[]);
        const sum = data.reduce((prev, curr) => prev + curr.totalPrice, 0);
        setTotalPrice(sum);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  const clearCartHandle = async () => {
    setLoading(true);

    showAlert(clearMessage, 'discard', showAlertHandle)
      .then(() => {
        return deleteAllCartList(cartList);
      })
      .then(() => {
        setTotalPrice(0);
        setLoading(false);
        setCartList([]);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const saveCartHandle = async () => {
    setLoading(true);

    const data = {
      totalPrice,
      products: cartList,
    };

    showAlert(saveMessage, 'save', showAlertHandle)
      .then(() => {
        return createTransaction(data);
      })
      .then(() => {
        return deleteAllCartList(cartList);
      })
      .then(() => {
        setLoading(false);
        showNotify({
          type: 'success',
          message: 'Transaction success!',
        });
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const showDialogModalEdit = (productEdit: ProductCart) => {
    setProductEdit(productEdit);
    setOpen(true);
  };

  if (openCart)
    return (
      <Card className='absolute inset-x-0 -inset-y-4 lg:static lg:h-fit'>
        {productEdit && (
          <DialogModalEdit
            product={productEdit}
            open={open}
            setOpen={setOpen}
          />
        )}
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
                  showDialogModalEdit={showDialogModalEdit}
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
          saveCartHandle={saveCartHandle}
        />
      </Card>
    );
};

const CartList = ({
  productCart,
  listChanged,
  showDialogModalEdit,
}: {
  showDialogModalEdit: (productEdit: ProductCart) => void;
  productCart: ProductCart;
  listChanged: string;
}) => {
  const animate = listChanged === productCart.id ? 'animate-show-price' : '';

  return (
    <div className='flex items-center gap-3 w-full border-y py-3'>
      <Button
        className='p-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white'
        onClick={() => showDialogModalEdit(productCart)}
      >
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
  saveCartHandle,
  cartList,
  loading,
}: {
  totalPrice: number;
  loading: boolean;
  cartList: ProductCart[];
  clearCartHandle: () => Promise<void>;
  saveCartHandle: () => Promise<void>;
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
          onClick={saveCartHandle}
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
