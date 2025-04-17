import React from 'react';
//import sampleData from '@/db/sample-data';
import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts } from '@/actions/product-actions';



const HomePage = async () => {
 const latestProduct = await getLatestProducts();
  return (
    <div><ProductList data={latestProduct} title={"New Arrivals"} /></div>
  )
}

export default HomePage