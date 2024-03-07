'use client';
import TransactionCard from '@/components/TransactionCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAllTransaction } from '@/lib/firebase/transactionService';
import { TransactionList } from '@/types';
import { useEffect, useState } from 'react';

const Transaction = () => {
  const [transactionList, setTransactionList] = useState<TransactionList[]>([]);

  useEffect(() => {
    getAllTransaction()
      .then((res) => {
        setTransactionList(res as TransactionList[]);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <ScrollArea className='h-[700px] px-2'>
        <div className='space-y-4'>
          {transactionList.length === 0 ? (
            <p>Transaction empty.</p>
          ) : (
            transactionList.map((data) => (
              <TransactionCard
                key={data.id}
                transaction={data}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Transaction;
