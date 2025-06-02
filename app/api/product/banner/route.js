import { NextResponse } from "next/server";
import { productSchema } from '@/schemas/validation-schemas';
import fs from "node:fs/promises";
import prisma from "@/lib/prisma";



export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("image");
    const ext = formData.get("extension");
    const product_name = formData.get("product_name");    
    const slug = formData.get("slug");
    const category_id = formData.get("category_id");
    const category_name = formData.get("category_name"); 
    const brand_id = formData.get("brand_id");
    const brand_name = formData.get("brand_name");
    const stock = Number(formData.get("stock")); 
    const price = parseFloat(formData.get("price"));
    const isFeatured = Boolean(formData.get("isFeatured"));
    const description = formData.get("description"); 

    const validatedFields = productSchema.safeParse({
      product_name,
      slug,
      category_id,
      brand_id,
      stock,
      price,
      isFeatured,
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

    const newName = slug + "." + ext;

    var blob = file.slice(0, file.size); 
    var newFileName = new File([blob], newName, { type: file.type });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const imageName = newFileName.name;

    const partialDir = '/images/product/banner/';
    const dir = path.join(process.cwd(), 'public', partialDir);
  
    const dirExist = await checkPublicPath(dir);

    if(dirExist === false){
       fs.mkdirSync(dir, { recursive: true });
     }
    
    const partialPath = partialDir + "/" + imageName;
    const src = `./public/${partialPath}`
 
    await fs.writeFileSync(src, buffer);
    
    const newProduct = {
      product_name: product_name,
      slug: slug,
      category_id: category_id,
      category_name: category_name,
      brand_id: brand_id,
      brand_name: brand_name,
      price: price,
      stock: stock,
      isFeatured: isFeatured,
      banner: partialPath,
      description: description,
    };
 
    await prisma.Product.create({data: newProduct});

    return NextResponse.json({ status: "success" });
  } 
  catch (e) {
    return NextResponse.json({ status: "fail", error: e });
  }
}

async function checkPublicPath(dir){
  const result =  await fs.existsSync(dir);
  return result;
};