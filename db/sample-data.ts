
import { Description } from "@radix-ui/react-dialog";
import bcryptjs from "bcryptjs";

const salt = bcryptjs.genSaltSync(10)
const hashedPassword = bcryptjs.hashSync('C#luisa1961', salt)


const sampleData = {
  users: [
    {
      first_name: 'Walter',
      last_name: 'Gomero',
      name: 'Walter Gomero',
      email: 'walter.gomero@gmail.com',
      password: hashedPassword,
      isadmin: true,
    },
    {
      first_name: 'Luisa',
      last_name: 'Gomero',
      name: 'Luisa Gomero',
      email: 'luisaqgomero@hotmail.com',
      password: hashedPassword,
      isadmin: false,
    }
  ],
  brands: [
    {
      brand_name: 'Polo',
      description: 'Elegant and timeless fashion brand known for its classic styles and quality craftsmanship.',
    },
    {
      brand_name: 'Brooks Brothers',
      description: 'Brooks Brothers is an American clothing brand known for its classic and preppy styles.',
    },
    {
      brand_name: 'Tommy Hilfiger',
      description: 'Tommy Hilfiger is a premium lifestyle brand known for its classic American style.',
    }
  ],
    categories: [
    {
      category_name: "Men's Dress Shirts",
      description: 'Shirts designed for formal occasions and professional settings.',
    },
  ],

  products: [
    {
      product_name: 'Polo Sporting Stretch Shirt',
      slug: 'polo-sporting-stretch-shirt',
      category: "Men's Dress Shirts",
      description: 'Classic Polo style with modern comfort',
      images: [
        '/images/sample-products/p1-1.jpg',
        '/images/sample-products/p1-2.jpg',
      ],
      price: 59.99,
      brand: 'Polo',
      rating: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: true,
      banner: 'banner-1.jpg',
    },
    {
      product_name: 'Brooks Brothers Long Sleeved Shirt',
      slug: 'brooks-brothers-long-sleeved-shirt',
      category: "Men's Dress Shirts",
      description: 'Timeless style and premium comfort',
      images: [
        '/images/sample-products/p2-1.jpg',
        '/images/sample-products/p2-2.jpg',
      ],
      price: 85.9,
      brand: 'Brooks Brothers',
      rating: 4.2,
      numReviews: 8,
      stock: 10,
      isFeatured: true,
      banner: 'banner-2.jpg',
    },
    {
      product_name: 'Tommy Hilfiger Classic Fit Dress Shirt',
      slug: 'tommy-hilfiger-classic-fit-dress-shirt',
      category: "Men's Dress Shirts",
      description: 'A perfect blend of sophistication and comfort',
      images: [
        '/images/sample-products/p3-1.jpg',
        '/images/sample-products/p3-2.jpg',
      ],
      price: 99.95,
      brand: 'Tommy Hilfiger',
      rating: 4.9,
      numReviews: 3,
      stock: 0,
      isFeatured: false,
      banner: null,
    },
    {
      product_name: 'Calvin Klein Slim Fit Stretch Shirt',
      slug: 'calvin-klein-slim-fit-stretch-shirt',
      category: "Men's Dress Shirts",
      description: 'Streamlined design with flexible stretch fabric',
      images: [
        '/images/sample-products/p4-1.jpg',
        '/images/sample-products/p4-2.jpg',
      ],
      price: 39.95,
      brand: 'Calvin Klein',
      rating: 3.6,
      numReviews: 5,
      stock: 10,
      isFeatured: false,
      banner: null,
    },
    {
      product_name: 'Polo Ralph Lauren Oxford Shirt',
      slug: 'polo-ralph-lauren-oxford-shirt',
      category: "Men's Dress Shirts",
      description: 'Iconic Polo design with refined oxford fabric',
      images: [
        '/images/sample-products/p5-1.jpg',
        '/images/sample-products/p5-2.jpg',
      ],
      price: 79.99,
      brand: 'Polo',
      rating: 4.7,
      numReviews: 18,
      stock: 6,
      isFeatured: false,
      banner: null,
    },
    {
      product_name: 'Polo Classic Pink Hoodie',
      slug: 'polo-classic-pink-hoodie',
      category: "Men's Sweatshirts",
      description: 'Soft, stylish, and perfect for laid-back days',
      images: [
        '/images/sample-products/p6-1.jpg',
        '/images/sample-products/p6-2.jpg',
      ],
      price: 99.99,
      brand: 'Polo',
      rating: 4.6,
      numReviews: 12,
      stock: 8,
      isFeatured: true,
      banner: null,
    },
  ],
};

export default sampleData;
