import { stat } from 'fs';
import { z } from 'zod';

export const BusinessSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  businessCategories: z
    .array(z.string())
    .min(1, 'Business must belong to at least one category')
    .max(5, 'business must not have more than 5 categories'),
  state,
});
