import { Metadata } from 'next';
import { auth } from '@/auth';
import UserProfileForm from './profile-form';
import { getUserById } from '@/actions/user-actions';


export const metadata = {
    title: 'Customer Profile'
}

const UserProfilePage = async () => {
  const session = await auth();
  const user = await getUserById(session?.user.id)

  return (
  
      <div className='max-w-md mx-auto space-y-4'>
        <h2 className='h2-bold'>Profile</h2>
        <UserProfileForm user={user} />
      </div>

  );
};

export default UserProfilePage;