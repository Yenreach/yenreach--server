import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { ProductSchema, UpdateProductSchema, GetProductsSchema, AddCategorySchema, AddProductCategorySchema } from '../schemas/products.schema';

export const productsRegistry = new OpenAPIRegistry();

// DTOs
const CreateProductDto = productsRegistry.register('CreateProductDto', ProductSchema);
const UpdateProductDto = productsRegistry.register('UpdateProductDto', UpdateProductSchema);
export const GetProductsQuery = productsRegistry.register('GetProductsQuery', GetProductsSchema);
const AddCategoryDto = productsRegistry.register('AddCategoryDto', AddCategorySchema);
const AddProductCategoryDto = productsRegistry.register('AddProductCategoryDto', AddProductCategorySchema);

// Shared params
const IdParam = z.object({ id: z.uuid('Invalid ID format') });
const BusinessIdParam = z.object({ business_id: z.uuid('Invalid business ID format') });

// Components
productsRegistry.registerComponent('schemas', 'ProductResponse', {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    businessId: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
    quantity: { type: 'number' },
    color: { type: 'string' },
    safetyTip: { type: 'string' },
    categories: {
      type: 'array',
      items: { type: 'string' },
    },
    photos: {
      type: 'array',
      items: { type: 'string' },
    },
    created_at: { type: 'string', format: 'date-time' },
  },
});

productsRegistry.registerComponent('schemas', 'ProductsPaginatedResponse', {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: { $ref: '#/components/schemas/ProductResponse' },
    },
    meta: { $ref: '#/components/schemas/PaginationMeta' },
  },
});

// Paths
productsRegistry.registerPath({
  method: 'post',
  path: '/products',
  tags: ['Products'],
  summary: 'Create product',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateProductDto,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Product created',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ProductResponse' },
        },
      },
    },
  },
});

productsRegistry.registerPath({
  method: 'get',
  path: '/products',
  tags: ['Products'],
  summary: 'Get products (paginated)',
  request: {
    query: GetProductsQuery,
  },
  responses: {
    200: {
      description: 'Products list',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ProductsPaginatedResponse' },
        },
      },
    },
  },
});

productsRegistry.registerPath({
  method: 'get',
  path: '/products/all',
  tags: ['Products'],
  summary: 'Get all products',
  responses: {
    200: {
      description: 'All products (unpaginated)',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProductResponse' },
          },
        },
      },
    },
  },
});

productsRegistry.registerPath({
  method: 'get',
  path: '/products/categories',
  tags: ['Products'],
  summary: 'Get product categories',
  responses: {
    200: {
      description: 'Categories list',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    },
  },
});

productsRegistry.registerPath({
  method: 'get',
  path: '/products/{id}',
  tags: ['Products'],
  summary: 'Get product by ID',
  request: {
    params: productsRegistry.register('ProductIdParam', IdParam),
  },
  responses: {
    200: {
      description: 'Product found',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ProductResponse' },
        },
      },
    },
  },
});

productsRegistry.registerPath({
  method: 'get',
  path: '/products/{id}/related',
  tags: ['Products'],
  summary: 'Get related products',
  request: {
    params: productsRegistry.register('RelatedProductParam', IdParam),
  },
  responses: {
    200: {
      description: 'Related products',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProductResponse' },
          },
        },
      },
    },
  },
});

productsRegistry.registerPath({
  method: 'get',
  path: '/products/{business_id}/products',
  tags: ['Products'],
  summary: 'Get business products',
  request: {
    params: productsRegistry.register('BusinessProductsParam', BusinessIdParam),
  },
  responses: {
    200: {
      description: 'Business products',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProductResponse' },
          },
        },
      },
    },
  },
});

productsRegistry.registerPath({
  method: 'put',
  path: '/products/{id}',
  tags: ['Products'],
  summary: 'Update product',
  security: [{ bearerAuth: [] }],
  request: {
    params: productsRegistry.register('UpdateProductParam', IdParam),
    body: {
      content: {
        'application/json': {
          schema: UpdateProductDto,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Product updated',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ProductResponse' },
        },
      },
    },
  },
});

productsRegistry.registerPath({
  method: 'delete',
  path: '/products/{id}',
  tags: ['Products'],
  summary: 'Delete product',
  request: {
    params: productsRegistry.register('DeleteProductParam', IdParam),
  },
  responses: {
    204: {
      description: 'Product deleted',
    },
  },
});

productsRegistry.registerPath({
  method: 'post',
  path: '/products/categories',
  tags: ['Products'],
  summary: 'Create product category',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: AddCategoryDto,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Category created',
      content: {
        'application/json': {
          schema: {
            type: 'string',
          },
        },
      },
    },
  },
});

productsRegistry.registerPath({
  method: 'post',
  path: '/products/assign-category',
  tags: ['Products'],
  summary: 'Assign category to product',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: AddProductCategoryDto,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Category assigned to product',
      content: {
        'application/json': {
          schema: {
            type: 'string',
          },
        },
      },
    },
  },
});
