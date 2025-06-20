import React, { Fragment } from 'react';
import { Badge } from '@/components/ui/badge';
import ProductPrice from '@/components/product/product-price';
import { getProductBySlug } from '@/actions/product-actions';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import ProductImages from '@/components/product/product-images';
import AddToCart from '@/components/product/add-to-cart';
import { getMyCart } from '@/actions/cart-actions';

const ProductDetailsPage = async ({params}) => {
    const {slug} = await params;
    const product = await getProductBySlug(slug);

    const cart = await getMyCart();

    if(!product){
        notFound();
    }

  return (
    <Fragment>
        <section>
            <div className='grid grid-cols-1 md:grid-cols-5'>
                <div className='col-span-2'>
                    <ProductImages images={product.ProductImages}/>
                </div>
                <div className='col-span-2 p-5'>
                    <div className='flex flex-col gap-6'>
                        <p>
                            {product.brand} {product.category} 
                        </p>
                        <h1 className='h3-bold'>{product.product_name}</h1>
                        <p>{product.rating.toString()} of {product.numReviews} reviews </p>
                        <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
                            <ProductPrice value={product.price} className='w-24 rounded-full bg-green-100 text-green-700 px-5 py-2'/>
                        </div>
                    </div>
                    <div className='mt-10'>
                        <p className='font-semibold'>Description 22:</p>
                        <p className='text-sm'>{product.description}</p>
                    </div>
                </div>
                <div>
                    <Card>
                        <CardContent className='p-4'>
                            <div className='mb-2 flex justify-between'>
                                <div>Price:</div>
                                <ProductPrice value={product.price}/>
                            </div>
                            <div className='mb-2 flex justify-between'>
                                <div>Status: </div>
                                {product.stock > 0 ? (
                                    <Badge variant='outline'>In Stock</Badge>
                                ) : (
                                    <Badge variant='destructive'>Out of Stock</Badge>
                                )}
                            </div>
                            {product.stock > 0 && (
                                <div className='flex-center'>
                                    <AddToCart 
                                        cart={cart}
                                        item={{
                                        productId: product.id,
                                        product_name: product.product_name,
                                        slug: product.slug,
                                        price: Number(product.price),
                                        quantity: 1,
                                        image: product.ProductImages[0].src,
                                    }}/>
                                </div> )
                            }
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    </Fragment>
  )
}

export default ProductDetailsPage