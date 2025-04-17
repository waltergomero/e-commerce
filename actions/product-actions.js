'use server';


import  prisma  from '@/prisma/prisma';
//import { PrismaClient } from '@prisma/client';
import { convertToPlainObject } from "@/lib/utils";
import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';

//const prisma = new PrismaClient();

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