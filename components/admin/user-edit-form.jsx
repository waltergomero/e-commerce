'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { toast  } from 'react-toastify';
import { redirect, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { updateUser, } from '@/actions/user-actions';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import CheckboxDefault from '@/components/ui/custom/checkboxDefault';
import { Label } from '@/components/ui/label';
import { ZodErrors } from "@/components/common/zod-errors";
import { TrashIcon,PlusIcon} from "@heroicons/react/24/outline";


const UserEditForm = ({ user }) => {

    const router = useRouter();
    const [state, setState] = useState(null);

    async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    setState({ loading: true, zodErrors: null });   
    try {
      const response = await updateUser(formData);
          if (response.error === "validation") {
            setState(response);
            toast.error(response.message);
        } else if (response.error === "already_exists") {
            toast.error("Failed adding a product: " + response.message);
        } else if (response.success === false) {
            toast.error("Failed updating user: " + response.message);
        } else if (response.success) {
            toast.success("User updated successfully");
            router.push('/admin/users');
        } else {
            toast.error("test " + response.error);
        }  
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
      setState({ loading: false, zodErrors: null });
        }
    }
 
    return (
      <form onSubmit={onSubmit}>
        <input type="hidden" name="user_id" defaultValue={user.id} />
        <div className='space-y-6 '>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="first_name" className='pb-2'>First name:</Label>
                <Input type="text"  name="first_name" defaultValue={user.first_name} />
                <ZodErrors error={state?.zodErrors?.first_name} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="last_name" className='pb-2'>Last name:</Label>
                <Input type="text"  name="last_name" defaultValue={user.last_name} />
                <ZodErrors error={state?.zodErrors?.last_name} />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="email" className='pb-2'>Email:</Label>
                <Input type="text" readOnly name="email" defaultValue={user.email} />
                <ZodErrors error={state?.zodErrors?.email} />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2 sm:col-span-1">
                <CheckboxDefault  title="Is user admin?" name="isadmin" checked={user.isadmin} />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2 sm:col-span-1">
                <CheckboxDefault  title="Is user active?" name="isactive" checked={user.isactive} />
                </div>
            </div>
       <div className='gap-4 flex justify-end'>
                  <Button
                   type='button'
                   onClick={() => router.back()}
                   size='lg'
                   className='button w-48 bg-gray-400 hover:bg-gray-500 text-white'
                 >
                  Cancel
                </Button>
                 <Button
                   type='submit'
                   size=''
                   className='button w-48 bg-gray-800 hover:bg-gray-900 text-white'
                 >
                  Save User
                </Button>
               </div>
      </div>
       </form>
    );
}

export default UserEditForm