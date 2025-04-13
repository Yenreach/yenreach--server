import { z } from 'zod';

export const BusinessReviewSchema = z.object({
  businessId: z.string().min(1, 'Business id is required'),
  userId: z.string().min(1, 'User id is required'),
  review: z.string().min(1, 'Business must have a reivew'),
  star: z.number().optional(),
});

export type ReviewBusinessDto = z.infer<typeof BusinessReviewSchema>;
