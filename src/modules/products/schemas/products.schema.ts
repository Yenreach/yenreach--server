import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string(),
  businessString: z.string(),
  description: z.string(),
  productPrice: z.number(),
  productQuantity: z.number(),
  productColor: z.string().optional().default(""),
  productSafetyTip: z.string().optional().default(""),
  categories: z
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
    .default([]),
});

export const UpdateProductSchema = z.object({
  name: z.string().optional(),
  businessString: z.string().optional(),
  description: z.string().optional(),
  productPrice: z.number().optional(),
  productQuantity: z.number().optional(),
  productColor: z.string().optional(),
  productSafetyTip: z.string().optional(),
  categories: z
    .array(
      z.object({
        category: z.string(),
      })
    )
    .optional(),
  photos: z
    .array(
      z.object({
        filename: z.string(),
      })
    )
    .optional(),
});

export const AddCategorySchema = z.object({
  category: z.string().min(1, "Category name is required"),
  details: z.string().optional(),
});

export const AddProductCategorySchema = z.object({
  productString: z.string().nonempty(),
  category: z.string().nonempty(),
});


export const AddProductPhotoSchema = z.object({
  product_string: z.string().min(1, "Product string is required"),
  filename: z.string().min(1, "Filename is required"),
});

export const GetProductsSchema = z.object({
  skip: z.string().optional().default("0").transform(Number),
  per_page: z.string().optional().default("20").transform(Number),
  search: z.string().optional(),
  business: z.string().optional(),
});

export const RemoveProductCategorySchema = z.object({
  product_string: z.string().min(1, "Product string is required"),
  category_string: z.string().min(1, "Category string is required"),
});

export const RemoveProductPhotoSchema = z.object({
  product_string: z.string().min(1, "Product string is required"),
  photo_string: z.string().min(1, "Photo string is required"),
});


export type CreateProductDto = z.infer<typeof ProductSchema>;
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
export type AddCategoryDto = z.infer<typeof AddCategorySchema>;
export type AddProductCategoryDto = z.infer<typeof AddProductCategorySchema>;
export type AddProductPhotoDto = z.infer<typeof AddProductPhotoSchema>;
export type GetProductsDto = z.infer<typeof GetProductsSchema>;
export type RemoveProductCategoryDto = z.infer<typeof RemoveProductCategorySchema>;
export type RemoveProductPhotoDto = z.infer<typeof RemoveProductPhotoSchema>;
