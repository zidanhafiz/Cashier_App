import { Product, ProductCart } from '@/types';
import {
  DocumentData,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export const getAllCartList = async () => {
  const colRef = collection(db, 'cart');
  const q = query(colRef, orderBy('createdAt', 'asc'));

  try {
    const products: DocumentData[] = [];
    const res = await getDocs(q);
    res.forEach((data) => {
      products.push(data.data());
    });
    return products;
  } catch (err) {
    throw Error('Error get cart list');
  }
};

export const addToCart = async (product: Product) => {
  const { id, name, price } = product;
  const cartList = await getAllCartList();

  const docRef = doc(db, 'cart', id);

  if (cartList.length > 0) {
    const sameCart = cartList.find((list) => list.id === id);

    if (sameCart !== undefined) {
      try {
        const newQt = sameCart.quantity + 1;
        await updateDoc(docRef, {
          quantity: newQt,
          totalPrice: sameCart.price * newQt,
        });
        return;
      } catch (err) {
        throw Error('Error add cart to cart');
      }
    }
  }

  try {
    await setDoc(docRef, {
      id,
      name,
      price,
      quantity: 1,
      totalPrice: price,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    throw Error('Error add product to cart');
  }
};

export const deleteAllCartList = async (productCart: ProductCart[]) => {
  productCart.forEach(async (product) => {
    try {
      const docRef = doc(db, 'cart', product.id);
      await deleteDoc(docRef);
      return;
    } catch (err) {
      throw Error(`Error delete item with id: ${product.id}`);
    }
  });
};
