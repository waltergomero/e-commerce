import React from 'react';
import { cn } from '@/lib/utils';

const ProductPrice = ({value, className}) => {
 
    const stringValue = parseFloat(value).toFixed(2); //parseFloat convert string to float
    const [intValue, floatValue] = stringValue.split('.');
  return (
    <p className={cn('text-2xl', className)}>
    <span className='text-xs align-super'>$</span>
    {intValue}
    <span className='text-xs align-super'>.{floatValue}</span>
</p>
  )
}

export default ProductPrice