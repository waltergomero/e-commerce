
import BrandForm from '@/components/admin/brand-form';
import { requireAdmin } from '@/lib/auth-guard';


export const metadata = {
  title: 'Create Brand',
  description: 'Create a new product in the admin panel.',
};

const CreateBrandPage = async () => {
  await requireAdmin();
  return (
    <>
      <h2 className='h3-bold'>Create New Brand</h2>
      <div className='my-8'>
        <BrandForm type='Create' />
      </div>
    </>
  );
};

export default CreateBrandPage;