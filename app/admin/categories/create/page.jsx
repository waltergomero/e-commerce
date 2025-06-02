
import CategoryForm from '@/components/admin/category-form';
import { requireAdmin } from '@/lib/auth-guard';


export const metadata = {
  title: 'Create Category',
  description: 'Create a new category in the admin panel.',
};

const CreateCategoryPage = async () => {
  await requireAdmin();
  return (
    <>
      <h2 className='h3-bold'>Create New Category</h2>
      <div className='my-8'>
        <CategoryForm type='Create' />
      </div>
    </>
  );
};

export default CreateCategoryPage;