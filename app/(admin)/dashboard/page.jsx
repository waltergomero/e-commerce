import React from 'react';
import { auth } from '@/auth';

const DashboardPage = async () => {
    const session = await auth();
    console.log("session", session)
  return (
    <>
        <div>DashboardPage</div>
        {session?.user?.name}
    </>
    
  )
}

export default DashboardPage