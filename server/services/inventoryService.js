import { Product } from '../models/Product.js';

/**
 * Concurrency-Safe Atomic Stock Deduction
 * Uses MongoDB's atomic query-and-update to ensure that two users purchasing
 * the last item at the exact same instant cannot oversell inventory.
 *
 * @param {Array<{productId: string, quantity: number}>} items
 * @returns {Promise<{success: boolean, failedItem?: string}>}
 */
export async function reserveStock(items) {
  const reservedItems = [];

  for (const item of items) {
    const updated = await Product.findOneAndUpdate(
      {
        _id: item.productId,
        isActive: true,
        inventoryQuantity: { $gte: item.quantity },
      },
      {
        $inc: { inventoryQuantity: -item.quantity },
      },
      { new: true }
    );

    if (!updated) {
      // Stock deduction failed for this item: Rollback all items reserved so far
      await rollbackReservedStock(reservedItems);
      return {
        success: false,
        failedItem: item.productId,
      };
    }

    reservedItems.push(item);
  }

  return { success: true };
}

/**
 * Rollback/Restore stock in case of order failure or cancellation.
 * @param {Array<{productId: string, quantity: number}>} items
 */
export async function rollbackReservedStock(items) {
  for (const item of items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { inventoryQuantity: item.quantity },
    });
  }
}
