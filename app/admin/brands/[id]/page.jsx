
import BrandEditForm from '@/components/admin/brand-edit-form';
import { requireAdmin } from '@/lib/auth-guard';
import {fetchBrandById} from '@/actions/brand-actions'; 
import { noStore } from 'next/cache';

export const metadata = {
  title: 'Update Brand',
  description: 'Update an existing brand in the admin panel.',
};

const UpdateBrandPage = async ({params}) => {
  await requireAdmin();

    const { id } = await params;
    console.log('id:', id);
    if (!id) {
            throw new Error('Brand ID is required for updating a brand.');
        }
    // You can fetch the brand data here if needed, using the id
    const brand = await fetchBrandById(id); // Example function to fetch brand data
  return (
    <>
      <h2 className='h3-bold'>Update Brand</h2>
      <div className='my-8'>
        <BrandEditForm type='Update' brand={brand} />
      </div>
    </>
  );
};

export default UpdateBrandPage;