'use client';
import { Button } from '@/components/ui/button';
import { logOut } from '@/lib/firebase/authLogin';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={logOut}>Logout</Button>
    </div>
  );
};

export default Dashboard;
