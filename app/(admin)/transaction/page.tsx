import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const Transaction = () => {
  return (
    <div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Wednesday, 05 Maret 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Rinso, Teh Botol, Indomie</p>
          </CardContent>
          <CardFooter>
            <p>Rp120.000,00</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Transaction;
