import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create location
  const location = await prisma.location.upsert({
    where: { id: "main-branch" },
    update: {},
    create: {
      id: "main-branch",
      name: "Main Branch",
      address: "123 Coffee Street, City Center",
      phone: "+91-9876543210",
      isActive: true,
    },
  });
  console.log("✓ Location created");

  // Create admin user
  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@my-cafemate.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@my-cafemate.com",
      password: hashedAdminPassword,
      role: "ADMIN",
      locationId: location.id,
    },
  });
  console.log("✓ Admin user created (email: admin@my-cafemate.com, password: admin123)");

  // Create staff user
  const hashedStaffPassword = await bcrypt.hash("staff123", 10);
  const staffUser = await prisma.user.upsert({
    where: { email: "staff@my-cafemate.com" },
    update: {},
    create: {
      name: "Staff User",
      email: "staff@my-cafemate.com",
      password: hashedStaffPassword,
      role: "STAFF",
      locationId: location.id,
    },
  });
  console.log("✓ Staff user created (email: staff@my-cafemate.com, password: staff123)");

  // Create kitchen staff user
  const hashedKitchenPassword = await bcrypt.hash("kitchen123", 10);
  const kitchenUser = await prisma.user.upsert({
    where: { email: "kitchen@my-cafemate.com" },
    update: {},
    create: {
      name: "Kitchen User",
      email: "kitchen@my-cafemate.com",
      password: hashedKitchenPassword,
      role: "KITCHEN_STAFF",
      locationId: location.id,
    },
  });
  console.log("✓ Kitchen user created (email: kitchen@my-cafemate.com, password: kitchen123)");

  // Create tables
  const tableNumbers = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10"];
  for (const tableNum of tableNumbers) {
    await prisma.table.upsert({
      where: {
        number_locationId: {
          number: tableNum,
          locationId: location.id,
        }
      },
      update: {},
      create: {
        number: tableNum,
        capacity: tableNum === "T9" || tableNum === "T10" ? 4 : 2,
        status: "AVAILABLE",
        locationId: location.id,
      },
    });
  }
  console.log("✓ Tables created (T1-T10)");

  // Create product categories
  const defaultCategories = [
    { id: "cat_tea", name: "Tea", slug: "TEA", sortOrder: 1 },
    { id: "cat_coffee", name: "Coffee", slug: "COFFEE", sortOrder: 2 },
    { id: "cat_cold_beverage", name: "Cold Beverage", slug: "COLD_BEVERAGE", sortOrder: 3 },
    { id: "cat_snacks", name: "Snacks", slug: "SNACKS", sortOrder: 4 },
    { id: "cat_desserts", name: "Desserts", slug: "DESSERTS", sortOrder: 5 },
    { id: "cat_other", name: "Other", slug: "OTHER", sortOrder: 6 },
  ];

  for (const cat of defaultCategories) {
    await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✓ Product categories created");

  // Create products
  const products = [
    {
      name: "Masala Chai",
      description: "Traditional Indian spiced tea",
      category: "TEA",
      price: 30,
      isAvailable: true,
    },
    {
      name: "Ginger Tea",
      description: "Refreshing ginger infused tea",
      category: "TEA",
      price: 35,
      isAvailable: true,
    },
    {
      name: "Cardamom Tea",
      description: "Aromatic cardamom flavored tea",
      category: "TEA",
      price: 35,
      isAvailable: true,
    },
    {
      name: "Cappuccino",
      description: "Classic Italian coffee with steamed milk foam",
      category: "COFFEE",
      price: 80,
      isAvailable: true,
    },
    {
      name: "Latte",
      description: "Smooth espresso with steamed milk",
      category: "COFFEE",
      price: 90,
      isAvailable: true,
    },
    {
      name: "Espresso",
      description: "Strong and bold Italian coffee",
      category: "COFFEE",
      price: 60,
      isAvailable: true,
    },
    {
      name: "Americano",
      description: "Espresso diluted with hot water",
      category: "COFFEE",
      price: 70,
      isAvailable: true,
    },
    {
      name: "Cold Coffee",
      description: "Iced coffee blended with milk and ice cream",
      category: "COLD_BEVERAGE",
      price: 100,
      isAvailable: true,
    },
    {
      name: "Iced Tea",
      description: "Refreshing chilled tea with lemon",
      category: "COLD_BEVERAGE",
      price: 60,
      isAvailable: true,
    },
    {
      name: "Samosa",
      description: "Crispy fried pastry with spiced potato filling",
      category: "SNACKS",
      price: 20,
      isAvailable: true,
    },
    {
      name: "Veg Sandwich",
      description: "Grilled sandwich with fresh vegetables",
      category: "SNACKS",
      price: 60,
      isAvailable: true,
    },
    {
      name: "Cheese Sandwich",
      description: "Grilled sandwich loaded with cheese",
      category: "SNACKS",
      price: 80,
      isAvailable: true,
    },
    {
      name: "Brownie",
      description: "Rich chocolate brownie",
      category: "DESSERTS",
      price: 80,
      isAvailable: true,
    },
    {
      name: "Cheesecake",
      description: "Creamy New York style cheesecake",
      category: "DESSERTS",
      price: 120,
      isAvailable: true,
    },
    {
      name: "Cookie",
      description: "Freshly baked chocolate chip cookie",
      category: "DESSERTS",
      price: 40,
      isAvailable: true,
    },
  ];

  // Create or update products
  const createdProducts: Record<string, any> = {};
  for (const product of products) {
    const created = await prisma.product.upsert({
      where: {
        id: `product-${product.name.toLowerCase().replace(/\s+/g, '-')}`
      },
      update: product,
      create: {
        id: `product-${product.name.toLowerCase().replace(/\s+/g, '-')}`,
        ...product,
      },
    });
    createdProducts[product.name] = created;
  }
  console.log("✓ Products created (15 items across all categories)");

  // Create inventory items
  const teaLeavesInv = await prisma.inventory.create({
    data: {
      name: "Tea Leaves",
      unit: "kg",
      locationId: location.id,
      items: {
        create: {
          currentStock: 50,
          minimumStock: 10,
          maximumStock: 100,
        },
      },
    },
  });

  const coffeeBeansInv = await prisma.inventory.create({
    data: {
      name: "Coffee Beans",
      unit: "kg",
      locationId: location.id,
      items: {
        create: {
          currentStock: 30,
          minimumStock: 8,
          maximumStock: 60,
        },
      },
    },
  });

  const milkInv = await prisma.inventory.create({
    data: {
      name: "Milk",
      unit: "liters",
      locationId: location.id,
      items: {
        create: {
          currentStock: 40,
          minimumStock: 15,
          maximumStock: 80,
        },
      },
    },
  });

  const sugarInv = await prisma.inventory.create({
    data: {
      name: "Sugar",
      unit: "kg",
      locationId: location.id,
      items: {
        create: {
          currentStock: 25,
          minimumStock: 10,
          maximumStock: 50,
        },
      },
    },
  });

  console.log("✓ Inventory items created");

  // Delete existing recipe items first (for re-running seed)
  await prisma.recipeItem.deleteMany({});

  // Create recipe items (link products to inventory ingredients)
  const recipes = [
    // Tea products (use tea leaves, milk, sugar)
    { product: "Masala Chai", inventory: teaLeavesInv.id, quantity: 0.015 }, // 15g per cup
    { product: "Masala Chai", inventory: milkInv.id, quantity: 0.15 }, // 150ml per cup
    { product: "Masala Chai", inventory: sugarInv.id, quantity: 0.01 }, // 10g per cup

    { product: "Ginger Tea", inventory: teaLeavesInv.id, quantity: 0.015 },
    { product: "Ginger Tea", inventory: milkInv.id, quantity: 0.15 },
    { product: "Ginger Tea", inventory: sugarInv.id, quantity: 0.01 },

    { product: "Cardamom Tea", inventory: teaLeavesInv.id, quantity: 0.015 },
    { product: "Cardamom Tea", inventory: milkInv.id, quantity: 0.15 },
    { product: "Cardamom Tea", inventory: sugarInv.id, quantity: 0.01 },

    // Coffee products (use coffee beans, milk, sugar)
    { product: "Cappuccino", inventory: coffeeBeansInv.id, quantity: 0.018 }, // 18g per cup
    { product: "Cappuccino", inventory: milkInv.id, quantity: 0.12 }, // 120ml per cup
    { product: "Cappuccino", inventory: sugarInv.id, quantity: 0.008 },

    { product: "Latte", inventory: coffeeBeansInv.id, quantity: 0.018 },
    { product: "Latte", inventory: milkInv.id, quantity: 0.18 }, // 180ml per cup
    { product: "Latte", inventory: sugarInv.id, quantity: 0.008 },

    { product: "Espresso", inventory: coffeeBeansInv.id, quantity: 0.014 }, // 14g per shot
    { product: "Espresso", inventory: sugarInv.id, quantity: 0.005 },

    { product: "Americano", inventory: coffeeBeansInv.id, quantity: 0.014 },
    { product: "Americano", inventory: sugarInv.id, quantity: 0.008 },

    // Cold beverages
    { product: "Cold Coffee", inventory: coffeeBeansInv.id, quantity: 0.02 },
    { product: "Cold Coffee", inventory: milkInv.id, quantity: 0.2 },
    { product: "Cold Coffee", inventory: sugarInv.id, quantity: 0.015 },

    { product: "Iced Tea", inventory: teaLeavesInv.id, quantity: 0.012 },
    { product: "Iced Tea", inventory: sugarInv.id, quantity: 0.012 },
  ];

  for (const recipe of recipes) {
    const product = createdProducts[recipe.product];
    if (product) {
      await prisma.recipeItem.create({
        data: {
          productId: product.id,
          inventoryId: recipe.inventory,
          quantityUsed: recipe.quantity,
        },
      });
    }
  }

  console.log("✓ Recipe items created (products linked to inventory)");

  console.log("\n✅ Database seeded successfully!");
  console.log("\nLogin credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin: admin@my-cafemate.com / admin123");
  console.log("Staff: staff@my-cafemate.com / staff123");
  console.log("Kitchen: kitchen@my-cafemate.com / kitchen123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
