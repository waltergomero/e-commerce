'use client';

import { useState } from 'react';
import { toast  } from 'react-toastify';
import { productDefaultValues } from '@/lib/constants';
import { productSchema, updateProductSchema } from '@/schemas/validation-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import {  Form,  FormControl,  FormField,  FormItem,  FormLabel,  FormMessage,} from '@/components/ui/form';
import slugify from 'slugify';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createProduct, updateProduct } from '@/actions/product-actions';
//import { UploadButton } from '@/lib/uploadthing';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ZodErrors } from "@/components/common/zod-errors";

const ProductForm = ({  type,  product,  productId,}) => {
  const router = useRouter();
  const [state, setState] = useState(null);
  const [slug, setSlug] = useState('');

  const handleSlugify = () => {
    const productName = document.querySelector('Input[name="product_name"]').value;
    const generatedSlug = slugify(productName, { lower: true });
    //setSlug(generatedSlug);
    document.querySelector('Input[name="slug"]').value = generatedSlug;   
  }

//   const form = useForm<z.infer<typeof insertProductSchema>>({
//     resolver:
//       type === 'Update'
//         ? zodResolver(updateProductSchema)
//         : zodResolver(insertProductSchema),
//     defaultValues:
//       product && type === 'Update' ? product : productDefaultValues,
//   });

  const onSubmit = async (values  ) => {
    // On Create
    if (type === 'Create') {
      const res = await createProduct(values);

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
      } else {
        toast({
          description: res.message,
        });
        router.push('/admin/products');
      }
    }

    // On Update
    if (type === 'Update') {
      if (!productId) {
        router.push('/admin/products');
        return;
      }

      const res = await updateProduct({ ...values, id: productId });

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
      } else {
        toast({
          description: res.message,
        });
        router.push('/admin/products');
      }
    }
  };

//   const images = form.watch('images');
//   const isFeatured = form.watch('isFeatured');
//   const banner = form.watch('banner');

  return (
    <form onSubmit={onSubmit} className='space-y-8'>
    <div className='space-y-6'>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="col-span-2 sm:col-span-1">
            <Label htmlFor="product_name" className='pb-2'>Product name:</Label>
            <Input type="text"  name="product_name" />
            <ZodErrors error={state?.zodErrors?.product_name} />
          </div>
          
          <div className="col-span-2 sm:col-span-1 relative">
            <Label htmlFor="slug" className='pb-2'>Slug:</Label>
            <Input type="text"  name="slug"  />
            <Button
                type='button' className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2'
                        onClick={handleSlugify}
                    >
                Generate Slug
                    </Button>
            <ZodErrors error={state?.zodErrors?.slug} />
          </div>
          
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="col-span-2 sm:col-span-1">
            <Label htmlFor="category" className='pb-2'>Category:</Label>
            <Input type="text"  name="category" />
            <ZodErrors error={state?.zodErrors?.category} />
          </div>
          
          <div className="col-span-2 sm:col-span-1">
            <Label htmlFor="brand" className='pb-2'>Brand:</Label>
            <Input type="text"  name="brand"  />
            <ZodErrors error={state?.zodErrors?.brand} />
          </div>
          
      </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="col-span-2 sm:col-span-1">
            <Label htmlFor="price" className='pb-2'>Price:</Label>
            <Input type="text"  name="price" />
            <ZodErrors error={state?.zodErrors?.price} />
          </div>
          
          <div className="col-span-2 sm:col-span-1">
            <Label htmlFor="stock" className='pb-2'>Stock:</Label>
            <Input type="text"  name="stock"  />
            <ZodErrors error={state?.zodErrors?.stock} />
          </div>
          
      </div>
     </div>
     </form>

  );
};

export default ProductForm;