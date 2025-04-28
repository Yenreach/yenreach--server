import { z } from "zod";

export const JobSchema = z.object({
  name: z.string().optional().default(""),
  businessString: z.string().optional().default(""),
  companyName: z.string().optional().default(""),
  title: z.string().optional().default(""),
  type: z.string().optional().default(""),
  location: z.string().optional().default(""),
  salary: z.string().optional().default(""),
  description: z.string().optional().default(""),
  benefit: z.string().optional().default(""),
  link: z.string().optional().default(""),
  overview: z.string().optional().default(""),
  expiryDate: z.number().optional().default(1),
  tags: z.array(z.object({ tag: z.string() }))
});

export type CreateJobDto = z.infer<typeof JobSchema>;
export type UpdateJobDto = Partial<CreateJobDto>

