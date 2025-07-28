import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { AddBusinessOfTheWeekSchema, CreateBusinessSchema, UpdateBusinessSchema } from '../schemas/buisiness.schema';

export const adminBusinessRegistry = new OpenAPIRegistry();

// DTOs
const CreateBusinessDto = adminBusinessRegistry.register('CreateBusinessDto', CreateBusinessSchema);
const UpdateBusinessDto = adminBusinessRegistry.register('UpdateBusinessDto', UpdateBusinessSchema);
const AddBusinessOfTheWeekDto = adminBusinessRegistry.register('AddBusinessOfTheWeekDto', AddBusinessOfTheWeekSchema);

// Params
const BusinessIdParam = adminBusinessRegistry.register(
  'AdminBusinessIdParam',
  z.object({
    id: z.string().uuid('Invalid business ID format'),
  }),
);

const AdminBusinessQueryParams = adminBusinessRegistry.register(
  'AdminBusinessQueryParams',
  z.object({
    status: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
  }),
);
// GET /admin/business

adminBusinessRegistry.registerPath({
  method: 'get',
  path: '/admin/business',
  tags: ['Admin Business'],
  summary: 'Get all businesses with filters and pagination',
  security: [{ bearerAuth: [] }],
  request: {
    query: AdminBusinessQueryParams,
  },
  responses: {
    200: {
      description: 'Filtered businesses retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              businesses: {
                type: 'array',
                items: { $ref: '#/components/schemas/BusinessResponse' },
              },
              pagination: {
                type: 'object',
                properties: {
                  page: { type: 'number' },
                  limit: { type: 'number' },
                  total: { type: 'number' },
                  totalPages: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
    401: { $ref: '#/components/responses/Unauthorized' },
  },
});

// GET /admin/business/business-of-the-week
adminBusinessRegistry.registerPath({
  method: 'get',
  path: '/admin/business/business-of-the-week',
  tags: ['Admin Business'],
  summary: 'Get current business of the week',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Business of the week retrieved successfully',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/BusinessResponse' },
        },
      },
    },
    401: { $ref: '#/components/responses/Unauthorized' },
  },
});

// POST /admin/business/:id/business-of-the-week
adminBusinessRegistry.registerPath({
  method: 'post',
  path: '/admin/business/{id}/business-of-the-week',
  tags: ['Admin Business'],
  summary: 'Add business of the week',
  security: [{ bearerAuth: [] }],
  request: {
    params: BusinessIdParam,
    body: {
      content: {
        'application/json': {
          schema: AddBusinessOfTheWeekDto,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Business of the week set successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    401: { $ref: '#/components/responses/Unauthorized' },
    404: { $ref: '#/components/responses/NotFound' },
  },
});

// PUT /admin/business/:id/business-of-the-week
adminBusinessRegistry.registerPath({
  method: 'put',
  path: '/admin/business/{id}/business-of-the-week',
  tags: ['Admin Business'],
  summary: 'Update business of the week',
  security: [{ bearerAuth: [] }],
  request: {
    params: BusinessIdParam,
    body: {
      content: {
        'application/json': {
          schema: AddBusinessOfTheWeekDto,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Business of the week updated successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    401: { $ref: '#/components/responses/Unauthorized' },
    404: { $ref: '#/components/responses/NotFound' },
  },
});

// PATCH /admin/business/:id
adminBusinessRegistry.registerPath({
  method: 'patch',
  path: '/admin/business/{id}',
  tags: ['Admin Business'],
  summary: 'Edit business',
  security: [{ bearerAuth: [] }],
  request: {
    params: BusinessIdParam,
    body: {
      content: {
        'application/json': {
          schema: UpdateBusinessDto,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Business updated successfully',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/BusinessResponse' },
        },
      },
    },
    400: { $ref: '#/components/responses/BadRequest' },
    401: { $ref: '#/components/responses/Unauthorized' },
    404: { $ref: '#/components/responses/NotFound' },
  },
});

// POST /admin/business/:id/approve
adminBusinessRegistry.registerPath({
  method: 'post',
  path: '/admin/business/{id}/approve',
  tags: ['Admin Business'],
  summary: 'Approve business',
  security: [{ bearerAuth: [] }],
  request: {
    params: BusinessIdParam,
  },
  responses: {
    200: {
      description: 'Business approved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    401: { $ref: '#/components/responses/Unauthorized' },
    404: { $ref: '#/components/responses/NotFound' },
  },
});

// POST /admin/business/:id/decline
adminBusinessRegistry.registerPath({
  method: 'post',
  path: '/admin/business/{id}/decline',
  tags: ['Admin Business'],
  summary: 'Decline business',
  security: [{ bearerAuth: [] }],
  request: {
    params: BusinessIdParam,
  },
  responses: {
    200: {
      description: 'Business declined successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    401: { $ref: '#/components/responses/Unauthorized' },
    404: { $ref: '#/components/responses/NotFound' },
  },
});

// DELETE /admin/business/:id
adminBusinessRegistry.registerPath({
  method: 'delete',
  path: '/admin/business/{id}',
  tags: ['Admin Business'],
  summary: 'Delete business',
  security: [{ bearerAuth: [] }],
  request: {
    params: BusinessIdParam,
  },
  responses: {
    200: {
      description: 'Business deleted successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    401: { $ref: '#/components/responses/Unauthorized' },
    404: { $ref: '#/components/responses/NotFound' },
  },
});
