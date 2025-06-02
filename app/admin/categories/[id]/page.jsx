
import CategoryEditForm from '@/components/admin/category-edit-form';
import { requireAdmin } from '@/lib/auth-guard';
import {fetchCategoryById} from '@/actions/category-actions'; 
import { noStore } from 'next/cache';

export const metadata = {
  title: 'Update Category',
  description: 'Update an existing category in the admin panel.',
};

const UpdateCategoryPage = async ({params}) => {
  await requireAdmin();

    const { id } = await params;
    console.log('id:', id);
    if (!id) {
            throw new Error('Category ID is required for updating a category.');
        }
    // You can fetch the brand data here if needed, using the id
    const category = await fetchCategoryById(id); // Example function to fetch category data
  return (
    <>
      <h2 className='h3-bold'>Update Category</h2>
      <div className='my-8'>
        <CategoryEditForm type='Update' category={category} />
      </div>
    </>
  );
};

export default UpdateCategoryPage;