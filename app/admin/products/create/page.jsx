
import ProductForm from '@/components/admin/product-form';
import { requireAdmin } from '@/lib/auth-guard';
import {fetchAllBrands} from '@/actions/brand-actions';
import {fetchAllCategories} from '@/actions/category-actions';

export const metadata = {
  title: 'Create Product',
};

const CreateProductPage = async () => {
  await requireAdmin();

    const brands = await fetchAllBrands();
    const categories = await fetchAllCategories();

  return (
    <>
      <h2 className='h2-bold'>Create New Product</h2>
      <div className='my-8'>
        <ProductForm  brands={brands} categories={categories} />
      </div>
    </>
  );
};

export default CreateProductPage;