import { z } from "zod";

export const JobSchema = z.object({
  name: z.string().optional().default(""),
  businessString: z.string().optional().default(""),
  description: z.string().optional().default(""),
  jobPrice: z.number().optional().default(0),
  jobQuantity: z.number().optional().default(1),
  jobColor: z.string().optional().default(""),
  jobSafetyTip: z.string().optional().default(""),
});

export type CreateJobDto = z.infer<typeof JobSchema>;
export type UpdateJobDto = Partial<CreateJobDto>

