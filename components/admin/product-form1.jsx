'use client';

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
import { UploadButton } from '@/lib/uploadthing';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';

const ProductForm = ({  type,  product,  productId,}) => {
  const router = useRouter();

  const form = useForm({
    resolver:
      type === 'Update'
        ? zodResolver(updateProductSchema)
        : zodResolver(productSchema),
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  });

  const onSubmit = async (    values  ) => {
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

  const images = form.watch('images');
  const isFeatured = form.watch('isFeatured');
  const banner = form.watch('banner');

    // const handleSlugify = () => {
    //   const productName = document.querySelector('Input[name="product_name"]').value;
    //   const generatedSlug = slugify(productName, { lower: true });
    //   setSlug(generatedSlug);
    //   document.querySelector('Input[name="slug"]').value = generatedSlug;   
    // }

  return (
    <Form {...form}>
      <form
        method='POST'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Name */}
          <FormField
            control={form.control}
            name='product_name'
            render={({ field }) => (
                <FormItem className='w-full'>
                <FormLabel>Product Name:</FormLabel>
                <FormControl>
                    <Input placeholder='Enter product name'/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
          {/* Slug */}
            <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
                <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <div className='relative'>
                    <Input placeholder='Enter slug'/>
                    <span className='absolute top-1/2 -translate-y-1/2 right-0 text-sm text-gray-500'>
                      <Button
                          type='button'
                          className='bg-gray-500 hover:bg-gray-600 text-white px-4'
                          onClick={handle}
                      >
                          Generate slug
                      </Button>
                    </span>
                    </div>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Category */}
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
                <FormItem className='w-full'>
                <FormLabel>Category</FormLabel>
                <FormControl>
                    <Input placeholder='Enter category' />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
          {/* Brand */}
          <FormField
            control={form.control}
            name='brand'
            render={({ field }) => (
                <FormItem className='w-full'>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                    <Input placeholder='Enter brand' />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Price */}
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
                <FormItem className='w-full'>
                <FormLabel>Price</FormLabel>
                <FormControl>
                    <Input placeholder='Enter product price' />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
          {/* Stock */}
          <FormField
            control={form.control}
            name='stock'
            render={({ field }) => (
                <FormItem className='w-full'>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                    <Input placeholder='Enter product stock' {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className='upload-field flex flex-col md:flex-row gap-5'>
          {/* Images */}
          <FormField
            control={form.control}
            name='images'
            render={() => (
              <FormItem className='w-full'>
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className='space-y-2 mt-2 min-h-48'>
                    <div className='flex-start space-x-2'>
                      {/* {images.map((image) => (
                        <Image
                          key={image}
                          src={image}
                          alt='product image'
                          className='w-20 h-20 object-cover object-center rounded-sm'
                          width={100}
                          height={100}
                        />
                      ))} */}
                      <FormControl>
                        <UploadButton
                          endpoint='imageUploader'
                          onClientUploadComplete={(res) => {
                            form.setValue('images', [...images, res[0].url]);
                          }}
                          onUploadError={(error) => {
                            toast({
                              variant: 'destructive',
                              description: `ERROR! ${error.message}`,
                            });
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='upload-field'>
          {/* isFeatured */}
          Featured Product
          <Card>
            <CardContent className='space-y-2 mt-2'>
              <FormField
                control={form.control}
                name='isFeatured'
                render={({ field }) => (
                  <FormItem className='space-x-2 items-center'>
                    <FormControl>
                      <Checkbox
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Is Featured?</FormLabel>
                  </FormItem>
                )}
              />
              {isFeatured && banner && (
                <Image
                  src={banner}
                  alt='banner image'
                  className='w-full object-cover object-center rounded-sm'
                  width={1920}
                  height={680}
                />
              )}

              {isFeatured && !banner && (
                <UploadButton
                  endpoint='imageUploader'
                  onClientUploadComplete={(res) => {
                    form.setValue('banner', res[0].url);
                  }}
                  onUploadError={(error) => {
                    toast({
                      variant: 'destructive',
                      description: `ERROR! ${error.message}`,
                    });
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          {/* Description */}
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter product description'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='button col-span-2 w-full'
          >
            {form.formState.isSubmitting ? 'Submitting' : `${type} Product`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;