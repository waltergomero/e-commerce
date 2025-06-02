'use client';

import { useState } from 'react';
import { toast  } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createCategory } from '@/actions/category-actions';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ZodErrors } from "@/components/common/zod-errors";
import { TrashIcon,PlusIcon} from "@heroicons/react/24/outline";

const CategoryForm = ({category}) => {
  const router = useRouter();
  const [state, setState] = useState(null);


  async function onSubmit(event) {
    event.preventDefault();
    try {
          const formData = new FormData(event.currentTarget);
          const categoryData = Object.fromEntries(formData.entries());
            const response = await createCategory(categoryData);
            if (response.error === "validation") {
              setState(response);
              toast.error(response.message);
                } 
            else if (response.error === "already_exists") { 
              toast.error( response.message);
            }
            else if(response.success === false) {
              toast.error("Failed adding a category: " + response.message);
            }
            else if(response.success) {
              toast.success(response.message);
              router.push('/admin/categories');
            }
            else{
              toast.error(response.error);
            }
          }
     catch (e) {
      toast.error("Failed adding a category: " + e.message);
    }
  }

  return (
    <form onSubmit={onSubmit} className='space-y-8'>
    <div className='space-y-6 w-1/3'>
    <div className="grid grid-cols-1 sm:grid-cols-1">
      <div className="col-span-2 sm:col-span-1">
            <Label htmlFor="category_name" className='pb-2'>Category name:</Label>
            <Input type="text"  name="category_name" />
            <ZodErrors error={state?.zodErrors?.category_name} />
          </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1">
      <div className="col-span-2 sm:col-span-1">
            <Label htmlFor="description" className='pb-2'>Description:</Label>
            <Textarea name="description" rows={4} />
            <ZodErrors error={state?.zodErrors?.description} />
          </div>
          
      </div>
     </div>
     <div className='w-1/3 gap-2 flex justify-end'>
                <Button
                 type='button'
                 onClick={() => router.back()}
                 size='lg'
                 className='button  bg-gray-400 hover:bg-gray-500 text-white'
               >
                Cancel
              </Button>
               <Button
                 type='submit'
                 size='lg'
                 className='button  bg-gray-800 hover:bg-gray-900 text-white'
               >
                Save Brand
              </Button>
             </div>
     </form>

  );
};

export default CategoryForm;