import { z } from 'zod';

export const createProductVariantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  stock: z.string().or(z.number()).transform((val) => Number(val)).refine((val) => val >= 0, 'Stock cannot be negative'),
  priceAdjustment: z.string().or(z.number()).transform((val) => Number(val)).default(0),
});

export const createProductSchema = z.object({
  title: z.string().min(3, 'Product title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().or(z.number()).transform((val) => Number(val)).refine((val) => val > 0, 'Price must be greater than 0'),
  category: z.string().min(2, 'Category is required'),
  craftType: z.string().min(2, 'Craft type is required'),
  tags: z.array(z.string()).optional().default([]),
  isCustomOrder: z.boolean().or(z.string().transform(v => v === 'true')).default(false),
  leadTime: z.string().or(z.number()).transform((val) => Number(val)).default(3),
  
  variants: z.array(createProductVariantSchema).min(1, 'At least one variant is required'),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductVariantDTO = z.infer<typeof createProductVariantSchema>;
export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
