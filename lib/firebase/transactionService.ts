import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { nanoid } from 'nanoid';
import { ProductCart } from '@/types';

type CartData = {
  totalPrice: number;
  products: ProductCart[];
};

export const createTransaction = async (cartData: CartData) => {
  const id = nanoid();
  const createdAt = serverTimestamp();
  const { totalPrice, products } = cartData;

  const data = {
    id,
    createdAt,
    products,
    totalPrice,
  };

  try {
    const docRef = doc(db, 'transaction', id);
    await setDoc(docRef, data);
    return;
  } catch (err) {
    throw Error('Error save transaction!');
  }
};

export const getAllTransaction = async () => {
  try {
    const colRef = collection(db, 'transaction');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const res = await getDocs(q);
    const transactionData: DocumentData[] = [];

    res.forEach((doc) => {
      transactionData.push(doc.data());
    });

    return transactionData;
  } catch (err) {
    throw Error('Error get transaction list!');
  }
};

export const getDetailTransactionById = async (id: string) => {
  try {
    const docRef = doc(db, 'transaction', id);
    const res = await getDoc(docRef);
    const data = res.data();

    return data;
  } catch (err) {
    throw Error('Error get transaction details!');
  }
};
