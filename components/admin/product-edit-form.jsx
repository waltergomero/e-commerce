'use client';

import { useState, useEffect } from 'react';
import { toast  } from 'react-toastify';
import { redirect, useRouter } from 'next/navigation';
import slugify from 'slugify';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { updateProduct, } from '@/actions/product-actions';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ZodErrors } from "@/components/common/zod-errors";
import { TrashIcon,PlusIcon} from "@heroicons/react/24/outline";
import Compressor from "compressorjs";
import heic2any from "heic2any";
import ProductImageGrid from './product-image-grid';

const ProductEditForm = ({ product, brands, categories, images }) => {
  const router = useRouter();
  const [state, setState] = useState(null);
  const [bannerImage, setBannerImage] = useState([]);
  const [bannerPreviewUrls, setBannerPreviewUrls] = useState([]);
  const [categoryValue, setCategoryValue] = useState(product.category_name);
  const [brandValue, setBrandValue] = useState(product.brand_name);

  useEffect(() => {
  return () => {
    bannerPreviewUrls.forEach(url => URL.revokeObjectURL(url));
  };
}, [bannerPreviewUrls]);

  const handleSlugify = () => {
    const productName = document.querySelector('Input[name="product_name"]').value;
    const generatedSlug = slugify(productName, { lower: true });
    document.querySelector('Input[name="slug"]').value = generatedSlug;   
  }

const handleBannerChange = async (event) => {
  const files = Array.from(event.target.files);
  const convertedFilesArray = await Promise.all(
    files.map(async (file) => {
      const filename = file.name.toLowerCase();
      const ext = filename.split(".").pop();
      if (ext === "heic" || ext === "heif") {
        const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" });
        return new File([convertedBlob], filename.replace("." + ext, ".jpg"), { type: "image/jpeg" });
      }
      return file;
    })
  );
  setBannerImage([convertedFilesArray[0]]);
  setBannerPreviewUrls([URL.createObjectURL(convertedFilesArray[0])]);
};
  
  const handleRemoveBannerImage = (index) => {
        //const newImages = banner.filter((_, i) => i !== index);
        setBannerImage(null);
        setBannerPreviewUrls(null);
    };

  const handleCategory = e => {
    e.preventDefault();
    const dropdownName = e.target.options[e.target.selectedIndex].text;
    setCategoryValue(dropdownName);
  };

  const handleBrand = e => {
    const dropdownName = e.target.options[e.target.selectedIndex].text;
    setBrandValue(dropdownName);
  };

  const removeBannerImageFromDatabase = async () => {
    try { 
      const response = await fetch(`/api/product/banner/`, {
        method: 'DELETE',
        headers: {  
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: product.slug }),
      });
      if (response.ok) {
        toast.success("Banner image removed successfully.");
        setBannerImage(null);
        router.push(`/admin/products/${product.id}`);
      } else {
        const errorData = await response.json();
        toast.error("Failed to remove banner image: " + errorData.message);
      }
    } catch (error) {
      toast.error("Failed to remove banner image: " + error.message);
    }
  };

  async function onSubmit(event) {
    event.preventDefault();
    console.log(bannerImage)
    try {
        const formData = new FormData(event.currentTarget);
        const response = await updateProduct(formData);
          if (response.error === "validation") {
                setState(response);
                toast.error(response.message);
              } else if (response.error === "already_exists") {
                toast.error("Failed adding a product: " + response.message);
              } else if (response.success === false) {
                toast.error("Failed adding a product: " + response.message);
              } else if (response.success) {
                  if (bannerImage !== null) {
                      const API_PATH = "/api/product/banner/";
                      bannerImage && bannerImage?.map((image) => {
                        const ext = image.name.substr(image.name.lastIndexOf(".") + 1);
                        new Compressor(image, {
                          quality: 0.9, // 0.6 can also be used, but its not recommended to go below.
                          success: (result) => {
                            formData.append("image", image);
                            formData.append("extension", ext);
                            fetch(API_PATH, {
                              method: "POST",
                              body: formData,
                            });
                          },
                        });                 
                      });
                    } 
                toast.success("Product added successfully");
                router.push('/admin/products');
              } else {
                toast.error("test " + response.error);
              }        
      }
      catch (e) {
            toast.error("Failed adding a product: " + e.message);
          }
        }

    return (
      <>
      <form onSubmit={onSubmit} className='space-y-8'>
        <input type="hidden" name="category_name" defaultValue={categoryValue}/>
        <input type="hidden" name="brand_name" defaultValue={brandValue}/>
        <input type="hidden" name="product_id" defaultValue={product.id}/>
      <div className='space-y-6'>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="product_name" className='pb-2'>Product name:</Label>
              <Input type="text"  name="product_name" defaultValue={product.product_name} />
              <ZodErrors error={state?.zodErrors?.product_name} />
            </div>
            
            <div className="col-span-2 sm:col-span-1 relative">
              <Label htmlFor="slug" className='pb-2'>Slug:</Label>
              <Input type="text"  name="slug" defaultValue={product.slug} />
              <span className='absolute top-1/2 -translate-y-1/4 right-0 text-xs text-gray-500'>
                <Button
                    type='button'
                    className='bg-gray-500 hover:bg-gray-600 text-white px-2'
                    onClick={handleSlugify}
                > Generate slug
                </Button>
              </span>
              <ZodErrors error={state?.zodErrors?.slug} />
            </div>
            
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="category" className='pb-2'>Category:</Label>
              <select
                name="category_id"
                defaultValue={product.category_id}
                onClick={handleCategory}
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 px-2 py-1 text-sm outline-2 placeholder:text-gray-500">
                <option value=""></option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
              <ZodErrors error={state?.zodErrors?.category_id} />
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="brand" className='pb-2'>Brand:</Label>
              <select
                name="brand_id"
                defaultValue={product.brand_id}
                onClick={handleBrand}
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 px-2 py-1 text-sm outline-2 placeholder:text-gray-500">
                <option value=""></option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.brand_name}
                  </option>
                ))}
              </select>
              <ZodErrors error={state?.zodErrors?.brand_id} />
            </div>
            
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="price" className='pb-2'>Price:</Label>
              <Input type="decimal"  name="price" defaultValue={product.price} />
              <ZodErrors error={state?.zodErrors?.price} />
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="stock" className='pb-2'>Stock:</Label>
              <Input type="number"  name="stock" defaultValue={product.stock} />
              <ZodErrors error={state?.zodErrors?.stock} />
            </div>
            
        </div>
        <div className='grid grid-cols-1'>
                <div className='flex space-x-2 mb-1'>
                 <Label htmlFor="banner-upload" className='pb-2  text-sm'>Does product needs a banner?:
                  { product.banner ? (
                    <span className='text-red-500 text-xs'>To upload a new one, please remove the existing banner first.</span>
                  ) : (
                    ""
                  )}
                 </Label>
                </div>
            <div className='flex space-x-2 mb-1'>
                      <Input
                        id="banner-upload"
                        type="file"
                        onChange={handleBannerChange}
                        className="hidden"
                      />
                {product.banner ? "" : (
                  <Button
                    type="button"
                    className="text-sm text-white bg-blue-600 hover:bg-blue-700"
                    onClick={() => document.getElementById('banner-upload').click()}
                  >
                    Upload Banner Image
                  </Button>
                )}
                </div>
                <div>
                  <Card>
                      <CardContent className='space-y-2 mt-2'>
                                {product.banner ? (
                               <div className='flex-start space-x-2'>
                                {product.banner ? 
                                      (
                                    <div className="relative m-1">
                                      <Image
                                        src={product.banner}
                                        width="1920"
                                        height="680"
                                        alt={product.banner}
                                        className="border border-gray-300 rounded"
                                      />
                                      
                                      <button
                                        onClick={() => removeBannerImageFromDatabase()}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-sm p-1"
                                        type="button"
                                      >
                                        <TrashIcon className="w-5 h-5 text-white" />
                                      </button>
                                    </div>) : null}
                                </div>)
                                : (
                                <div className='flex-start space-x-2'>
                                 {bannerPreviewUrls.length > 0 ? (
                                    bannerPreviewUrls.map((url, idx) => (
                                      <div className="relative m-1" key={idx}>
                                        <Image
                                          src={url}
                                          width="1920"
                                          height="680"
                                          alt={`preview-${idx}`}
                                          className="border border-gray-300 rounded"
                                        />
                                        <button
                                          onClick={() => handleRemoveBannerImage(idx)}
                                          className="absolute top-0 right-0 bg-red-500 text-white rounded-sm p-1"
                                          type="button"
                                        >
                                          <TrashIcon className="w-5 h-5 text-white" />
                                        </button>
                                      </div>
                                    ))
                                  ) : null}
                                </div>)
                              }
                              </CardContent>
                            </Card>
                  </div>
        
              </div>
        <div className='grid grid-cols-1'>
          <Label htmlFor="description" className='pb-2'>Description:</Label>
          <Textarea name="description" rows={4} defaultValue={product.description} />
          <ZodErrors error={state?.zodErrors?.description} />
        </div>
  
       <div className='gap-4 flex justify-end'>
                  <Button
                   type='button'
                   onClick={() => router.back()}
                   size='lg'
                   className='button w-62 bg-gray-400 hover:bg-gray-500 text-white'
                 >
                  Cancel
                </Button>
                 <Button
                   type='submit'
                   size='lg'
                   className='button w-62 bg-gray-800 hover:bg-gray-900 text-white'
                 >
                  Save Product
                </Button>
               </div>
      </div>
       </form>
       <ProductImageGrid product={product} images={images}/>
       </>
    );

};

export default ProductEditForm;