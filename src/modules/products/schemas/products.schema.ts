import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().optional().default(""),
  businessString: z.string().optional().default(""),
  description: z.string().optional().default(""),
  productPrice: z.number().optional().default(0),
  productQuantity: z.number().optional().default(1),
  productColor: z.string().optional().default(""),
  productSafetyTip: z.string().optional().default(""),
  productCategories: z
    .array(
      z.object({
        category: z.string(),
      })
    )
    .optional()
    .default([]),
  photos: z
    .array(
      z.object({
        filename: z.string(),
      })
    )
    .optional()
    .default([]),
});

export type CreateProductDto = z.infer<typeof ProductSchema>;
export type UpdateProductDto = Partial<CreateProductDto>

