'use client';
import BackButton from '@/components/BackButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Separator } from '@/components/ui/separator';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  createProduct,
  getCategories,
  getProductById,
  updateProductById,
  uploadTempImage,
} from '@/lib/firebase/productService';
import { showAlert } from '@/components/Alert';
import { useAlert } from '@/context/AlertProvider';
import { capitalizeFirstWord, showNotify } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DocumentData } from 'firebase/firestore';

const updateAlertMessage = {
  title: 'Update Product',
  description: 'Update this product?',
  cancel: 'Cancel',
  continue: 'Yes',
};

const discardAlertMessage = {
  title: 'Discard Changes',
  description: 'Are you sure to discard this changes?',
  cancel: 'Cancel',
  continue: 'Yes',
};

const formSchema = z.object({
  image: z.union([z.undefined(), z.null(), z.instanceof(File)]),
  name: z.string().min(3).max(30),
  description: z.string().min(3).max(100),
  category: z.string().min(3),
  price: z.number().min(1),
  stock: z.number().min(0),
});

const Edit = () => {
  const [imgUrl, setImgUrl] = useState<string>('/product.png');
  const [newCategory, setNewCategory] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [product, setProduct] = useState<DocumentData>({} as DocumentData);

  const { showAlertHandle } = useAlert();
  const router = useRouter();
  const { id } = useParams();

  const { setValue, ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
      name: '',
      description: '',
      category: '',
      price: 0,
      stock: 0,
    },
  });

  const imgWatch = form.watch('image');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await showAlert(updateAlertMessage, 'save', showAlertHandle);
    try {
      await updateProductById(id as string, values);
      showNotify({
        type: 'success',
        message: 'Success update product!',
      });
      router.push('/products');
    } catch (err) {
      showNotify({
        type: 'error',
        message: 'Failed update product!',
      });
      router.push('/products');
    }
  };

  const resetHandler = async () => {
    showAlert(discardAlertMessage, 'discard', showAlertHandle).then(() => {
      Object.keys(product).forEach((fieldName: any) => {
        if (fieldName !== 'image') return setValue(fieldName, product[fieldName]);
      });
      setImgUrl(product.image);
    });
  };

  useEffect(() => {
    getProductById(id as string)
      .then((res) => {
        setProduct(res);
        setImgUrl(res.image);

        Object.keys(res).forEach((fieldName: any) => {
          if (fieldName !== 'image') return setValue(fieldName, res[fieldName]);
        });
      })
      .catch((err) => console.error(err));

    getCategories()
      .then((res) => {
        setCategories(res);
      })
      .catch((err) => console.error(err));
  }, [id, setValue]);

  useEffect(() => {
    if (imgWatch !== undefined) {
      uploadTempImage(imgWatch as File)
        .then((url) => setImgUrl(url))
        .catch((err) => console.error(err));
    }
  }, [imgWatch]);

  return (
    <Card className=''>
      <CardHeader>
        <BackButton
          link='/products'
          className='mb-3'
        >
          Back to products
        </BackButton>
        <CardTitle>Update Product</CardTitle>
        <CardDescription>Update your current product here.</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className='mt-4 '>
        <Form
          setValue={setValue}
          {...form}
        >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid md:grid-cols-2 md:gap-8'
          >
            <FormField
              control={form.control}
              name='image'
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem className='md:col-start-1'>
                  <Label>Preview</Label>
                  <Image
                    src={imgUrl}
                    width={200}
                    height={200}
                    className='w-[150px] h-[150px] object-cover mx-auto rounded-xl overflow-hidden shadow-lg'
                    alt='profile image'
                  />
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='avatar'
                      type='file'
                      accept='image/png,image/jpeg'
                      onChange={(event) => {
                        event.target.files && onChange(event.target.files[0]);
                      }}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='md:col-start-2 space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Your product name'
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Your product description'
                        className='resize-none'
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>Category</FormLabel>
                <FormField
                  control={form.control}
                  name='category'
                  render={({ field }) => (
                    <FormItem className='pt-2 flex gap-8'>
                      <FormControl>
                        {newCategory ? (
                          <Input
                            className='w-1/2 max-w-[500px]'
                            placeholder='Your product category'
                            disabled={form.formState.isSubmitting}
                            {...field}
                          />
                        ) : (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className='w-1/2 max-w-[500px]'>
                              <SelectTrigger>
                                <SelectValue placeholder='Select category' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem
                                  key={cat}
                                  value={cat}
                                >
                                  {capitalizeFirstWord(cat)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </FormControl>
                      <FormMessage />
                      <div className='flex items-center gap-2'>
                        <Switch
                          id='create-category'
                          checked={newCategory}
                          onCheckedChange={() => setNewCategory(!newCategory)}
                        />
                        <Label htmlFor='create-category'>Create new category</Label>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Your product price'
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='stock'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Stock</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Your product stock'
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex gap-3 pt-6 justify-end'>
                <Button
                  type='reset'
                  className='bg-red-500 hover:bg-red-600 text-white'
                  onClick={resetHandler}
                  disabled={form.formState.isSubmitting}
                >
                  Discard
                </Button>
                <Button
                  type='submit'
                  disabled={form.formState.isSubmitting}
                >
                  Update Product
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Edit;
