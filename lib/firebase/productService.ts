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
  query,
  orderBy,
  OrderByDirection,
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
      name: name.toLowerCase(),
      description,
      category: category.toLowerCase(),
      price,
      stock,
      image: imageUrl,
      createdAt: serverTimestamp(),
    });
  } catch (error: any) {
    throw Error(error);
  }
};

export const getAllProducts = async (search: string, category: string, sort: string) => {
  const getSortQuery = (): [string, OrderByDirection] => {
    if (sort === 'asc') {
      return ['name', 'asc'];
    } else if (sort === 'desc') {
      return ['name', 'desc'];
    } else if (sort === 'highest') {
      return ['price', 'desc'];
    } else {
      return ['price', 'asc'];
    }
  };

  const sortValue = getSortQuery();
  const categoryValue = category === 'all' ? '' : category;

  const col = collection(db, 'products');

  const q = query(col, orderBy(sortValue[0], sortValue[1]));

  try {
    const data: DocumentData[] = [];
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    const nameFiltered = data.filter((item) => item.name.includes(search));

    return nameFiltered.filter((item) => item.category.includes(categoryValue));
  } catch (err) {
    throw Error('Error get data');
  }
};

export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const categoriesSet = new Set(); // Create a Set to store unique categories

    querySnapshot.forEach((doc) => {
      categoriesSet.add(doc.data().category); // Add category to the Set
    });
    const categories = Array.from(categoriesSet); // Convert Set to array

    return categories as string[];
  } catch (error) {
    throw Error('Error get categories');
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
