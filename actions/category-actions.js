'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { categorySchema} from "@/schemas/validation-schemas";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import  prisma  from '@/prisma/prisma';


// fetch all categories
export const fetchAllCategories = async () => { 
    try {
        const _categories = await prisma.Category.findMany({
        orderBy: { category_name: 'asc' },
        });
        const categories = JSON.parse(JSON.stringify(_categories));
        return categories;
    } catch (err) {
        return({error: err + "Failed to fetch categories!"});
    }
}

  //get category data by ID
  export const fetchCategoryById = async (id) => {
    try {
      const _category = await prisma.Category.findUnique({
        where: {id: id},
        });
      const category = JSON.parse(JSON.stringify(_category));
      return category
    } catch (err) {
      return({error: err + "Failed to fetch category!"});
    }
  };


export async function createCategory(formData) {
  noStore();
  try {
       const validatedFields = categorySchema.safeParse(formData);

        if (!validatedFields.success) {
          return {
            error: "validation",
            zodErrors: validatedFields.error.flatten().fieldErrors,
            strapiErrors: null,
            message: "Missing information on key fields.",
          };
        }
    //check if category already exists
    const existingCategory = await prisma.Category.findFirst({
      where: { category_name: formData.category_name },
    });

    if (existingCategory) {
      return {
        error: "already_exists",
        message: `Category ${formData.category_name} already exists.`,
      };
    };
    //create new category
    console.log("Category data to be created:", formData);
    await prisma.Category.create({ data: formData });

    return {
      success: true,
      message: 'Category created successfully',
    };


  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

//update category action
export async function updateCategory(formData) {
  noStore();
  try {
    const id = formData.get("id");
    const category_name = formData.get("category_name");
    const isactive = Boolean(formData.get("isactive"));
    const description = formData.get("description");

    const validatedFields = categorySchema.safeParse({category_name});
    console.log("validatedFields:", validatedFields);
        if (!validatedFields.success) {
          return {
            error: "validation",
            zodErrors: validatedFields.error.flatten().fieldErrors,
            strapiErrors: null,
            message: "Missing information on key fields.",
          };
        }
    //check if category already exists
    const existingCategory = await prisma.Category.findFirst({
      where: { category_name: category_name },
    });

    if (existingCategory) {
      if (existingCategory.id != id) {
        return  {error: "already_exists",
                 message: `Category name "${category_name}"  already exists`};
      }
    }
   const data = {
      category_name: formData.category_name,
      isactive: isactive,
      description: description,
    };
    console.log("Category data to be updated:", data);
    await prisma.Category.update({
      where: { id: id },
      data: data,
    });

    return {
      success: true,
      message: 'Category updated successfully',
    };

  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

//delete category action
export async function deleteCategory(id) {
  noStore();

  try {
    await prisma.Category.delete({ where: { id: id } });
    revalidatePath('/admin/categories');
    redirect('/admin/categories');
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}