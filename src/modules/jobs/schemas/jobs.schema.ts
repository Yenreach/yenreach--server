import { z } from "zod";

export const JobSchema = z.object({
  companyName: z.string(),
  businessId: z.string(),
  title: z.string(),
  type: z.string(),
  location: z.string(),
  salary: z.string(),
  description: z.string(),
  benefit: z.string(),
  applicationMethod: z.string(),
  overview: z.string().optional().default(""),
  applicationExpiry: z.string(),
  tags: z.array(z.string()).optional().default([]),
});

export const GetJobsSchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("20").transform(Number),
  search: z.string().optional(),
  business: z.string().optional(),
});

export type CreateJobDto = z.infer<typeof JobSchema>;
export type UpdateJobDto = Partial<CreateJobDto>
export type GetJobsDto = z.infer<typeof GetJobsSchema>;

