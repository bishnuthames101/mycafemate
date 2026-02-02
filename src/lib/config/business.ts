/**
 * Business Configuration
 * Centralized configuration for business rules and constants
 */

export const BUSINESS_CONFIG = {
  // Tax configuration
  TAX_RATE: 0.13, // 13% VAT (Nepal standard)

  // Currency configuration
  CURRENCY: 'NPR',
  CURRENCY_LOCALE: 'en-NP',

  // Inventory configuration
  LOW_STOCK_THRESHOLD_MULTIPLIER: 1.0, // Use minimumStock as-is for low stock threshold
} as const;

// Helper function to calculate tax
export function calculateTax(subtotal: number, includeTax: boolean = true): number {
  if (!includeTax) return 0;
  return subtotal * BUSINESS_CONFIG.TAX_RATE;
}

// Helper function to calculate total
export function calculateTotal(subtotal: number, discount: number = 0, includeTax: boolean = true): number {
  const tax = calculateTax(subtotal, includeTax);
  return subtotal + tax - discount;
}
