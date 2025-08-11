import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { CreateBlackFridayDealSchema, UpdateBlackFridayDealSchema } from '../schemas/products.schema';
import { z } from 'zod';
import { GetProductsQuery } from './products.docs';

export const productsAdminRegistry = new OpenAPIRegistry();

// Common param for routes with :id
const IdParam = z.object({ id: z.uuid('Invalid ID format') });

// Register DTOs for request bodies
const CreateBlackFridayDealDto = productsAdminRegistry.register('CreateBlackFridayDealDto', CreateBlackFridayDealSchema);
const UpdateBlackFridayDealDto = productsAdminRegistry.register('UpdateBlackFridayDealDto', UpdateBlackFridayDealSchema);

// Schema for Black Friday deal response
productsAdminRegistry.registerComponent('schemas', 'BlackFridayDealResponse', {
  type: 'object',
  properties: {
    id: { type: 'string' },
    discountedPrice: { type: 'number' },
    dealEndDate: { type: 'string', format: 'date-time' },
    productId: { type: 'string', nullable: true },
    created_at: { type: 'string', format: 'date-time' },
    product: { $ref: '#/components/schemas/ProductResponse' },
  },
});
//paginated response
productsAdminRegistry.registerComponent('schemas', 'BlackFridayDealPaginatedResponse', {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: { $ref: '#/components/schemas/BlackFridayDealResponse' },
    },
    meta: { $ref: '#/components/schemas/PaginationMeta' },
  },
});

// Merged schema for combined product + deal info (registered but unused)
productsAdminRegistry.registerComponent('schemas', 'BlackFridayMergedResponse', {
  allOf: [
    { $ref: '#/components/schemas/ProductResponse' },
    {
      type: 'object',
      properties: {
        discountedPrice: { type: 'number' },
        discountPercentage: { type: 'number' },
        dealEndDate: { type: 'string', format: 'date-time' },
      },
      required: ['discountedPrice', 'discountPercentage', 'dealEndDate'],
    },
  ],
});

// For requests that are either using an existing product or creating a new one (oneOf)
const ExistingBlackFridayDealDto = productsAdminRegistry.register('ExistingBlackFridayDealDto', CreateBlackFridayDealSchema.options[0]);
const NewBlackFridayDealDto = productsAdminRegistry.register('NewBlackFridayDealDto', CreateBlackFridayDealSchema.options[1]);

// Create Black Friday Deal
productsAdminRegistry.registerPath({
  method: 'post',
  path: '/admin/products/black-friday',
  tags: ['Products Admin'],
  summary: 'Create Black Friday deal (uses existing product or add new product)',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: {
            oneOf: [{ $ref: '#/components/schemas/ExistingBlackFridayDealDto' }, { $ref: '#/components/schemas/NewBlackFridayDealDto' }],
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Black Friday deal created',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/BlackFridayDealResponse' },
        },
      },
    },
  },
});

// Get paginated Black Friday Deals
productsAdminRegistry.registerPath({
  method: 'get',
  path: '/products/black-friday',
  tags: ['Products Admin'],
  summary: 'Get paginated Black Friday deals with optional search and category filters',
  security: [{ bearerAuth: [] }],
  request: {
    query: GetProductsQuery,
  },
  responses: {
    200: {
      description: 'Paginated list of Black Friday deals',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/BlackFridayDealPaginatedResponse' },
          },
        },
      },
    },
  },
});

// Get single Black Friday Deal by ID
productsAdminRegistry.registerPath({
  method: 'get',
  path: '/products/black-friday/{id}',
  tags: ['Products Admin'],
  summary: 'Get a single Black Friday deal by ID',
  security: [{ bearerAuth: [] }],
  request: {
    params: productsAdminRegistry.register('GetBlackFridayDealByIdParam', IdParam),
  },
  responses: {
    200: {
      description: 'Black Friday deal retrieved',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/BlackFridayDealResponse' },
        },
      },
    },
    404: {
      description: 'Black Friday deal not found',
    },
  },
});

// Get all Black Friday Deals (no filters, no pagination)
productsAdminRegistry.registerPath({
  method: 'get',
  path: '/products/black-friday/all',
  tags: ['Products Admin'],
  summary: 'Get all Black Friday deals without filters or pagination',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'All Black Friday deals retrieved',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/BlackFridayDealPaginatedResponse' },
          },
        },
      },
    },
  },
});

// Update Black Friday Deal
productsAdminRegistry.registerPath({
  method: 'put',
  path: '/admin/products/black-friday/{id}',
  tags: ['Products Admin'],
  summary: 'Update Black Friday deal',
  security: [{ bearerAuth: [] }],
  request: {
    params: productsAdminRegistry.register('UpdateBlackFridayDealParam', IdParam),
    body: {
      content: {
        'application/json': {
          schema: UpdateBlackFridayDealDto,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Black Friday deal updated',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/BlackFridayDealResponse' },
        },
      },
    },
    404: {
      description: 'Black Friday deal not found',
    },
  },
});

// Delete Black Friday Deal
productsAdminRegistry.registerPath({
  method: 'delete',
  path: '/admin/products/black-friday/{id}',
  tags: ['Products Admin'],
  summary: 'Delete Black Friday deal',
  security: [{ bearerAuth: [] }],
  request: {
    params: productsAdminRegistry.register('DeleteBlackFridayDealParam', IdParam),
  },
  responses: {
    204: {
      description: 'Black Friday deal deleted',
    },
    404: {
      description: 'Black Friday deal not found',
    },
  },
});
