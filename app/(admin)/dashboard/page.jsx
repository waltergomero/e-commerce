import React from 'react';
import { auth } from '@/auth';

const DashboardPage = async () => {
    const session = await auth();
  return (
    <>
        <div>DashboardPage</div>
        <div>{session.user?.email}</div>
        <div>{session.user?.name}</div>
        <div>{session.user?.isadmin.toString()}</div>
        <div>{session.user?.id}</div>
    </>
    
  )
}

export default DashboardPage