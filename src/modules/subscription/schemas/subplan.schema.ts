import { z } from 'zod';

export const createSubPlanSchema = z.object({
  name: z.enum(['Basic', 'Pro', 'X']),
  durationInMonths: z.number().int().positive(),
  amount: z.number().positive(),
  planId: z.string(), // Assuming plan has a UUID primary key
});

export const updateSubPlanSchema = createSubPlanSchema.partial();

export type CreateSubPlanDto = z.infer<typeof createSubPlanSchema>;
export type UpdateSubPlanDto = z.infer<typeof updateSubPlanSchema>;
