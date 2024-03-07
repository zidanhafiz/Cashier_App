'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className='flex h-screen justify-center items-center'>
        <Card>
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
            <CardDescription>Could not find requested resource</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => reset()}>Try again</Button>
          </CardContent>
        </Card>
      </body>
    </html>
  );
}
