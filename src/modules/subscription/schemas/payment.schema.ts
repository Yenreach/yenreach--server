import { z } from 'zod';

export const createPaymentSchema = z.object({
  userId: z.string().uuid(),
  businessId: z.string().uuid(),
  subPlanId: z.string().uuid(),
  reference: z.string(),
  cardToken: z.string().optional(),
  last4: z.string().optional(),
  cardType: z.string().optional(),
  amount: z.number().positive(),
  status: z.enum(['pending', 'success', 'failed']),
  channel: z.enum(['card', 'bank', 'ussd', 'transfer', 'mobile_money']),
  currency: z.string().default('NGN'),
});

export const updatePaymentSchema = createPaymentSchema.partial();

export type CreatePaymentDto = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentDto = z.infer<typeof updatePaymentSchema>;
