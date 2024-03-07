import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { TransactionList } from '@/types';
import { capitalizeFirstWord, formatDate, toRupiah } from '@/lib/utils';

type Props = {
  transaction: TransactionList;
};
const TransactionCard = ({ transaction }: Props) => {
  return (
    <Card className='flex justify-between items-center shadow-lg w-auto'>
      <div>
        <CardHeader>
          <CardTitle className='text-xl'>{formatDate(transaction.createdAt)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='max-w-[270px] lg:max-w-[600px] truncate'>
            {transaction.products.map((product) => (
              <span key={product.id}>
                {capitalizeFirstWord(product.name)} {product.quantity}x,
              </span>
            ))}
          </p>
          <p className='mt-2 font-semibold'>Total: {toRupiah(transaction.totalPrice)}</p>
        </CardContent>
      </div>
      <CardFooter className='p-6'>
        <Button asChild>
          <Link href={`/transaction/${transaction.id}`}>Detail</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TransactionCard;
