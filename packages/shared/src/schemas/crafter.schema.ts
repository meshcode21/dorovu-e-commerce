import { z } from 'zod';

export const ApplyCrafterSchema = z.object({
  storeName: z.string().min(3, "Store name must be at least 3 characters").max(50),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  craftType: z.string().min(2, "Craft type is required"),
});

export type ApplyCrafterDTO = z.infer<typeof ApplyCrafterSchema>;

export const UpdateCrafterStoreSchema = z.object({
  storeName: z.string().min(3, "Store name must be at least 3 characters").max(50).optional(),
  description: z.string().min(10, "Description must be at least 10 characters").max(500).optional(),
  craftType: z.string().min(2, "Craft type is required").optional(),
});

export type UpdateCrafterStoreDTO = z.infer<typeof UpdateCrafterStoreSchema>;
