import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase';
import { doc, collection, setDoc, getDocs, DocumentData } from 'firebase/firestore';
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
  const { name, description, price, stock, image } = data;

  const imageRef = ref(storage, `products/${id}`);

  try {
    await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(imageRef);

    await setDoc(doc(db, 'products', id), {
      name,
      description,
      price,
      stock,
      image: imageUrl,
    });
  } catch (error: any) {
    throw Error(error);
  }
};

export const getAllProducts = async () => {
  const data: DocumentData[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  } catch (err) {
    throw Error('Error get data');
  }
};
