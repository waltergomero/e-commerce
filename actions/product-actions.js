'use server';

import  prisma  from '@/prisma/prisma';
import { convertToPlainObject } from "@/lib/utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '@/lib/constants';
import { productSchema,updateProductSchema } from '@/schemas/validation-schemas';
import { revalidatePath } from 'next/cache';

//get all products
export async function getLatestProducts() {
    const data = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy:{createdAt: 'desc'},
    })

    return convertToPlainObject(data);
}

//get single product by slug
export async function getProductBySlug(slug){
    return await prisma.product.findFirst({
        where: {slug: slug}
    })
}

//get single product by id
export async function getProductById(id){
    return await prisma.product.findFirst({
        where: {id: id}
    })
}

// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}) {
  // Query filter
  const queryFilter =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        }
      : {};

  // Category filter
  const categoryFilter = category && category !== 'all' ? { category } : {};

  // Price filter
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            gte: Number(price.split('-')[0]),
            lte: Number(price.split('-')[1]),
          },
        }
      : {};

  // Rating filter
  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    orderBy:
      sort === 'lowest'
        ? { price: 'asc' }
        : sort === 'highest'
        ? { price: 'desc' }
        : sort === 'rating'
        ? { rating: 'desc' }
        : { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a product
export async function deleteProduct(id) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error('Product not found');

    await prisma.product.delete({ where: { id } });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

async function checkPublicPath(dir){
  const result =  await fs.existsSync(dir);
  return result;
};

// Create a product
export async function createProduct(data) {
  try {
   console.log("Creating product with data:", data);
   const validatedFields = productSchema.safeParse(data);
    
    if (!validatedFields.success) {
      return {
        error: "validation",
        zodErrors: validatedFields.error.flatten().fieldErrors,
        strapiErrors: null,
        message: "Missing information on key fields.",
      };
    }
    //check if product with same slug exists
    const existingProduct = await prisma.product.findFirst({
      where: { slug: data.slug },
    });
    
    if (existingProduct) {
      return {
        error: "already_exists",
        message: "Product with this slug already exists.",
      };
    }

    const partialDir = '/images/products/';
    const dir = path.join(process.cwd(), 'public', partialDir);
  
    const dirExist = await checkPublicPath(dir);

    if(dirExist === false){
       fs.mkdirSync(dir, { recursive: true });
     }

    //loop through images and convert to string array
    const _images = data.images.map((image) => image.toString());

    //get banner if exists
    const _banner = data.banner ? data.banner.toString() : null;

    // const data_to_save = {
    //   product_name: data.product_name,
    //   slug: data.slug,
    //   brand: data.brand,
    //   description: data.description,
    //   price: data.price,
    //   category: category,
    //   isFeatured: data.isFeatured,
    //   banner: banner,
    //   stock: data.stock,
    //   images: images,
    // };
    // console.log("Creating product with data:", data_to_save);
    // await prisma.product.create({ data: data_to_save });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product created successfully',
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Update a product
export async function updateProduct(data) {
  try {
    const product = updateProductSchema.parse(data);

    if (!product.success) {
      return {
        error: "Missing information on key fields.",
        zodErrors: validatedFields.error.flatten().fieldErrors,
        strapiErrors: null,
      };
    }
    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!productExists) throw new Error('Product not found');

    await prisma.product.update({
      where: { id: product.id },
      data: product,
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all categories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
  });

  return data;
}

// Get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  return convertToPlainObject(data);
}