'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { brandSchema} from "@/schemas/validation-schemas";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import  prisma  from '@/prisma/prisma';


// fetch all brands
export const fetchAllBrands = async () => { 
    try {
        const _brands = await prisma.Brand.findMany({
        orderBy: { brand_name: 'asc' },
        });
        const brands = JSON.parse(JSON.stringify(_brands));
        return brands;
    } catch (err) {
        return({error: err + "Failed to fetch brands!"});
    }
}

  //get brand data by ID
  export const fetchBrandById = async (id) => {
    try {
      const _brand = await prisma.Brand.findUnique({
        where: {id: id},
        });
      const brand = JSON.parse(JSON.stringify(_brand));
      return brand
    } catch (err) {
      return({error: err + "Failed to fetch brand!"});
    }
  };


export async function createBrand(formData) {
  noStore();
  try {
       console.log("Creating brand with data:", formData);
       const validatedFields = brandSchema.safeParse(formData);

        if (!validatedFields.success) {
          return {
            error: "validation",
            zodErrors: validatedFields.error.flatten().fieldErrors,
            strapiErrors: null,
            message: "Missing information on key fields.",
          };
        }
    //check if brand already exists
    const existingBrand = await prisma.Brand.findFirst({
      where: { brand_name: formData.brand_name },
    });

    if (existingBrand) {
      return {
        error: "already_exists",
        message: `Brand ${formData.brand_name} already exists.`,
      };
    };
    //create new brand
    console.log("Brand data to be created:", formData);
    await prisma.Brand.create({ data: formData });

    return {
      success: true,
      message: 'Brand created successfully',
    };


  } catch (error) {
    console.error('Error creating brand:', error);
    throw error;
  }
}

//update brand action
export async function updateBrand(formData) {
  noStore();
  try {
    console.log("Creating brand with data:", formData);
    const id = formData.get("id");
    const brand_name = formData.get("brand_name");
    const isactive = Boolean(formData.get("isactive"));
    const description = formData.get("description");

    const validatedFields = brandSchema.safeParse({brand_name, isactive});
    console.log("validatedFields:", validatedFields);
        if (!validatedFields.success) {
          return {
            error: "validation",
            zodErrors: validatedFields.error.flatten().fieldErrors,
            strapiErrors: null,
            message: "Missing information on key fields.",
          };
        }
    //check if brand already exists
    const existingBrand = await prisma.Brand.findFirst({
      where: { brand_name: brand_name },
    });

    if (existingBrand) {
      if (existingBrand.id != id) {
        return  {error: "already_exists",
                 message: `Brand name "${brand_name}"  already exists`};
      }
    }
   const data = {
      brand_name: formData.brand_name,
      isactive: isactive,
      description: description,
    };
    console.log("Brand data to be updated:", data);
    await prisma.Brand.update({
      where: { id: id },
      data: data,
    });

    return {
      success: true,
      message: 'Brand updated successfully',
    };

  } catch (error) {
    console.error('Error updating brand:', error);
    throw error;
  }
}

//delete brand action
export async function deleteBrand(id) {
  noStore();

  try {
    await prisma.brand.delete({ where: { id: id } });
    revalidatePath('/admin/brands');
    redirect('/admin/brands');
  } catch (error) {
    console.error('Error deleting brand:', error);
    throw error;
  }
}