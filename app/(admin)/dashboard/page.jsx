import React from 'react';
import { auth } from '@/auth2';

const DashboardPage = async () => {
    const session = await auth();
  return (
    <>
        <div>DashboardPage</div>
        {session.user?.email}
        {session.user?.name}
        {session.user?.isadmin.toString()}
        {session.user?.id}
    </>
    
  )
}

export default DashboardPage