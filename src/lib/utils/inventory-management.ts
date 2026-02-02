import { NotificationType } from "@prisma/client";
import { createLowStockNotification } from "@/lib/services/notification-service";
import type { PrismaClient } from "@prisma/client";
import { logger } from '@/lib/utils/logger';

/**
 * Deduct inventory based on order items and their recipes
 */
export async function deductInventoryForOrder(
  prisma: any,
  orderId: string
): Promise<void> {
  try {
    // Fetch order with items and their recipe items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        location: true,
        items: {
          include: {
            product: {
              include: {
                recipeItems: {
                  include: {
                    inventory: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    // Calculate inventory deductions
    const inventoryDeductions = new Map<string, number>();

    for (const item of order.items) {
      for (const recipeItem of item.product.recipeItems) {
        const currentDeduction = inventoryDeductions.get(recipeItem.inventoryId) || 0;
        const newDeduction = item.quantity * recipeItem.quantityUsed;
        inventoryDeductions.set(recipeItem.inventoryId, currentDeduction + newDeduction);
      }
    }

    // Apply deductions to inventory items (location-specific)
    for (const [inventoryId, deductionAmount] of Array.from(inventoryDeductions.entries())) {
      await prisma.inventoryItem.updateMany({
        where: {
          inventoryId,
          inventory: {
            locationId: order.locationId,
          },
        },
        data: {
          currentStock: {
            decrement: deductionAmount,
          },
        },
      });
    }
  } catch (error) {
    logger.error(`Error deducting inventory for order ${orderId}:`, error instanceof Error ? error : undefined);
    // Don't throw - we don't want inventory deduction failures to block order creation
  }
}

/**
 * Check for low stock items at a location
 */
export async function checkLowStockItems(
  prisma: any,
  locationId: string
): Promise<
  Array<{
    id: string;
    inventoryName: string;
    currentStock: number;
    minimumStock: number;
    unit: string;
    isOutOfStock: boolean;
  }>
> {
  // Fetch all inventory items for the location
  const allItems = await prisma.inventoryItem.findMany({
    where: {
      inventory: {
        locationId,
      },
    },
    include: {
      inventory: true,
    },
  });

  // Filter in application code for field-to-field comparison
  const lowStockItems = allItems.filter(
    (item: typeof allItems[0]) => item.currentStock <= item.minimumStock
  );

  return lowStockItems.map((item: typeof lowStockItems[0]) => ({
    id: item.id,
    inventoryName: item.inventory.name,
    currentStock: item.currentStock,
    minimumStock: item.minimumStock,
    unit: item.inventory.unit,
    isOutOfStock: item.currentStock <= 0,
  }));
}

/**
 * Create low stock notifications for items that haven't been alerted yet
 */
export async function createLowStockNotifications(
  prisma: any,
  locationId: string
): Promise<number> {
  try {
    // Find items that haven't been alerted yet
    const allItems = await prisma.inventoryItem.findMany({
      where: {
        inventory: {
          locationId,
        },
        lowStockAlerted: false,
      },
      include: {
        inventory: true,
      },
    });

    // Filter in application code for field-to-field comparison
    const lowStockItems = allItems.filter(
      (item: typeof allItems[0]) => item.currentStock <= item.minimumStock
    );

    let notificationsCreated = 0;

    for (const item of lowStockItems) {
      const isOutOfStock = item.currentStock <= 0;

      // Use notification service to create notification
      await createLowStockNotification(prisma, {
        locationId,
        inventoryItemId: item.id,
        inventoryName: item.inventory.name,
        currentStock: item.currentStock,
        minimumStock: item.minimumStock,
        unit: item.inventory.unit,
        isOutOfStock,
      });

      // Mark as alerted
      await prisma.inventoryItem.update({
        where: { id: item.id },
        data: { lowStockAlerted: true },
      });

      notificationsCreated++;
    }

    return notificationsCreated;
  } catch (error) {
    logger.error("Error creating low stock notifications:", error instanceof Error ? error : undefined);
    return 0;
  }
}

/**
 * Restock inventory item
 */
export async function restockInventory(
  prisma: any,
  inventoryItemId: string,
  quantity: number
): Promise<{
  success: boolean;
  newStock: number;
  message: string;
}> {
  try {
    const item = await prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId },
      include: { inventory: true },
    });

    if (!item) {
      return {
        success: false,
        newStock: 0,
        message: "Inventory item not found",
      };
    }

    const updatedItem = await prisma.inventoryItem.update({
      where: { id: inventoryItemId },
      data: {
        currentStock: {
          increment: quantity,
        },
        lastRestocked: new Date(),
        restockAmount: quantity,
        // Reset alert flag if stock is now above minimum
        lowStockAlerted: item.currentStock + quantity > item.minimumStock ? false : item.lowStockAlerted,
      },
    });

    return {
      success: true,
      newStock: updatedItem.currentStock,
      message: `Successfully restocked ${item.inventory.name}. New stock: ${updatedItem.currentStock}${item.inventory.unit}`,
    };
  } catch (error) {
    logger.error("Error restocking inventory:", error instanceof Error ? error : undefined);
    return {
      success: false,
      newStock: 0,
      message: "Failed to restock inventory",
    };
  }
}

/**
 * Get inventory status summary for a location
 */
export async function getInventoryStatus(
  prisma: any,
  locationId: string
): Promise<{
  totalItems: number;
  lowStockCount: number;
  outOfStockCount: number;
  healthyStockCount: number;
}> {
  const inventoryItems = await prisma.inventoryItem.findMany({
    where: {
      inventory: {
        locationId,
      },
    },
  });

  let lowStockCount = 0;
  let outOfStockCount = 0;
  let healthyStockCount = 0;

  for (const item of inventoryItems) {
    if (item.currentStock <= 0) {
      outOfStockCount++;
    } else if (item.currentStock <= item.minimumStock) {
      lowStockCount++;
    } else {
      healthyStockCount++;
    }
  }

  return {
    totalItems: inventoryItems.length,
    lowStockCount,
    outOfStockCount,
    healthyStockCount,
  };
}

/**
 * Validation result for order inventory check
 */
export interface InventoryValidationResult {
  isValid: boolean;
  insufficientItems: Array<{
    productName: string;
    inventoryName: string;
    required: number;
    available: number;
    unit: string;
  }>;
  message: string;
}

/**
 * Validate if there's enough inventory for an order before creating it
 */
export async function validateInventoryForOrder(
  prisma: any,
  locationId: string,
  items: Array<{ productId: string; quantity: number }>
): Promise<InventoryValidationResult> {
  try {
    // Fetch all products with their recipes
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      include: {
        recipeItems: {
          include: {
            inventory: true,
          },
        },
      },
    });

    // Create a map for quick product lookup
    type ProductWithRecipes = typeof products[number];
    const productMap = new Map<string, ProductWithRecipes>(
      products.map((p: ProductWithRecipes) => [p.id, p])
    );

    // Calculate total required inventory
    const inventoryRequired = new Map<string, {
      inventoryId: string;
      inventoryName: string;
      unit: string;
      totalRequired: number;
      products: Set<string>;
    }>();

    for (const orderItem of items) {
      const product = productMap.get(orderItem.productId);
      if (!product) continue;

      for (const recipeItem of product.recipeItems) {
        const existing = inventoryRequired.get(recipeItem.inventoryId);
        const requiredAmount = orderItem.quantity * recipeItem.quantityUsed;

        if (existing) {
          existing.totalRequired += requiredAmount;
          existing.products.add(product.name);
        } else {
          inventoryRequired.set(recipeItem.inventoryId, {
            inventoryId: recipeItem.inventoryId,
            inventoryName: recipeItem.inventory.name,
            unit: recipeItem.inventory.unit,
            totalRequired: requiredAmount,
            products: new Set([product.name]),
          });
        }
      }
    }

    // If no recipes are defined, allow the order
    if (inventoryRequired.size === 0) {
      return {
        isValid: true,
        insufficientItems: [],
        message: "Order validated successfully (no inventory tracking required)",
      };
    }

    // Fetch current inventory levels for this location
    const inventoryIds = Array.from(inventoryRequired.keys());
    const inventoryItems = await prisma.inventoryItem.findMany({
      where: {
        inventoryId: {
          in: inventoryIds,
        },
        inventory: {
          locationId,
        },
      },
      include: {
        inventory: true,
      },
    });

    // Create a map of current stock levels
    const currentStock = new Map<string, number>(
      inventoryItems.map((item: typeof inventoryItems[0]) => [item.inventoryId, item.currentStock])
    );

    // Check for insufficient inventory
    const insufficientItems: InventoryValidationResult["insufficientItems"] = [];

    for (const [inventoryId, required] of inventoryRequired.entries()) {
      const available: number = currentStock.get(inventoryId) || 0;

      if (available < required.totalRequired) {
        // Find which products use this inventory item
        const affectedProducts = Array.from(required.products).join(", ");

        insufficientItems.push({
          productName: affectedProducts,
          inventoryName: required.inventoryName,
          required: required.totalRequired,
          available,
          unit: required.unit,
        });
      }
    }

    // Return validation result
    if (insufficientItems.length > 0) {
      const itemsList = insufficientItems
        .map(item =>
          `${item.inventoryName}: need ${item.required}${item.unit}, only ${item.available}${item.unit} available`
        )
        .join("; ");

      return {
        isValid: false,
        insufficientItems,
        message: `Insufficient inventory: ${itemsList}`,
      };
    }

    return {
      isValid: true,
      insufficientItems: [],
      message: "Order validated successfully",
    };
  } catch (error) {
    logger.error("Error validating inventory for order:", error instanceof Error ? error : undefined);
    // In case of error, allow the order but log the issue
    return {
      isValid: true,
      insufficientItems: [],
      message: "Validation skipped due to error",
    };
  }
}
