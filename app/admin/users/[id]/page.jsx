import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUserById } from '@/actions/user-actions';
import UserEditForm from '@/components/admin/user-edit-form';
import { requireAdmin } from '@/lib/auth-guard';

export const metadata = {
  title: 'Update User',
};

const AdminUserUpdatePage = async (props) => {
  await requireAdmin();

  const { id } = await props.params;

  const user = await getUserById(id);

  if (!user) notFound();

  return (
    <div className='space-y-8 w-full mx-auto'>
      <h1 className='h3-bold'>Update User</h1>
      <UserEditForm user={user} />
    </div>
  );
};

export default AdminUserUpdatePage;