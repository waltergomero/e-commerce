'use client';

import React, {useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { shippingAddressDefaultValues } from '@/lib/constants';
import { ZodErrors } from "@/components/common/zod-errors";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader } from 'lucide-react';
import {updateUserAddress} from '@/actions/user-actions';

const ShippingAddressForm = ({address}) => {
  console.log("address: ", address)
  const router = useRouter();
  const [state, setState] = useState(null);

  async function onSubmit(event) {
    event.preventDefault();
    try {
        const formData = new FormData(event.currentTarget);
        const response = await updateUserAddress(formData);
        console.log(response)
        if (response.error === "validation") {
          setState(response);
          toast.error(response.message);
            } 
        else {
              toast.success(response.message);
              router.push('/cart/payment-method')
            } 

    } catch (e) {
      toast.error("Check your Credentials: " + e);
    }
 }

  const [isPending, startTransition] = useTransition();

  return (
    <>
      <div className='max-w-md mx-auto space-y-4 border-2 border-gray-200 p-2'>
        <h2 className='h2-bold mt-4'>Shipping Address</h2>
        <p className='text-sm text-muter-foreground'>
          Please enter full name and address to ship to:
        </p>
        <form onSubmit={onSubmit}>
          <div className='space-y-6'>
          <div>
              <Label htmlFor='fullName' className='pb-2'>Full Name:</Label>
              <Input
                name="fullName"
                className="pl-6"
                defaultValue={ address ? address.fullName : ''}
                type="text"
              />
             <ZodErrors error={state?.zodErrors?.fullName} />
            </div>
            <div>
              <Label htmlFor='streetAddress' className='pb-2'>Address:</Label>
              <Input
                name="streetAddress"
                className="pl-6"
                defaultValue={address ? address.streetAddress : ''}
                type="text"
              />
             <ZodErrors error={state?.zodErrors?.streetAddress} />
            </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="city" className='pb-2'>City:</Label>
                  <Input type="text"  name="city" defaultValue={address ? address.city : ''}/>
                  <ZodErrors error={state?.zodErrors?.city} />
                </div>
                
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="state" className='pb-2'>State:</Label>
              <Input type="text"  name="state" defaultValue={address ? address.state : ''}/>
              <ZodErrors error={state?.zodErrors?.state} />
            </div>  
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="zipCode" className='pb-2'>Zip Code:</Label>
                  <Input type="text"  name="zipCode" defaultValue={address ? address.zipCode : ''}/>
                  <ZodErrors error={state?.zodErrors?.zipCode} />
                </div>
                
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="country" className='pb-2'>Country:</Label>
              <Input type="text"  name="country" defaultValue={address ? address.country : ''}/>
              <ZodErrors error={state?.zodErrors?.country} />
            </div>  
            </div>
            <div>
                <Button className="w-full mt-4" size="sm" type="submit" disabled={isPending}>
                  {
                    isPending ? (
                      <Loader className='w-4 h-4 animate-spin'/>
                    ) : (
                      <ArrowRight className='w-4 h-4'/>
                    )
                  }
                  Continue
                </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default ShippingAddressForm