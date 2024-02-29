'use client';
import SearchForm from '@/components/SearchForm';
import { Button } from '@/components/ui/button';
import { getAllProducts } from '@/lib/firebase/productService';
import { DocumentData } from 'firebase/firestore';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Products = () => {
  const [products, setProducts] = useState<DocumentData[] | null>(null);

  useEffect(() => {
    getAllProducts()
      .then((res) => setProducts(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className='relative'>
      <SearchForm />
      <h1>Products</h1>
      {products && (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <Image
                src={product.image}
                width={200}
                height={200}
                alt='image'
              />
              <span>{product.name}</span>
              <span>{product.description}</span>
              <span>{product.price}</span>
            </li>
          ))}
        </ul>
      )}
      <Button asChild>
        <Link href='/products/create'>
          <Plus />
        </Link>
      </Button>
    </div>
  );
};

export default Products;
