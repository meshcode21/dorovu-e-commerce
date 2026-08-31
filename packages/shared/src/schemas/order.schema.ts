import { z } from 'zod';

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State/Province is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
});

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      variantId: z.string().uuid('Invalid variant ID'),
      quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    })
  ).min(1, 'Order must contain at least one item'),
  shippingAddress: shippingAddressSchema,
  isBuyNow: z.boolean().optional(),
});

export const updateOrderItemStatusSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'READY_FOR_PICKUP', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']),
  trackingNumber: z.string().optional(),
  otp: z.string().length(6, 'OTP must be 6 digits').optional(),
});

export type ShippingAddressDTO = z.infer<typeof shippingAddressSchema>;
export type CreateOrderDTO = z.infer<typeof createOrderSchema>;
export type UpdateOrderItemStatusDTO = z.infer<typeof updateOrderItemStatusSchema>;
