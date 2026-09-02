import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding database with products, categories, and craft types...');

  // --- Seed Categories ---
  const categories = [
    { name: 'Home Decor', description: 'Handcrafted items for your home', image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop' },
    { name: 'Kitchen', description: 'Pottery, utensils, and kitchen accessories', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop' },
    { name: 'Accessories', description: 'Bags, wallets, and wearable accessories', image: 'https://images.unsplash.com/photo-1599643477873-ce830919fcd4?w=800&auto=format&fit=crop' },
    { name: 'Jewelry', description: 'Handmade rings, necklaces, and earrings', image: 'https://images.unsplash.com/photo-1599643477873-ce830919fcd4?w=800&auto=format&fit=crop' }, // re-used accessories image for jewelry
    { name: 'Art', description: 'Original paintings, prints, and sculptures', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop' }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: { image: cat.image },
      create: { name: cat.name, description: cat.description, image: cat.image }
    });
  }

  // --- Seed Craft Types ---
  const craftTypes = [
    { name: 'Crochet', description: 'Yarn crafts and amigurumi' },
    { name: 'Knitting', description: 'Hand-knitted garments and textiles' },
    { name: 'Weaving', description: 'Textile arts and weaving' },
    { name: 'Pottery', description: 'Ceramic arts and clay throwing' },
    { name: 'Leatherwork', description: 'Handcrafted leather goods' },
    { name: 'Macrame', description: 'Knotting and textile crafts' },
    { name: 'Metalwork', description: 'Silversmithing and metal arts' },
    { name: 'Candle Making', description: 'Hand-poured candles and scents' },
    { name: 'Woodworking', description: 'Carved and assembled wooden goods' }
  ];

  for (const craft of craftTypes) {
    await prisma.craftType.upsert({
      where: { name: craft.name },
      update: {},
      create: { name: craft.name, description: craft.description }
    });
  }

  // Create a Crafter user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const crafterUser = await prisma.user.upsert({
    where: { email: 'crafter@dorovu.com' },
    update: {},
    create: {
      email: 'crafter@dorovu.com',
      password: hashedPassword,
      firstName: 'Alice',
      lastName: 'Artisan',
      role: 'CRAFTER',
    },
  });

  // Create their store
  const store = await prisma.crafterStore.upsert({
    where: { crafterId: crafterUser.id },
    update: {},
    create: {
      crafterId: crafterUser.id,
      storeName: "Alice's Wonders",
      description: 'Handcrafted goods with love.',
      craftType: 'Mixed',
      isApproved: true,
    },
  });

  // Create products
  const products = [
    {
      title: 'Handwoven Wool Blanket',
      description: 'Cozy and warm blanket made from 100% organic wool.',
      price: 12000,
      category: 'Home Decor',
      craftType: 'Weaving',
      tags: ['blanket', 'wool', 'winter', 'cozy'],
      images: ['https://images.unsplash.com/photo-1596704176466-932d84784a9e?w=800&auto=format&fit=crop'],
      leadTime: 5,
      variants: [
        { name: 'Standard (50x60")', stock: 10, priceAdjustment: 0 },
        { name: 'Large (60x80")', stock: 5, priceAdjustment: 3000 },
      ]
    },
    {
      title: 'Ceramic Coffee Mug',
      description: 'Hand-thrown ceramic mug perfect for your morning brew.',
      price: 1500,
      category: 'Kitchen',
      craftType: 'Pottery',
      tags: ['mug', 'ceramic', 'coffee', 'kitchen'],
      images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&auto=format&fit=crop'],
      leadTime: 2,
      variants: [
        { name: 'Blue Glaze', stock: 20, priceAdjustment: 0 },
        { name: 'White Matte', stock: 15, priceAdjustment: 0 },
      ]
    },
    {
      title: 'Leather Bifold Wallet',
      description: 'Minimalist leather bifold wallet, hand-stitched for durability.',
      price: 3500,
      category: 'Accessories',
      craftType: 'Leatherwork',
      tags: ['leather', 'wallet', 'minimalist', 'accessories'],
      images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop'],
      leadTime: 3,
      variants: [
        { name: 'Brown', stock: 12, priceAdjustment: 0 },
        { name: 'Black', stock: 8, priceAdjustment: 0 },
      ]
    },
    {
      title: 'Macrame Wall Hanging',
      description: 'Boho style wall decor made with natural cotton cord.',
      price: 4500,
      category: 'Home Decor',
      craftType: 'Macrame',
      tags: ['macrame', 'decor', 'boho', 'wall art'],
      images: ['https://images.unsplash.com/photo-1616428389330-802525cc9697?w=800&auto=format&fit=crop'],
      leadTime: 4,
      variants: [
        { name: 'Medium (30cm width)', stock: 5, priceAdjustment: 0 },
        { name: 'Large (50cm width)', stock: 3, priceAdjustment: 2000 },
      ]
    },
    {
      title: 'Silver Statement Ring',
      description: 'Handcrafted sterling silver ring with unique texture.',
      price: 8000,
      category: 'Jewelry',
      craftType: 'Metalwork',
      tags: ['ring', 'silver', 'jewelry', 'statement'],
      images: ['https://images.unsplash.com/photo-1605100804763-247f67b2548e?w=800&auto=format&fit=crop'],
      leadTime: 7,
      variants: [
        { name: 'Size 6', stock: 2, priceAdjustment: 0 },
        { name: 'Size 7', stock: 2, priceAdjustment: 0 },
        { name: 'Size 8', stock: 2, priceAdjustment: 0 },
      ]
    },
    {
      title: 'Hand-poured Soy Candle',
      description: 'Lavender & Vanilla scented candle in a reusable amber glass jar.',
      price: 1800,
      category: 'Home Decor',
      craftType: 'Candle Making',
      tags: ['candle', 'soy', 'lavender', 'cozy', 'decor'],
      images: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop'],
      leadTime: 2,
      variants: [
        { name: '8 oz', stock: 30, priceAdjustment: 0 },
        { name: '16 oz', stock: 15, priceAdjustment: 1200 },
      ]
    }
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({ where: { title: product.title } });
    if (!existing) {
      await prisma.product.create({
        data: {
          crafterId: store.id,
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          craftType: product.craftType,
          tags: product.tags,
          images: product.images,
          leadTime: product.leadTime,
          totalSales: Math.floor(Math.random() * 50),
          avgRating: 4 + Math.random(),
          variants: {
            create: product.variants,
          },
        }
      });
    }
  }

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
