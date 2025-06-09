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
    const productId = formData.get("product_id");
    const slug = formData.get("slug");
  

      var date = new Date();
    const unixTimestamp = Math.floor(date.getTime());

    const newName = slug + "-" + unixTimestamp + "." + ext;

    var blob = file.slice(0, file.size); 
    var newFileName = new File([blob], newName, { type: file.type });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const imageName = newFileName.name;
    const partialDir = '/images/product/images/';
    const dir = path.join(process.cwd(), 'public', partialDir);

    const dirExist = await checkPublicPath(dir);
    if(dirExist === false){
       fs.mkdirSync(dir, { recursive: true });
     }
    
    const partialPath = partialDir + imageName;
    const src = `./public/${partialPath}`
 
    await fs.writeFileSync(src, buffer);

    await prisma.ProductImages.create({
      data: {
        productId: productId,
        src: partialPath,
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
    const { image_id } = await req.json();
    if (!image_id) {
      return NextResponse.json({ status: "fail", error: "ID is required" });
    }

    const image = await prisma.ProductImages.findUnique({
      where: { id: image_id },
      select: { src: true }
    });

    if (!image || !image.src) {
      return NextResponse.json({ status: "fail", error: "Product not found." });
    }

    const imagePath = path.join(process.cwd(), 'public', image.src);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await prisma.ProductImages.delete({
      where: { id: image_id },
    });

    return NextResponse.json({ status: "success" });
  } 
  catch (e) {
    return NextResponse.json({ status: "fail", error: e.message });
  }
}