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

const SearchForm = () => {
  return (
    <form className='flex gap-4'>
      <Input
        type='text'
        placeholder='Search Product'
      />
      <Select>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Theme' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='light'>Light</SelectItem>
          <SelectItem value='dark'>Dark</SelectItem>
          <SelectItem value='system'>System</SelectItem>
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
