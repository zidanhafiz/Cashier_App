import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex h-screen justify-center items-center'>
      <Card>
        <CardHeader>
          <CardTitle>404 Not Found</CardTitle>
          <CardDescription>Could not find requested resource</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href='/'>Return Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
