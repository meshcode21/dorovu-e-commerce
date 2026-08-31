
import { prisma } from '../lib/prisma';

export class AccountingService {
  /**
   * Records a sale and takes the platform commission.
   * This adds to the crafter's pendingBalance until the order is DELIVERED.
   */
  static async recordSale(storeId: string, amount: string | number, orderItemId: string) {
    const amountFloat = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    return await prisma.$transaction(async (tx) => {
      const store = await tx.crafterStore.findUnique({
        where: { id: storeId },
      });

      if (!store) throw new Error('Crafter store not found');

      const commissionRate = store.commissionRate;
      const commissionAmount = amountFloat * commissionRate;
      const netAmount = amountFloat - commissionAmount;

      // 1. Credit the sale amount to pending balance
      await tx.ledgerTransaction.create({
        data: {
          crafterId: storeId,
          amount: amountFloat,
          type: 'ORDER_SALE',
          referenceId: orderItemId,
          description: `Sale for order item ${orderItemId}`,
        },
      });

      // 2. Debit the platform commission
      await tx.ledgerTransaction.create({
        data: {
          crafterId: storeId,
          amount: -commissionAmount,
          type: 'PLATFORM_FEE',
          referenceId: orderItemId,
          description: `Platform commission (${(commissionRate * 100).toFixed(1)}%) for order item ${orderItemId}`,
        },
      });

      // 3. Update pending balance
      await tx.crafterStore.update({
        where: { id: storeId },
        data: {
          pendingBalance: {
            increment: netAmount,
          },
        },
      });

      return netAmount;
    });
  }

  /**
   * Moves funds from pendingBalance to availableBalance when an order is DELIVERED.
   */
  static async releaseFunds(storeId: string, orderItemId: string) {
    return await prisma.$transaction(async (tx) => {
      // Find the transactions for this order item to calculate net amount
      const transactions = await tx.ledgerTransaction.findMany({
        where: {
          crafterId: storeId,
          referenceId: orderItemId,
        },
      });

      const netAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

      // Deduct from pending, add to available
      await tx.crafterStore.update({
        where: { id: storeId },
        data: {
          pendingBalance: {
            decrement: netAmount,
          },
          availableBalance: {
            increment: netAmount,
          },
        },
      });
    });
  }

  /**
   * Processes a payout withdrawal.
   */
  static async processPayout(storeId: string, amount: string | number, payoutMethod: string) {
    const amountFloat = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    return await prisma.$transaction(async (tx) => {
      const store = await tx.crafterStore.findUnique({
        where: { id: storeId },
      });

      if (!store) throw new Error('Crafter store not found');

      if (store.availableBalance < amountFloat) {
        throw new Error('Insufficient available balance');
      }

      // Create the payout record
      const payout = await tx.payout.create({
        data: {
          crafterId: storeId,
          amount: amountFloat,
          commissionDeducted: 0, // Commission was already deducted at sale
          payoutMethod,
          status: 'PENDING',
        },
      });

      // Create ledger transaction
      await tx.ledgerTransaction.create({
        data: {
          crafterId: storeId,
          amount: -amountFloat,
          type: 'PAYOUT_WITHDRAWAL',
          referenceId: payout.id,
          description: `Payout withdrawal via ${payoutMethod}`,
        },
      });

      // Deduct from available balance
      await tx.crafterStore.update({
        where: { id: storeId },
        data: {
          availableBalance: {
            decrement: amountFloat,
          },
        },
      });

      return payout;
    });
  }
}
