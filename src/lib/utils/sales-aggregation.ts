import { prisma as defaultPrisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

type PrismaClientLike = typeof defaultPrisma;

interface DailySalesData {
  date: Date;
  locationId: string;
  totalOrders: number;
  totalRevenue: number;
  totalTax: number;
  totalDiscount: number;
  topProducts: {
    productId: string;
    productName: string;
    category: string;
    totalQuantity: number;
    totalRevenue: number;
    orderCount: number;
  }[];
  salesByCategory: Record<
    string,
    {
      totalRevenue: number;
      totalQuantity: number;
      orderCount: number;
      percentageOfTotal: number;
      topProduct: string;
    }
  >;
}

interface TodaysSalesStats {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  totalTax: number;
  totalDiscount: number;
}

/**
 * Aggregate daily sales data for a specific date and location
 */
export async function aggregateDailySales(
  date: Date,
  locationId: string,
  prisma: PrismaClientLike = defaultPrisma
): Promise<DailySalesData> {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  // Fetch all completed orders for the day
  const completedOrders = await prisma.order.findMany({
    where: {
      locationId,
      status: "COMPLETED",
      completedAt: {
        gte: dayStart,
        lte: dayEnd,
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  // Calculate totals
  const totalOrders = completedOrders.length;
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
  const totalTax = completedOrders.reduce((sum, order) => sum + order.tax, 0);
  const totalDiscount = completedOrders.reduce((sum, order) => sum + order.discount, 0);

  // Calculate top products
  const productMap = new Map<
    string,
    {
      productId: string;
      productName: string;
      category: string;
      totalQuantity: number;
      totalRevenue: number;
      orderCount: number;
    }
  >();

  completedOrders.forEach((order) => {
    order.items.forEach((item) => {
      const existing = productMap.get(item.productId);
      if (existing) {
        existing.totalQuantity += item.quantity;
        existing.totalRevenue += item.subtotal;
        existing.orderCount += 1;
      } else {
        productMap.set(item.productId, {
          productId: item.productId,
          productName: item.product.name,
          category: item.product.category,
          totalQuantity: item.quantity,
          totalRevenue: item.subtotal,
          orderCount: 1,
        });
      }
    });
  });

  // Sort products by revenue and take top 10
  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);

  // Calculate sales by category
  const categoryMap = new Map<
    string,
    {
      totalRevenue: number;
      totalQuantity: number;
      orderCount: number;
      products: Map<string, number>;
    }
  >();

  completedOrders.forEach((order) => {
    order.items.forEach((item) => {
      const category = item.product.category;
      const existing = categoryMap.get(category);

      if (existing) {
        existing.totalRevenue += item.subtotal;
        existing.totalQuantity += item.quantity;
        const productRevenue = existing.products.get(item.product.name) || 0;
        existing.products.set(item.product.name, productRevenue + item.subtotal);
      } else {
        const products = new Map<string, number>();
        products.set(item.product.name, item.subtotal);
        categoryMap.set(category, {
          totalRevenue: item.subtotal,
          totalQuantity: item.quantity,
          orderCount: 1,
          products,
        });
      }
    });
  });

  // Convert category map to final format
  const salesByCategory: Record<string, any> = {};
  categoryMap.forEach((value, category) => {
    // Find top product in this category
    let topProduct = "";
    let topProductRevenue = 0;
    value.products.forEach((revenue, productName) => {
      if (revenue > topProductRevenue) {
        topProductRevenue = revenue;
        topProduct = productName;
      }
    });

    salesByCategory[category] = {
      totalRevenue: value.totalRevenue,
      totalQuantity: value.totalQuantity,
      orderCount: value.orderCount,
      percentageOfTotal: totalRevenue > 0 ? (value.totalRevenue / totalRevenue) * 100 : 0,
      topProduct,
    };
  });

  return {
    date: dayStart,
    locationId,
    totalOrders,
    totalRevenue,
    totalTax,
    totalDiscount,
    topProducts,
    salesByCategory,
  };
}

/**
 * Calculate today's sales in real-time (for dashboard display)
 */
export async function calculateTodaysSales(
  locationId: string,
  prisma: PrismaClientLike = defaultPrisma
): Promise<TodaysSalesStats> {
  const today = new Date();
  const dayStart = startOfDay(today);
  const dayEnd = endOfDay(today);

  // Fetch today's completed orders
  const completedOrders = await prisma.order.findMany({
    where: {
      locationId,
      status: "COMPLETED",
      completedAt: {
        gte: dayStart,
        lte: dayEnd,
      },
    },
    select: {
      total: true,
      tax: true,
      discount: true,
    },
  });

  const orderCount = completedOrders.length;
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
  const totalTax = completedOrders.reduce((sum, order) => sum + order.tax, 0);
  const totalDiscount = completedOrders.reduce((sum, order) => sum + order.discount, 0);
  const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

  return {
    totalRevenue,
    orderCount,
    averageOrderValue,
    totalTax,
    totalDiscount,
  };
}

/**
 * Upsert daily sales data into the DailySales table
 */
export async function upsertDailySales(
  date: Date,
  locationId: string,
  prisma: PrismaClientLike = defaultPrisma
): Promise<any> {
  const aggregatedData = await aggregateDailySales(date, locationId, prisma);
  const dateOnly = startOfDay(date);

  const dailySales = await prisma.dailySales.upsert({
    where: {
      date_locationId: {
        date: dateOnly,
        locationId: aggregatedData.locationId,
      },
    },
    create: {
      date: dateOnly,
      locationId: aggregatedData.locationId,
      totalOrders: aggregatedData.totalOrders,
      totalRevenue: aggregatedData.totalRevenue,
      totalTax: aggregatedData.totalTax,
      totalDiscount: aggregatedData.totalDiscount,
      topProducts: aggregatedData.topProducts,
      salesByCategory: aggregatedData.salesByCategory,
    },
    update: {
      totalOrders: aggregatedData.totalOrders,
      totalRevenue: aggregatedData.totalRevenue,
      totalTax: aggregatedData.totalTax,
      totalDiscount: aggregatedData.totalDiscount,
      topProducts: aggregatedData.topProducts,
      salesByCategory: aggregatedData.salesByCategory,
    },
  });

  return dailySales;
}
