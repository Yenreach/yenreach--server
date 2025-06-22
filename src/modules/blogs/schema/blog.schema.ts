import { z } from 'zod';

export const CreateBlogSchema = z.object({
  authorId: z.string().min(1, 'Author id is required'),
  tittle: z.string().min(1, 'Blog tittle is required'),
  preview: z.string().min(1, 'Blog preview is required'),
  content: z.string().min(1, 'Blog content is required'),
  mediaUrl: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
});

export const UpdateBlogSchema = z.object({
  tittle: z.string().optional(),
  preview: z.string().optional(),
  content: z.string().optional(),
  mediaUrl: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
});

export type CreateBlogDto = z.infer<typeof CreateBlogSchema>;

export type UpdateBlogDto = z.infer<typeof UpdateBlogSchema>;
