import { NextResponse } from "next/server";
import { productSchema } from '@/schemas/validation-schemas';
import path from 'path';
const fs = require('fs');
import prisma from "@/prisma/prisma";



export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const ext = formData.get("extension");
    const slug = formData.get("slug");

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
    
    const partialPath = partialDir + imageName;
    const src = `./public/${partialPath}`
 
    await fs.writeFileSync(src, buffer);
    
    await prisma.Product.update({
      where: {slug: slug},
      data: {
        banner: partialPath,
        } 
    });

    return NextResponse.json({ status: "success" });
  } 
  catch (e) {
    return NextResponse.json({ status: "fail", error: e });
  }
}

async function checkPublicPath(dir){
  const result = await fs.existsSync(dir);
  return result;
};

export async function DELETE(req) {
  try {
    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ status: "fail", error: "Slug is required" });
    }

    const product = await prisma.Product.findUnique({
      where: { slug: slug },
      select: { banner: true }
    });

    if (!product || !product.banner) {
      return NextResponse.json({ status: "fail", error: "Product not found or no banner image" });
    }

    const imagePath = path.join(process.cwd(), 'public', product.banner);
    
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await prisma.Product.update({
      where: { slug: slug },
      data: { banner: null }
    });

    return NextResponse.json({ status: "success" });
  } 
  catch (e) {
    return NextResponse.json({ status: "fail", error: e.message });
  }
}