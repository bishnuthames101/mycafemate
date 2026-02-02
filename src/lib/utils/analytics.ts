import { prisma as defaultPrisma } from "@/lib/prisma";
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from "date-fns";

type PrismaClientLike = typeof defaultPrisma;

interface WeeklySalesData {
  date: string;
  revenue: number;
  orders: number;
}

interface MonthlySalesData {
  week: number;
  revenue: number;
  orders: number;
  growth: number;
}

interface TopProduct {
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  revenue: number;
}

interface CategorySales {
  category: string;
  revenue: number;
  quantity: number;
  orderCount: number;
  percentage: number;
}

interface RevenueMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalTax: number;
  totalDiscount: number;
  growth: number;
  peakDay: string;
  revenuePerDay: number;
  paymentMethodBreakdown: {
    method: string;
    count: number;
    revenue: number;
    percentage: number;
  }[];
}

export async function getWeeklySalesData(
  locationId: string,
  weekOffset: number = 0,
  prisma: PrismaClientLike = defaultPrisma
): Promise<WeeklySalesData[]> {
  const today = new Date();
  const targetDate = subDays(today, weekOffset * 7);
  const weekStart = startOfWeek(targetDate);
  const weekEnd = endOfWeek(targetDate);

  const dailySales = await prisma.dailySales.findMany({
    where: {
      locationId,
      date: {
        gte: weekStart,
        lte: weekEnd,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  return dailySales.map((sale) => ({
    date: format(sale.date, "yyyy-MM-dd"),
    revenue: sale.totalRevenue,
    orders: sale.totalOrders,
  }));
}

export async function getMonthlySalesData(
  locationId: string,
  month: number,
  year: number,
  prisma: PrismaClientLike = defaultPrisma
): Promise<MonthlySalesData[]> {
  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(new Date(year, month - 1));

  const dailySales = await prisma.dailySales.findMany({
    where: {
      locationId,
      date: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  // Group by week
  const weeklyData: Map<number, { revenue: number; orders: number }> = new Map();
  dailySales.forEach((sale) => {
    const weekNum = Math.ceil(sale.date.getDate() / 7);
    const existing = weeklyData.get(weekNum) || { revenue: 0, orders: 0 };
    weeklyData.set(weekNum, {
      revenue: existing.revenue + sale.totalRevenue,
      orders: existing.orders + sale.totalOrders,
    });
  });

  // Calculate growth
  const weeks = Array.from(weeklyData.entries()).map(([week, data], index, arr) => {
    const prevWeekData = index > 0 ? arr[index - 1][1] : null;
    const growth = prevWeekData
      ? ((data.revenue - prevWeekData.revenue) / prevWeekData.revenue) * 100
      : 0;

    return {
      week,
      revenue: data.revenue,
      orders: data.orders,
      growth: Math.round(growth * 100) / 100,
    };
  });

  return weeks;
}

export async function getTopProductsReport(
  locationId: string,
  startDate: Date,
  endDate: Date,
  limit: number = 10,
  prisma: PrismaClientLike = defaultPrisma
): Promise<TopProduct[]> {
  const dailySales = await prisma.dailySales.findMany({
    where: {
      locationId,
      date: {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate),
      },
    },
    select: {
      topProducts: true,
    },
  });

  // Aggregate products across all days
  const productMap = new Map<string, TopProduct>();

  dailySales.forEach((sale) => {
    const products = sale.topProducts as any[];
    products.forEach((product) => {
      const existing = productMap.get(product.productId);
      if (existing) {
        existing.quantity += product.totalQuantity;
        existing.revenue += product.totalRevenue;
      } else {
        productMap.set(product.productId, {
          productId: product.productId,
          productName: product.productName,
          category: product.category,
          quantity: product.totalQuantity,
          revenue: product.totalRevenue,
        });
      }
    });
  });

  return Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export async function getCategoryBreakdown(
  locationId: string,
  startDate: Date,
  endDate: Date,
  prisma: PrismaClientLike = defaultPrisma
): Promise<CategorySales[]> {
  const dailySales = await prisma.dailySales.findMany({
    where: {
      locationId,
      date: {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate),
      },
    },
    select: {
      salesByCategory: true,
      totalRevenue: true,
    },
  });

  const categoryMap = new Map<string, Omit<CategorySales, "percentage">>();
  let totalRevenue = 0;

  dailySales.forEach((sale) => {
    totalRevenue += sale.totalRevenue;
    const categories = sale.salesByCategory as Record<string, any>;

    Object.entries(categories).forEach(([category, data]) => {
      const existing = categoryMap.get(category);
      if (existing) {
        existing.revenue += data.totalRevenue;
        existing.quantity += data.totalQuantity;
        existing.orderCount += data.orderCount;
      } else {
        categoryMap.set(category, {
          category,
          revenue: data.totalRevenue,
          quantity: data.totalQuantity,
          orderCount: data.orderCount,
        });
      }
    });
  });

  return Array.from(categoryMap.values())
    .map((cat) => ({
      ...cat,
      percentage: totalRevenue > 0 ? (cat.revenue / totalRevenue) * 100 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export async function getRevenueMetrics(
  locationId: string,
  startDate: Date,
  endDate: Date,
  prisma: PrismaClientLike = defaultPrisma
): Promise<RevenueMetrics> {
  const dailySales = await prisma.dailySales.findMany({
    where: {
      locationId,
      date: {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate),
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  const totalRevenue = dailySales.reduce((sum, sale) => sum + sale.totalRevenue, 0);
  const totalOrders = dailySales.reduce((sum, sale) => sum + sale.totalOrders, 0);
  const totalTax = dailySales.reduce((sum, sale) => sum + sale.totalTax, 0);
  const totalDiscount = dailySales.reduce((sum, sale) => sum + sale.totalDiscount, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Find peak day
  let peakDay = "";
  let peakRevenue = 0;
  dailySales.forEach((sale) => {
    if (sale.totalRevenue > peakRevenue) {
      peakRevenue = sale.totalRevenue;
      peakDay = format(sale.date, "yyyy-MM-dd");
    }
  });

  const daysInRange = dailySales.length;
  const revenuePerDay = daysInRange > 0 ? totalRevenue / daysInRange : 0;

  // Calculate growth compared to previous period
  const periodLength = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const previousStartDate = subDays(startDate, periodLength);
  const previousEndDate = subDays(endDate, periodLength);

  const previousSales = await prisma.dailySales.findMany({
    where: {
      locationId,
      date: {
        gte: startOfDay(previousStartDate),
        lte: endOfDay(previousEndDate),
      },
    },
  });

  const previousRevenue = previousSales.reduce((sum, sale) => sum + sale.totalRevenue, 0);
  const growth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

  // Get payment method breakdown from actual orders
  const orders = await prisma.order.findMany({
    where: {
      locationId,
      status: "COMPLETED",
      createdAt: {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate),
      },
    },
    select: {
      paymentMethod: true,
      total: true,
    },
  });

  const paymentBreakdown = new Map<string, { count: number; revenue: number }>();
  orders.forEach((order) => {
    const method = order.paymentMethod || "CASH";
    const current = paymentBreakdown.get(method) || { count: 0, revenue: 0 };
    paymentBreakdown.set(method, {
      count: current.count + 1,
      revenue: current.revenue + order.total,
    });
  });

  const paymentMethodBreakdown = Array.from(paymentBreakdown.entries()).map(([method, data]) => ({
    method,
    count: data.count,
    revenue: data.revenue,
    percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
  }));

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    totalTax,
    totalDiscount,
    growth: Math.round(growth * 100) / 100,
    peakDay,
    revenuePerDay,
    paymentMethodBreakdown,
  };
}
