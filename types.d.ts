import { Timestamp } from 'firebase/firestore';

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  stock: number;
  price: number;
  image: string;
  createdAt: Timestamp;
};

type ProductCart = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
  createdAt: Timestamp;
};

type TransactionList = {
  createdAt: Timestamp;
  id: string;
  products: ProductCart[];
  totalPrice: number;
};
