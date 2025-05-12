'use client';

import React, {useState, useTransition} from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ZodErrors } from "@/components/common/zod-errors";
import { RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import { PAYMENT_METHODS } from '@/lib/constants';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader,} from 'lucide-react';
import { updateUserPaymentMethod } from '@/actions/user-actions';



const PaymentMethodForm = ({preferredPaymentMethod}) => {
  const router = useRouter();
  const [state, setState] = useState(null);

    const [selectedValue, setSelectedValue] = useState(preferredPaymentMethod);

  const handleRadioChange = (event) => {
    const value = event.target.value;
    setSelectedValue(selectedValue === value ? null : value);
  };
  

  async function onSubmit(event) {
      event.preventDefault();
      try {
          const formData = new FormData(event.currentTarget);
          const response = await updateUserPaymentMethod(formData);
          console.log(response)
          if (response.error === "validation") {
            setState(response);
            toast.error(response.message);
              } 
          else {
                toast.success(response.message);
                router.push('/cart/place-order')
              } 
  
      } catch (e) {
        toast.error("Check payment method selection: " + e);
      }
   }



 const [isPending, startTransition] = useTransition();

  return (
      <div className='max-w-md mx-auto space-y-4 border-2 border-gray-200 p-2'>
        <h2 className='h2-bold mt-4'>Payment</h2>
        <form onSubmit={onSubmit}>
          <div className='space-y-6'>
          <div>
              <Label htmlFor='paymentMethod' className='pb-2'>Payment Methods:</Label>
              <RadioGroup name='paymentMethod'  className='flex flex-col space-y-2'>
                {
                  PAYMENT_METHODS.map((paymentmethod) => (
                    <div key={paymentmethod} className='flex items-center space-x-3 space-y-0'>
                      <RadioGroupItem className='border-2 border-gray-300' 
                      id={paymentmethod} 
                      checked={paymentmethod === preferredPaymentMethod}
                      value={selectedValue} 
                      onChange={handleRadioChange}                                      
                      />
                      {paymentmethod}
                    </div>
                  ))
                }
              </RadioGroup>

             <ZodErrors error={state?.zodErrors?.paymentMethod} />
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
  )
}

export default PaymentMethodForm