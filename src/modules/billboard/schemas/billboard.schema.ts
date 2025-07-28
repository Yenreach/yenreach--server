import { z } from 'zod';

const isoDateString = z
  .string()
  .refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  })
  .transform(val => new Date(val))
  .refine(
    date => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return date >= yesterday;
    },
    {
      message: 'Date must not be in the past',
    },
  );

export const CreateBillboardEntrySchema = z
  .object({
    businessId: z.uuid().optional(),

    title: z.string().max(100).optional(),
    description: z.string().max(160).optional(),
    imageUrl: z.url().optional(),
    ctaText: z.string().max(255).optional(),
    ctaLink: z.url().optional(),

    startDate: isoDateString,
    endDate: isoDateString,
  })
  .superRefine((data, ctx) => {
    const manualFields = ['title', 'description', 'imageUrl', 'ctaText', 'ctaLink'] as const;

    if (!data.businessId) {
      for (const field of manualFields) {
        if (!data[field]) {
          ctx.addIssue({
            path: [field],
            code: 'custom',
            message: `${field} is required when businessId is not provided`,
          });
        }
      }
    } else {
      for (const field of manualFields) {
        if (data[field]) {
          ctx.addIssue({
            path: [field],
            code: 'custom',
            message: `${field} must not be provided when businessId is used`,
          });
        }
      }
    }

    if (data.endDate < data.startDate) {
      ctx.addIssue({
        path: ['endDate'],
        code: 'custom',
        message: 'End Date must be after Start Date',
      });
    }
  });

const optionalIsoDateString = z
  .string()
  .optional()
  .refine(val => val === undefined || !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  })
  .transform(val => (val ? new Date(val) : undefined))
  .refine(date => date === undefined || date >= new Date(), {
    message: 'Date must not be in the past',
  });

export const UpdateBillboardEntrySchema = z
  .object({
    title: z.string().max(100).optional(),
    description: z.string().max(160).optional(),
    imageUrl: z.url().optional(),
    ctaText: z.string().max(255).optional(),
    ctaLink: z.url().optional(),
    endDate: optionalIsoDateString,
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export type UpdateBillboardEntryDto = z.infer<typeof UpdateBillboardEntrySchema>;

export type CreateBillboardEntryDto = z.infer<typeof CreateBillboardEntrySchema>;
