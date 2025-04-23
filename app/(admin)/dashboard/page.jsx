import React from 'react';
import { auth } from '@/auth2';

const DashboardPage = async () => {
    const session = await auth();
  return (
    <>
        <div>DashboardPage</div>
        {session?.user?.name}
    </>
    
  )
}

export default DashboardPage