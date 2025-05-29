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

// Create a product
export async function createProduct(formData) {
  try {
        const product_name =  formData.get("product_name");
        const slug = formData.get("slug");
        const brand = formData.get("brand");
        const description = formData.get("description");
        const price = Number(formData.get("price"));
        const category = formData.get("category");
        const isFeatured = formData.get("isFeatured") === "on" ? true : false;
        const banner = formData.get("banner");
        const stock = Number(formData.get("stock"));
        const images = formData.getAll("images") || [];
        // Convert images to an array of strings
        if (typeof images === 'string') {
          throw new Error('Images must be an array of strings');
        }

    // Validate required fields  
      const validatedFields = productSchema.safeParse({
        product_name,
        slug,
        brand,
        description,
        price,
        category,
        isFeatured,
        banner,
        stock,
        images
      });
      
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
      where: { slug: slug },
    });
    
    if (existingProduct) {
      return {
        error: "already_exists",
        message: "Product with this slug already exists.",
      };
    }

    const data = {
      product_name: product_name,
      slug: slug,
      brand: brand,
      description: description,
      price: price,
      category: category,
      isFeatured: isFeatured,
      banner: banner,
      stock: stock,
      images: images,
    };
    console.log("Creating product with data:", data);
    await prisma.product.create({ data: data });

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