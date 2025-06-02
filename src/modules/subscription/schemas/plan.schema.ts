import { z } from 'zod';

export const createPlanSchema = z.object({
  name: z.enum(['Premium', 'Gold', 'Silver', 'Special']),
  videoLimit: z.number().int().nonnegative(),
  sliderLimit: z.number().int().nonnegative(),
  branchLimit: z.number().int().nonnegative(),
  socialMediaLimit: z.number().int().nonnegative(),
  order: z.number().int().nonnegative(),
});

export const updatePlanSchema = createPlanSchema.partial();

export type CreatePlanDto = z.infer<typeof createPlanSchema>;
export type UpdatePlanDto = z.infer<typeof updatePlanSchema>;
