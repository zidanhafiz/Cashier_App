'use client';
import Cart from '@/components/Cart';
import DialogModal from '@/components/DialogModal';
import ProductCard from '@/components/ProductCard';
import SearchForm from '@/components/SearchForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAllProducts } from '@/lib/firebase/productService';
import { Product } from '@/types';
import { ShoppingCart } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

const Dashboard = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dialogModal, setDialogModal] = useState<ReactNode>(null);
  const [listChanged, setListChanged] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [openCart, setOpenCart] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const [search, category, sort] = [
    searchParams.get('search') || '',
    searchParams.get('category') || '',
    searchParams.get('sort') || '',
  ];

  const openModalHandle = (product: Product) => {
    setOpenModal(true);
    setDialogModal(
      <DialogModal
        open={openModal}
        setOpen={setOpenModal}
        product={product}
        isDashboard={true}
      />
    );
  };

  useEffect(() => {
    getAllProducts(search, category, sort)
      .then((res) => {
        setProducts(res as Product[]);
      })
      .catch((err) => console.error(err));
  }, [search, category, sort]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) setOpenCart(true);
  }, [isMobile]);

  return (
    <div className='relative'>
      <div className='w-full md:w-fit'>
        <SearchForm path='/dashboard' />
      </div>
      {openModal && dialogModal}
      <div className='grid lg:grid-cols-[1fr,32%] gap-2 content-start'>
        <ScrollArea className='h-[650px] md:h-[750px] mt-4 md:pr-4'>
          <div className='grid grid-cols-2 2xl:grid-cols-4 gap-4 content-start my-4'>
            {products &&
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  detailHandle={() => openModalHandle(product)}
                  setListChanged={setListChanged}
                />
              ))}
          </div>
        </ScrollArea>
        <Cart
          listChanged={listChanged}
          setListChanged={setListChanged}
          openCart={openCart}
        />
      </div>
      {isMobile && (
        <Button
          className='fixed z-20 shadow-lg bottom-24 right-6 w-[80px] h-[80px]'
          onClick={() => setOpenCart(!openCart)}
        >
          <ShoppingCart size={32} />
        </Button>
      )}
    </div>
  );
};

export default Dashboard;
