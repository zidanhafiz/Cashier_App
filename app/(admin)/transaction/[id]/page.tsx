'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useParams } from 'next/navigation';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { TransactionList } from '@/types';
import { getDetailTransactionById } from '@/lib/firebase/transactionService';
import { capitalizeFirstWord, formatDate, toRupiah } from '@/lib/utils';
import BackButton from '@/components/BackButton';

const Detail = () => {
  const [transaction, setTransaction] = useState<TransactionList | null>(null);
  const { id } = useParams();

  useEffect(() => {
    getDetailTransactionById(id as string)
      .then((res) => {
        setTransaction(res as TransactionList);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (transaction)
    return (
      <Card>
        <CardHeader>
          <BackButton
            link='/transaction'
            className='mb-2'
          >
            Back to transaction
          </BackButton>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>{formatDate(transaction.createdAt)}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of your transaction.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className='text-center'>Quantity</TableHead>
                <TableHead className='text-center'>Price</TableHead>
                <TableHead className='text-end'>Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transaction.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className='font-medium'>
                    {capitalizeFirstWord(product.name)}
                  </TableCell>
                  <TableCell className='text-center'>{product.quantity}</TableCell>
                  <TableCell className='text-center'>{toRupiah(product.price)}</TableCell>
                  <TableCell className='text-end'>
                    {toRupiah(product.totalPrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className='text-right'>
                  {toRupiah(transaction.totalPrice)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    );
};

export default Detail;
