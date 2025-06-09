'use server';

import  prisma  from '@/prisma/prisma';
import { convertToPlainObject } from "@/lib/utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '@/lib/constants';
import { productSchema,updateProductSchema } from '@/schemas/validation-schemas';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';
import ProductImages from '@/components/product/product-images';

//get all products
export async function getLatestProducts() {
    const data = await prisma.Product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        include: {
        ProductImages: true,
      },
        orderBy:{createdAt: 'desc'},
    })
 console.log("Latest products data:", data);
    return convertToPlainObject(data);
}

//get single product by slug
export async function getProductBySlug(slug){
    noStore();
    const _product = await prisma.Product.findFirst({
        where: {slug: slug},
        include: {
        ProductImages: true,
      },
    });
     
    return convertToPlainObject(_product);
}

//get single product by id
export async function fetchProductById(id){
    noStore();
    const _product = await prisma.Product.findFirst({
        where: {id: id},
        include: {
          ProductImages: true,
        },
    });
  
    return convertToPlainObject(_product);
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

//fetch product images
export async function fetchProductImages(productId) {
  try {
    const images = await prisma.ProductImages.findMany({
      where: { productId: productId },
    });

    return convertToPlainObject(images);
  } catch (error) {
    console.error("Error fetching product images:", error);
    return [];
  }
}


async function checkPublicPath(dir){
  const result =  await fs.existsSync(dir);
  return result;
};

// Create a product
export async function createProduct(formData) {
  try {
    console.log("Creating product with formData:", formData);
      const product_name = formData.get("product_name");    
      const slug = formData.get("slug");
      const category_id = formData.get("category_id");
      const category_name = formData.get("category_name"); 
      const brand_id = formData.get("brand_id");
      const brand_name = formData.get("brand_name");
      const stock = Number(formData.get("stock")); 
      const price = parseFloat(formData.get("price"));
      const banner = formData.get("banner");
      const description = formData.get("description"); 

    const validatedFields = productSchema.safeParse({
      product_name,
      slug,
      category_id,
      brand_id,
      stock,
      price,
      description
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
    const existingProduct = await prisma.Product.findFirst({
      where: { slug: slug },
    });
    
    if (existingProduct) {
      return {
        error: "already_exists",
        message: "Product with this slug already exists.",
      };
    }

    const data_to_save = {
      product_name: product_name,
      slug: slug,
      category_id: category_id,
      category_name: category_name,
      brand_id: brand_id,
      brand_name: brand_name,
      price: price,
      stock: stock,
      banner: banner,
      description: description,
    };
    await prisma.Product.create({ data: data_to_save });
    return {
      success: true,
      message: 'Product created successfully',
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, message: error.message };
  }
}

// Update a product
export async function updateProduct(formData) {
  try {
      console.log("Update product with formData:", formData);
      const product_id = formData.get("product_id");  
      const product_name = formData.get("product_name");    
      const slug = formData.get("slug");
      const category_id = formData.get("category_id");
      const category_name = formData.get("category_name"); 
      const brand_id = formData.get("brand_id");
      const brand_name = formData.get("brand_name");
      const stock = Number(formData.get("stock")); 
      const price = parseFloat(formData.get("price"));
      const description = formData.get("description"); 

    const validatedFields = productSchema.safeParse({
      product_name,
      slug,
      category_id,
      brand_id,
      stock,
      price,
      description
    });

          console.log("validatedFields:", validatedFields);
    if (!validatedFields.success) {
      return {
        error: "Missing information on key fields.",
        zodErrors: validatedFields.error.flatten().fieldErrors,
        strapiErrors: null,
      };
    }


    const productExists = await prisma.Product.findFirst({
      where: { id: product_id },
    });

    if (!productExists) throw new Error('Product not found');
    //check if product with same slug exists
    const existingProduct = await prisma.Product.findFirst({
      where: { slug: slug, id: { not: product_id } },
    });
    console.log("Existing product:", existingProduct);
      const data_to_update = {
      product_name: product_name,
      slug: slug,
      category_id: category_id,
      category_name: category_name,
      brand_id: brand_id,
      brand_name: brand_name,
      price: price,
      stock: stock,
      description: description,
    };
    console.log("Data to update:", data_to_update);
    await prisma.Product.update({
      where: { id: product_id },
      data: data_to_update,
    });

    return {
      success: true,
      message: 'Product updated successfully',
    };
  } catch (error) {
    return { success: false, message: (error.message) };
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