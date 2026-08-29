import { z } from 'zod';

export const CreateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export type CreateReviewDTO = z.infer<typeof CreateReviewSchema>;

export const UpdateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().max(500).optional(),
});

export type UpdateReviewDTO = z.infer<typeof UpdateReviewSchema>;

export const ReplyReviewSchema = z.object({
  crafterReply: z.string().min(1).max(500),
});

export type ReplyReviewDTO = z.infer<typeof ReplyReviewSchema>;
