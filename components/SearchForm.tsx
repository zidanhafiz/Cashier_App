'use client';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCategories } from '@/lib/firebase/productService';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { useRouter } from 'next/navigation';
import { capitalizeFirstWord } from '@/lib/utils';

const FormSchema = z.object({
  search: z.string(),
  category: z.string(),
  sort: z.string(),
});

const SearchForm = () => {
  const [categories, setCategories] = useState<string[]>([]);

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: '',
      category: 'all',
      sort: 'asc',
    },
  });

  useEffect(() => {
    getCategories()
      .then((res) => {
        setCategories(res);
      })
      .catch((err) => console.error(err));
  }, []);

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    const { search, category, sort } = values;
    router.push(
      `/products?search=${search.toLowerCase()}&category=${category}&sort=${sort}`
    );
  };

  return (
    <Form {...form}>
      <form
        className='flex justify-around gap-2 md:gap-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='search'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type='text'
                  placeholder='Search Product'
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className='md:w-[180px] max-w-[180px]'>
                    <SelectValue placeholder='Category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
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
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='sort'
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className='md:w-[180px] max-w-[180px]'>
                    <SelectValue placeholder='Sort By' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='asc'>A-z</SelectItem>
                  <SelectItem value='desc'>Z-a</SelectItem>
                  <SelectItem value='lowest'>Lowest Price</SelectItem>
                  <SelectItem value='highest'>Highest Price</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='p-2'
        >
          <Search />
        </Button>
      </form>
    </Form>
  );
};

export default SearchForm;
