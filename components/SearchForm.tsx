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

const SearchForm = () => {
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [sort, setSort] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    getCategories()
      .then((res) => {
        setCategories(res);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <form className='flex gap-4'>
      <Input
        type='text'
        placeholder='Search Product'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Category' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All</SelectItem>
          {categories.map((cat) => (
            <SelectItem
              key={cat}
              value={cat}
            >
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Sort By' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='newest'>Newest</SelectItem>
          <SelectItem value='oldest'>Oldest</SelectItem>
          <SelectItem value='lowest'>Lowest Price</SelectItem>
          <SelectItem value='highest'>Highest Price</SelectItem>
        </SelectContent>
      </Select>
      <Button
        type='submit'
        className='p-2'
      >
        <Search />
      </Button>
    </form>
  );
};

export default SearchForm;
