import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string(),
  businessId: z.string(),
  description: z.string(),
  price: z.number(),
  quantity: z.number(),
  color: z.string().optional().default(''),
  safetyTip: z.string().optional().default(''),
  categories: z.array(z.string()).optional().default([]),
  photos: z.array(z.string()).optional().default([]),
});

export const UpdateProductSchema = z.object({
  name: z.string().optional(),
  businessId: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  quantity: z.number().optional(),
  color: z.string().optional(),
  safetyTip: z.string().optional(),
  categories: z.array(z.string()).optional().default([]),
  photos: z.array(z.string()).optional().default([]),
});

export const AddCategorySchema = z.object({
  category: z.string().min(1, 'Category name is required'),
});

export const AddProductCategorySchema = z.object({
  productString: z.string().nonempty(),
  category: z.string().nonempty(),
});

export const AddProductPhotoSchema = z.object({
  product_string: z.string().min(1, 'Product string is required'),
  filename: z.string().min(1, 'Filename is required'),
});

export const GetProductsSchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('20').transform(Number),
  search: z.string().optional(),
  business: z.string().optional(),
  category: z.string().optional(),
});

export const RemoveProductCategorySchema = z.object({
  product_string: z.string().min(1, 'Product string is required'),
  category_string: z.string().min(1, 'Category string is required'),
});

export const RemoveProductPhotoSchema = z.object({
  product_string: z.string().min(1, 'Product string is required'),
  photo_string: z.string().min(1, 'Photo string is required'),
});

export type CreateProductDto = z.infer<typeof ProductSchema>;
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
export type AddCategoryDto = z.infer<typeof AddCategorySchema>;
export type AddProductCategoryDto = z.infer<typeof AddProductCategorySchema>;
export type AddProductPhotoDto = z.infer<typeof AddProductPhotoSchema>;
export type GetProductsDto = z.infer<typeof GetProductsSchema>;
export type RemoveProductCategoryDto = z.infer<typeof RemoveProductCategorySchema>;
export type RemoveProductPhotoDto = z.infer<typeof RemoveProductPhotoSchema>;
