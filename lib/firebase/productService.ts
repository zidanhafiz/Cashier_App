import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase';
import {
  doc,
  collection,
  setDoc,
  getDocs,
  DocumentData,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';

export const uploadTempImage = async (image: File) => {
  const tempRef = ref(storage, `products/temp/image`);

  try {
    await uploadBytes(tempRef, image);
    const url = await getDownloadURL(tempRef);
    return url;
  } catch (error: any) {
    throw Error(error);
  }
};

export const createProduct = async (data: DocumentData) => {
  const id = nanoid();
  const { name, description, category, price, stock, image } = data;

  const imageRef = ref(storage, `products/${id}`);

  try {
    await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(imageRef);

    await setDoc(doc(db, 'products', id), {
      name,
      description,
      category,
      price,
      stock,
      image: imageUrl,
      createdAt: serverTimestamp(),
    });
  } catch (error: any) {
    throw Error(error);
  }
};

export const getAllProducts = async () => {
  const data: DocumentData[] = [];
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    snapshot.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
    });
    return data;
  } catch (err) {
    throw Error('Error get data');
  }
};

export const deleteProductById = async (id: string) => {
  const imageRef = ref(storage, `products/${id}`);

  try {
    await deleteDoc(doc(db, 'products', id));
    await deleteObject(imageRef);
    return;
  } catch (err) {
    throw Error('Error delete product');
  }
};
