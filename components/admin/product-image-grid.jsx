
import { useState} from "react";
import Image from 'next/image'
import { toast  } from 'react-toastify';
import { TrashIcon} from "@heroicons/react/24/outline";
import {  useRouter } from 'next/navigation';
import ProductImageUploader from "./product-upload-image";
import { Card, CardContent } from '@/components/ui/card';


const ProductImageGrid =  ({product, images}) => {
  const router = useRouter();
   const [uploadedImages, setUploadedImages] = useState([]);

  const removeBannerImageFromDatabase = async (image_id, image_src) => {
    try {
      const response = await fetch(`/api/product/images/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_id, image_src }),
      });
      if (response.ok) {
        toast.success("Image was removed successfully.");
        setUploadedImages(image => image.filter(x => x.id != image_id));
        setTimeout(() => {
          router.refresh();
        }, 500);
      } else {
        const errorData = await response.json();
        toast.error("Failed to remove image: " + errorData.message);
      }
    } catch (error) {
      toast.error("Failed to remove image: " + error.message);
    }
  };

  return (
    <>
      <ProductImageUploader product={product} />
      <div className='grid grid-cols-1 mt-2'>
                <Card>
                  <CardContent className='space-y-2 mt-2 min-h-48'>
                    <div className='flex-start space-x-2'>
                      {images?.map((image, index) => (
                        <div className='relative w-52 h-52 overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200' 
                          key={index}>
                        <Image
                          key={index}
                          src={image.src}
                          alt='product image'
                          width="220"
                          height="220"
                        />
                        <button
                          onClick={() => removeBannerImageFromDatabase(image.id, image.src)}
                          className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'>
                          <TrashIcon className='w-5 h-5' />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
    </>
  )
}

export default ProductImageGrid