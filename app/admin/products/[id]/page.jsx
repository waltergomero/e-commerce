
import ProductEditForm from '@/components/admin/product-edit-form';
import { requireAdmin } from '@/lib/auth-guard';
import {fetchAllBrands} from '@/actions/brand-actions';
import {fetchAllCategories} from '@/actions/category-actions';
import { fetchProductById, fetchProductImages } from '@/actions/product-actions';

export const metadata = {
  title: 'Edit Product',
};

const EditProductPage = async ({params}) => {
  await requireAdmin();

      const { id } = await params;
      console.log('id:', id);
      if (!id) {
              throw new Error('Category ID is required for updating a category.');
          }
      // You can fetch the product data here if needed, using the id
    const product = await fetchProductById(id);
    const brands = await fetchAllBrands();
    const categories = await fetchAllCategories();
    const images = await fetchProductImages(id);


  return (
    <>
      <h2 className='h2-bold'>Edit a Product</h2>
      <div className='my-8'>
        <ProductEditForm type="edit" product={product} brands={brands} categories={categories} images={images} />
      </div>
    </>
  );
};

export default EditProductPage;