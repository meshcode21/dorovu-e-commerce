import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const addItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).default(1),
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(1),
});

export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: { id: true, title: true, images: true, crafterId: true, price: true }
                }
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { variant: { include: { product: true } } } } }
      });
    }

    res.json({ cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addItemToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { variantId, quantity } = addItemSchema.parse(req.body);

    // Verify variant exists
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      res.status(404).json({ message: 'Variant not found' });
      return;
    }

    // Ensure cart exists
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        }
      }
    });

    if (existingItem) {
      // Increment quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          variant: {
            include: { product: { select: { id: true, title: true, images: true, crafterId: true, price: true } } }
          }
        }
      });
      res.json({ message: 'Cart item updated', cartItem: updatedItem });
      return;
    }

    // Create new cart item
    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId,
        quantity,
      },
      include: {
        variant: {
          include: { product: { select: { id: true, title: true, images: true, crafterId: true, price: true } } }
        }
      }
    });

    res.status(201).json({ message: 'Added to cart', cartItem: newItem });
  } catch (error: any) {
    console.error('Add to cart error:', error);
    if (error.name === 'ZodError') {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const itemId = String(req.params.id);
    const { quantity } = updateItemSchema.parse(req.body);

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!item || item.cartId !== cart.id) {
      res.status(404).json({ message: 'Cart item not found' });
      return;
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        variant: {
          include: { product: { select: { id: true, title: true, images: true, crafterId: true, price: true } } }
        }
      }
    });

    res.json({ message: 'Cart item updated', cartItem: updatedItem });
  } catch (error: any) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const itemId = String(req.params.id);

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!item || item.cartId !== cart.id) {
      res.status(404).json({ message: 'Cart item not found' });
      return;
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    res.json({ message: 'Cart item removed' });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const clearCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const cart = await prisma.cart.findUnique({ where: { userId } });
    
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
