import { z } from 'zod';

export const JobSchema = z.object({
  companyName: z.string().trim(),
  businessId: z.string().trim(),
  title: z.string().trim(),
  type: z.string().trim(),
  location: z.string().trim(),
  salary: z.string().trim(),
  description: z.string().trim(),
  benefit: z.string().trim(),
  applicationMethod: z.string().trim(),
  overview: z.string().trim().optional().default(''),
  applicationExpiry: z.string().trim(),
  tags: z.array(z.string().trim()).optional().default([]),
});

export const GetJobsSchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('20').transform(Number),
  search: z.string().trim().optional(),
  business: z.string().trim().optional(),
});

export type CreateJobDto = z.infer<typeof JobSchema>;
export type UpdateJobDto = Partial<CreateJobDto>;
export type GetJobsDto = z.infer<typeof GetJobsSchema>;
