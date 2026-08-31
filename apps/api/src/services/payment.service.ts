import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { AccountingService } from './accounting.service';

const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
const ESEWA_MERCHANT_ID = process.env.ESEWA_MERCHANT_ID || 'EPAYTEST';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
const FRONTEND_URL = process.env.CLIENT_URL || 'http://localhost:3000';

export class PaymentService {
  /**
   * Generates the eSewa signature (HMAC-SHA256)
   */
  static generateEsewaSignature(amount: number, transactionUuid: string, merchantId: string): string {
    const dataToSign = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=${merchantId}`;
    const hmac = crypto.createHmac('sha256', ESEWA_SECRET_KEY);
    hmac.update(dataToSign);
    return hmac.digest('base64');
  }

  /**
   * Initiates payment: creates order and returns signed form fields
   */
  static async initiateEsewaPayment(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.paymentStatus === 'COMPLETED') {
      throw new Error('Order is already paid');
    }

    const transactionUuid = order.id;
    const amount = order.totalAmount;
    
    const signature = this.generateEsewaSignature(amount, transactionUuid, ESEWA_MERCHANT_ID);

    return {
      amount: amount,
      tax_amount: 0,
      total_amount: amount,
      transaction_uuid: transactionUuid,
      product_code: ESEWA_MERCHANT_ID,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: `${FRONTEND_URL}/payment/verify`,
      failure_url: `${FRONTEND_URL}/payment/verify?status=failure&orderId=${order.id}`,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature: signature,
      action: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form', // Sandbox URL
    };
  }

  /**
   * Verifies the payment response from eSewa
   */
  static async verifyEsewaPayment(base64Data: string) {
    // eSewa sends a base64 encoded JSON string in the `data` query param
    const decodedData = Buffer.from(base64Data, 'base64').toString('utf-8');
    const parsedData = JSON.parse(decodedData);

    const {
      transaction_code,
      status,
      total_amount,
      transaction_uuid,
      product_code,
      signed_field_names,
      signature
    } = parsedData;

    if (status !== 'COMPLETE') {
      throw new Error('Payment was not completed');
    }

    // Verify signature to prevent tampering
    const fieldsToSign = signed_field_names.split(',').map((field: string) => `${field}=${parsedData[field]}`).join(',');
    const hmac = crypto.createHmac('sha256', ESEWA_SECRET_KEY);
    hmac.update(fieldsToSign);
    const expectedSignature = hmac.digest('base64');

    if (signature !== expectedSignature) {
      throw new Error('Invalid signature. Payment verification failed.');
    }

    // Verify amount matches order
    const order = await prisma.order.findUnique({
      where: { id: transaction_uuid },
      include: { orderItems: true }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.totalAmount !== parseFloat(total_amount.replace(/,/g, ''))) {
      throw new Error('Amount mismatch');
    }

    if (order.paymentStatus === 'COMPLETED') {
      return { success: true, orderId: order.id, message: 'Already completed' };
    }

    // Update order status and credit crafters
    await prisma.$transaction(async (tx) => {
      // 1. Mark order as PAID
      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'COMPLETED',
          paymentReference: transaction_code,
        },
      });

      // 2. Mark order items as PENDING (instead of initial pending payment state)
      // They are already PENDING but let's just make sure
      
      // 3. For each order item, trigger the accounting service to record the sale
      for (const item of order.orderItems) {
        // We don't want to call the static AccountingService method directly inside this tx if it starts its own tx.
        // Let's implement the accounting logic directly or pass the tx.
        
        const store = await tx.crafterStore.findUnique({
          where: { id: item.crafterId },
        });

        if (!store) continue;

        const commissionRate = store.commissionRate;
        const commissionAmount = item.priceAtPurchase * item.quantity * commissionRate;
        const netAmount = (item.priceAtPurchase * item.quantity) - commissionAmount;

        // Credit sale
        await tx.ledgerTransaction.create({
          data: {
            crafterId: item.crafterId,
            amount: item.priceAtPurchase * item.quantity,
            type: 'ORDER_SALE',
            referenceId: item.id,
            description: `Sale for order item ${item.id}`,
          },
        });

        // Debit fee
        await tx.ledgerTransaction.create({
          data: {
            crafterId: item.crafterId,
            amount: -commissionAmount,
            type: 'PLATFORM_FEE',
            referenceId: item.id,
            description: `Platform commission (${(commissionRate * 100).toFixed(1)}%) for order item ${item.id}`,
          },
        });

        // Update pending balance
        await tx.crafterStore.update({
          where: { id: item.crafterId },
          data: {
            pendingBalance: {
              increment: netAmount,
            },
          },
        });
      }
    });

    return { success: true, orderId: order.id };
  }
}
