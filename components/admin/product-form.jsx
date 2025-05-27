'use client';

import { useState } from 'react';
import { toast  } from 'react-toastify';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createProduct, updateProduct } from '@/actions/product-actions';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ZodErrors } from "@/components/common/zod-errors";
import { TrashIcon,PlusIcon} from "@heroicons/react/24/outline";

const ProductForm = ({  type,  product,  productId,}) => {
  const router = useRouter();
  const [state, setState] = useState(null);
  const [images, setImages] = useState([]);
  const [banner, setBanner] = useState([]);
  const [isFeatured, setIsFeatured] = useState(false);

  const handleSlugify = () => {
    const productName = document.querySelector('Input[name="product_name"]').value;
    const generatedSlug = slugify(productName, { lower: true });
    document.querySelector('Input[name="slug"]').value = generatedSlug;   
  }

  const handleFileChange = async (event) => {
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
        setImages((previousImages) => previousImages.concat(convertedFilesArray));
    };

    const handleBannerChange = async (event) => {
      setBanner([]);
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
        setBanner((previousImages) => previousImages.concat(convertedFilesArray));
    };
  

  const handleRemoveImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

  const handleRemoveBannerImage = (index) => {
        const newImages = banner.filter((_, i) => i !== index);
        setBanner(newImages);
    };

  async function onSubmit(event) {
    event.preventDefault();
    try {
      console.log("isFeatured: ", isFeatured);
          const formData = new FormData(event.currentTarget);
          formData.append('isfeatured', isFeatured);        
          if(images.length > 0){
            const imageNames = images.map(img => img.name);
              formData.append("images", imageNames);
            }         
          if (isFeatured === true) {
            const bannerName = banner.map(img => img.name);
              formData.append("banner", bannerName);
            }
          if(isFeatured === true && banner.length === 0) {
              toast.error("Please upload a banner image for featured products.");
              return;
            }
          else{

          const productData = Object.fromEntries(formData.entries());
          if (productData.price) productData.price = parseFloat(productData.price);
          if (productData.stock) productData.stock = parseInt(productData.stock, 10);

            const response = await createProduct(productData);
            if (response.error === "validation") {
              setState(response);
              toast.error(response.message);
                } 
            else if (response.error === "already_exists") { 
              toast.error("Failed adding a product: " + response.message);
            }
            else if(response.success === false) {
              toast.error("Failed adding a product: " + response.message);
            }
            else if(response.success) {
              toast.success(response.message);
                router.push('/admin/products');
            }
            else{
              toast.error(response.error);
            }
          }
    } catch (e) {
      toast.error("Failed adding a product: " + e.message);
    }
  }

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
            <Input type="decimal"  name="price" />
            <ZodErrors error={state?.zodErrors?.price} />
          </div>
          
          <div className="col-span-2 sm:col-span-1">
            <Label htmlFor="stock" className='pb-2'>Stock:</Label>
            <Input type="number"  name="stock"  />
            <ZodErrors error={state?.zodErrors?.stock} />
          </div>
          
      </div>
       <div className='grid grid-cols-1'>
        <div className='flex space-x-2 mb-1'>
        <Label htmlFor="images" >Images:</Label>
          <Input
                id="image-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
        type="button"
        className="text-sm text-white bg-blue-600 hover:bg-blue-700"
        onClick={() => document.getElementById('image-upload').click()}
      >
        Upload Images
      </Button>
      </div>
      {/* Images */}
      <Card>
        <CardContent className='space-y-2 mt-2'>
          <div className='flex-start space-x-2'>     
            {images.map((image, index) => (
            <div key={index} className="relative m-1">
                <Image 
                src={URL.createObjectURL(image)} 
                width="150"
                height="150"              
                alt={`preview ${index}`} 
                className=" border border-gray-300 rounded" />
              <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-sm p-1">
                    <TrashIcon className="w-5 h-5 text-white"/>
                </button>
                </div>
            ))}
  
          </div>
        </CardContent>
      </Card>
      </div>
      <div className='grid grid-cols-1'>
        <div className='flex space-x-2 mb-1'>
         <Label htmlFor="isFeatured" className='pb-2  text-sm'>Is Featured Product?:</Label>
         <Checkbox name='isFeatured' className='border-2 border-gray-600' onClick={() => setIsFeatured(!isFeatured)}  /> 
        </div>
          {isFeatured ? (<>
            <div className='flex space-x-2 mb-1'>
              <Input
                id="banner-upload"
                type="file"
                onChange={handleBannerChange}
                className="hidden"
              />
              <Button
        type="button"
        className="text-sm text-white bg-blue-600 hover:bg-blue-700"
        onClick={() => document.getElementById('banner-upload').click()}
      >
        Upload Banner Image
      </Button>
        </div>
        <div>
          <Card>
            <CardContent className='space-y-2 mt-2'>
              <div className='flex-start space-x-2'>   
              {banner.map((b, index) => (
                <div key={index} className="relative m-1">
                    <Image 
                    src={URL.createObjectURL(b)} 
                    width="1920"
                    height="680"              
                    alt={`preview ${index}`} 
                    className=" border border-gray-300 rounded" />
                  <button
                        onClick={() => handleRemoveBannerImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-sm p-1">
                        <TrashIcon className="w-5 h-5 text-white"/>
                    </button>
                </div>
                ))}
                </div>
            </CardContent>
          </Card>
          </div>
          </>
          ) : null}
        
      </div>
      <div className='grid grid-cols-1'>
        <Label htmlFor="description" className='pb-2'>Description:</Label>
        <Textarea name="description" rows={4} />
        <ZodErrors error={state?.zodErrors?.description} />
      </div>
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
     </form>

  );
};

export default ProductForm;