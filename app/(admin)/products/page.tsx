'use client';
import SearchForm from '@/components/SearchForm';
import { Button } from '@/components/ui/button';
import { deleteProductById, getAllProducts } from '@/lib/firebase/productService';
import { DocumentData } from 'firebase/firestore';
import { Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import DialogModal from '@/components/DialogModal';
import { capitalizeFirstWord, showNotify, toRupiah } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { useAlert } from '@/context/AlertProvider';
import { showAlert } from '@/components/Alert';
import { useSearchParams } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';

type CheckedItem = {
  id: string;
  checked: boolean;
};

const deleteMessage = (itemsLength?: number) => {
  const title = itemsLength ? `Delete ${itemsLength} products?` : 'Delete this product?';

  return {
    title,
    description: 'Are you sure?',
    cancel: 'Cancel',
    continue: 'Yes',
  };
};

const Products = () => {
  const [products, setProducts] = useState<DocumentData[] | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dialogModal, setDialogModal] = useState<ReactNode>(null);
  const [checkedItems, setCheckedItems] = useState<CheckedItem[]>([]);
  const [isSelect, setIsSelect] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const [search, category, sort] = [
    searchParams.get('search') || '',
    searchParams.get('category') || 'all',
    searchParams.get('sort') || 'asc',
  ];

  const { showAlertHandle } = useAlert();

  const checkedItemsLength = checkedItems.filter((item) => item.checked).length;

  // Fetch function for get all products
  const fetch = async (search: string, category: string, sort: string) => {
    try {
      const res = await getAllProducts(search, category, sort);
      setProducts(res);
      const items = res.map((data) => ({ id: data.id, checked: false }));
      setCheckedItems(items);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetching and set products state
  useEffect(() => {
    fetch(search, category, sort);
  }, [search, category, sort]);

  // Effect for mobile or desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function for trigger dialog modal for each product list
  const openModalHandle = (product: DocumentData) => {
    setOpenModal(true);
    setDialogModal(
      <DialogModal
        open={openModal}
        setOpen={setOpenModal}
        product={product}
        deleteHandle={deleteButtonHandle}
        isDashboard={false}
      />
    );
  };

  // Function for toggling isSelect state
  const setSelectHandle = () => {
    setIsSelect(!isSelect);
  };

  // Function or handler for delete button on dialog modal
  const deleteButtonHandle = async (id: string) => {
    await showAlert(deleteMessage(), 'discard', showAlertHandle);

    try {
      await deleteProductById(id);
      showNotify({
        type: 'success',
        message: 'Product Deleted!',
      });

      // Refetch products again
      fetch(search, category, sort);
    } catch (err) {
      showNotify({
        type: 'error',
        message: err as string,
      });
      console.error(err);
    }
  };

  // Function or handler for deleting selected products
  const deleteSelectedProducts = async () => {
    if (checkedItemsLength > 0) {
      await showAlert(deleteMessage(checkedItemsLength), 'discard', showAlertHandle);

      checkedItems.map(async (item) => {
        if (item.checked) {
          try {
            await deleteProductById(item.id);

            // Refetch products again
            fetch(search, category, sort);
          } catch (err) {
            console.error(err);
            showNotify({
              type: 'error',
              message: `Error delete product ${item.id}`,
            });
          }
        }
      });

      showNotify({
        type: 'success',
        message: `Products deleted!`,
      });
    }
  };

  const checkAllProductsHandle = () => {
    setSelectAll(!selectAll);
    setCheckedItems((prevState) => {
      return prevState.map((item) => {
        return { ...item, checked: !selectAll };
      });
    });
  };

  const checkedItemsHandle = (id: string) => {
    setSelectAll(false);
    setCheckedItems((prevState) => {
      return prevState.map((item) => {
        if (item.id === id) {
          return { ...item, checked: !item.checked };
        }
        return item;
      });
    });
  };

  if (isMobile)
    return (
      <div className='relative'>
        <SearchForm path='/products' />
        {openModal && dialogModal}
        <Card className='mt-6'>
          <div className='flex justify-between px-4 py-3'>
            <Button
              variant='link'
              onClick={setSelectHandle}
            >
              Select
            </Button>
            <Button
              className='bg-red-500 hover:bg-red-600 text-white space-x-2 rounded-lg'
              onClick={deleteSelectedProducts}
              disabled={checkedItemsLength === 0}
            >
              <Trash2 size={18} />
              <span>Delete</span>
            </Button>
          </div>
          <ScrollArea className='h-[540px]'>
            <Table>
              <TableHeader>
                <TableRow>
                  {isSelect ? (
                    <TableHead className='text-center'>
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={checkAllProductsHandle}
                      />
                    </TableHead>
                  ) : (
                    <TableHead className='text-center'>No</TableHead>
                  )}
                  <TableHead className=''>Product</TableHead>
                  <TableHead className='text-right'>Stock</TableHead>
                  <TableHead className='text-right'>Price</TableHead>
                  <TableHead className='text-center'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products &&
                  products.map((product, i) => (
                    <TableRow key={product.id}>
                      {isSelect ? (
                        <TableCell className='font-medium text-center'>
                          <Checkbox
                            checked={checkedItems[i].checked}
                            onCheckedChange={() => {
                              checkedItemsHandle(product.id);
                            }}
                          />
                        </TableCell>
                      ) : (
                        <TableCell className='text-center'>{i + 1}</TableCell>
                      )}
                      <TableCell className='w-40'>
                        {capitalizeFirstWord(product.name)}
                      </TableCell>
                      <TableCell className='text-right'>{product.stock}</TableCell>
                      <TableCell className='text-right'>
                        {toRupiah(product.price)}
                      </TableCell>
                      <TableCell>
                        <Button
                          className='w-fit p-3 rounded-lg text-white bg-slate-800 hover:bg-slate-700'
                          onClick={() => openModalHandle(product)}
                        >
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </ScrollArea>
          <div className='text-center w-full p-4'>Page 1</div>
        </Card>

        <Button
          asChild
          className='fixed z-20 shadow-lg bottom-24 right-6 w-[80px] h-[80px]'
        >
          <Link href='/products/create'>
            <Plus size={56} />
          </Link>
        </Button>
      </div>
    );

  // Desktop view
  return (
    <div>
      <div className='flex gap-8 justify-between'>
        <SearchForm path='products' />
        <Button
          asChild
          className='shadow-lg space-x-2 rounded-lg'
        >
          <Link href='/products/create'>
            <Plus size={24} /> <span>Add Product</span>
          </Link>
        </Button>
      </div>
      {openModal && dialogModal}
      <Card className='mt-6'>
        <div className='flex justify-between px-4 py-3'>
          <Button
            variant='link'
            onClick={setSelectHandle}
          >
            Select
          </Button>
          <Button
            className='bg-red-500 hover:bg-red-600 text-white space-x-2 rounded-lg'
            onClick={deleteSelectedProducts}
            disabled={checkedItemsLength === 0}
          >
            <Trash2 size={18} />
            <span>Delete</span>
          </Button>
        </div>
        <ScrollArea className='h-screen max-h-[600px] w-full'>
          <Table>
            <TableHeader>
              <TableRow>
                {isSelect ? (
                  <TableHead className='text-center'>
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={checkAllProductsHandle}
                    />
                  </TableHead>
                ) : (
                  <TableHead className='text-center'>No</TableHead>
                )}
                <TableHead className=''>Product</TableHead>
                <TableHead className=''>Description</TableHead>
                <TableHead className='w-40'>Category</TableHead>
                <TableHead className='text-right'>Stock</TableHead>
                <TableHead className='text-right'>Price</TableHead>
                <TableHead className='text-center'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products &&
                products.map((product, i) => (
                  <TableRow key={product.id}>
                    {isSelect ? (
                      <TableCell className='font-medium text-center'>
                        <Checkbox
                          checked={checkedItems[i].checked}
                          onCheckedChange={() => {
                            checkedItemsHandle(product.id);
                          }}
                        />
                      </TableCell>
                    ) : (
                      <TableCell className='text-center'>{i + 1}</TableCell>
                    )}
                    <TableCell className=''>
                      {capitalizeFirstWord(product.name)}
                    </TableCell>
                    <TableCell className=''>{product.description}</TableCell>
                    <TableCell className='w-40'>
                      {capitalizeFirstWord(product.category)}
                    </TableCell>
                    <TableCell className='text-right'>{product.stock}</TableCell>
                    <TableCell className='text-right'>
                      {toRupiah(product.price)}
                    </TableCell>
                    <TableCell className='text-center space-x-2'>
                      <Button
                        className='w-fit p-3 rounded-lg text-white bg-slate-800 hover:bg-slate-700'
                        onClick={() => openModalHandle(product)}
                      >
                        Detail
                      </Button>
                      <Button
                        className='w-fit p-3 rounded-lg text-white bg-red-500 hover:bg-red-600'
                        onClick={() => deleteButtonHandle(product.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <div className='p-4 w-full text-center'>Page 1</div>
      </Card>
    </div>
  );
};

export default Products;
