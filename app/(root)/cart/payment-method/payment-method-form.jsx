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

  async function onSubmit(event) {
      event.preventDefault();
      try {
          const formData = new FormData();
          formData.append("paymentmethod", selectedValue);
          const response = await updateUserPaymentMethod(formData);
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

console.log("selectedValue", selectedValue)

 const [isPending, startTransition] = useTransition();

  return (
      <div className='max-w-md mx-auto space-y-4 border-2 border-gray-200 p-2'>
        <h2 className='h2-bold mt-4'>Payment</h2>
        <form onSubmit={onSubmit}>
          <div className='space-y-6'>
          <div>
              <Label htmlFor='paymentMethod' className='pb-2'>Payment Methods:</Label>
			          {PAYMENT_METHODS.map((paymentmethod) => (
                  <div key={paymentmethod} className="flex items-center space-x-3 space-y-0 mb-4">
                    <input 
                      type="radio" 
                      name={paymentmethod}
                      id={paymentmethod}
                      value={paymentmethod} // Set the value to the current payment method
                      checked={paymentmethod === selectedValue} // Compare with selectedValue
                      onChange={(e) => setSelectedValue(e.target.value)} // Update selectedValue
                      />
                      <Label htmlFor={paymentmethod}>{paymentmethod}</Label>
                  </div>
                ))}

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