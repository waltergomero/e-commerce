import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";

async function main() {
    const prisma = new PrismaClient();
   // await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.category.deleteMany();

    //ait prisma.product.createMany({data: sampleData.products});
    await prisma.user.createMany({data: sampleData.users});
    await prisma.brand.createMany({data: sampleData.brands});
    await prisma.category.createMany({data: sampleData.categories});
    console.log('database seeded successfully!')    
}

main();