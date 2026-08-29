import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createOrderSchema, updateOrderItemStatusSchema } from '@dorovu/shared';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createOrderSchema.parse(req.body);
    const userId = req.user!.userId;

    // 1. Fetch all requested variants and their products
    const variantIds = validatedData.items.map(item => item.variantId);
    
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true }
    });

    if (variants.length !== variantIds.length) {
      res.status(400).json({ message: 'One or more variants not found' });
      return;
    }

    // 2. Validate stock and calculate total amount
    let totalAmount = 0;
    const orderItemsData: any[] = [];

    for (const item of validatedData.items) {
      const variant = variants.find(v => v.id === item.variantId)!;
      
      if (variant.stock < item.quantity) {
        res.status(400).json({ message: `Not enough stock for variant: ${variant.name}` });
        return;
      }

      const priceAtPurchase = variant.product.price + variant.priceAdjustment;
      totalAmount += priceAtPurchase * item.quantity;

      orderItemsData.push({
        variantId: variant.id,
        crafterId: variant.product.crafterId,
        quantity: item.quantity,
        priceAtPurchase: priceAtPurchase,
      });
    }

    // 3. Perform transaction to create order and decrement stock
    const result = await prisma.$transaction(async (tx) => {
      // Decrement stock for all variants
      for (const item of validatedData.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // Create Order
      const order = await tx.order.create({
        data: {
          buyerId: userId,
          totalAmount: totalAmount,
          shippingAddress: validatedData.shippingAddress,
          orderItems: {
            create: orderItemsData
          }
        },
        include: {
          orderItems: true
        }
      });

      // Clear the user's cart
      const cart = await tx.cart.findUnique({ where: { userId } });
      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }

      return order;
    });

    res.status(201).json({ message: 'Order created successfully', order: result });
  } catch (error: any) {
    console.error('Create order error:', error);
    if (error.name === 'ZodError') {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { role } = req.query; // 'buyer' or 'crafter'

    if (role === 'crafter') {
      const crafterStore = await prisma.crafterStore.findUnique({
        where: { crafterId: userId }
      });

      if (!crafterStore) {
        res.status(404).json({ message: 'Crafter store not found' });
        return;
      }

      const orderItems = await prisma.orderItem.findMany({
        where: { crafterId: crafterStore.id },
        include: {
          order: {
            select: {
              id: true,
              paymentStatus: true,
              shippingAddress: true,
              createdAt: true,
              buyer: {
                select: { firstName: true, lastName: true, email: true }
              }
            }
          },
          variant: {
            include: {
              product: {
                select: { title: true, images: true }
              }
            }
          },
          review: true
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({ orderItems });
      return;
    }

    // Default to buyer view
    const orders = await prisma.order.findMany({
      where: { buyerId: userId },
      include: {
        orderItems: {
          include: {
            variant: {
              include: {
                product: {
                  select: { id: true, title: true, images: true, crafter: { select: { storeName: true } } }
                }
              }
            },
            review: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPendingOrderCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const crafterStore = await prisma.crafterStore.findUnique({
      where: { crafterId: userId }
    });

    if (!crafterStore) {
      res.json({ count: 0 });
      return;
    }

    const count = await prisma.orderItem.count({
      where: {
        crafterId: crafterStore.id,
        status: 'PENDING'
      }
    });

    res.json({ count });
  } catch (error) {
    console.error('Get pending order count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: id as string },
      include: {
        buyer: { select: { id: true, firstName: true, lastName: true, email: true } },
        orderItems: {
          include: {
            variant: {
              include: {
                product: {
                  select: { title: true, images: true, crafter: { select: { storeName: true } } }
                }
              }
            },
            crafter: {
              select: { crafterId: true }
            },
            review: true
          }
        }
      }
    });

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Security: User must be the buyer, OR one of the crafters in the order items
    const isBuyer = order.buyerId === userId;
    const isCrafter = order.orderItems.some((item: any) => item.crafter.crafterId === userId);

    if (!isBuyer && !isCrafter) {
      res.status(403).json({ message: 'Not authorized to view this order' });
      return;
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order by id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateOrderItemStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { itemId } = req.params as { itemId: string };
    const validatedData = updateOrderItemStatusSchema.parse(req.body);

    const crafterStore = await prisma.crafterStore.findUnique({
      where: { crafterId: userId }
    });

    if (!crafterStore) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const orderItem = await prisma.orderItem.findUnique({
      where: { id: itemId }
    });

    if (!orderItem) {
      res.status(404).json({ message: 'Order item not found' });
      return;
    }

    if (orderItem.crafterId !== crafterStore.id) {
      res.status(403).json({ message: 'Not authorized to update this item' });
      return;
    }

    const updatedItem = await prisma.orderItem.update({
      where: { id: itemId },
      data: {
        status: validatedData.status,
        trackingNumber: validatedData.trackingNumber || orderItem.trackingNumber
      }
    });

    res.json({ message: 'Status updated successfully', orderItem: updatedItem });
  } catch (error: any) {
    console.error('Update order item status error:', error);
    if (error.name === 'ZodError') {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: id as string },
      include: { orderItems: true }
    });

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (order.buyerId !== userId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    if (order.paymentStatus !== 'PENDING') {
      res.status(400).json({ message: 'Cannot cancel order after payment is processed' });
      return;
    }

    const canCancel = order.orderItems.every(item => item.status === 'PENDING' || item.status === 'ACCEPTED');
    if (!canCancel) {
      res.status(400).json({ message: 'Cannot cancel order: some items have already shipped' });
      return;
    }

    // Cancel order items and restore stock in transaction
    await prisma.$transaction(async (tx) => {
      for (const item of order.orderItems) {
        await tx.orderItem.update({
          where: { id: item.id },
          data: { status: 'CANCELLED' }
        });

        // Restore stock
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } }
        });
      }

      await tx.order.update({
        where: { id: id as string },
        data: { paymentStatus: 'FAILED' } // Or add CANCELLED to PaymentStatus enum if we updated schema
      });
    });

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
