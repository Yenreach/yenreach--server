import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  AddBusinessPhotoSchema,
  AddBusinessReviewSchema,
  AddBusinessWorkingHoursSchema,
  CreateBusinessSchema,
  UpdateBusinessSchema,
} from '../schemas';
import { AddBusinessOfTheWeekSchema } from '../schemas/buisiness.schema';

export const businessRegistry = new OpenAPIRegistry();

// Register Zod schemas
const CreateBusinessDto = businessRegistry.register('CreateBusinessDto', CreateBusinessSchema);
const UpdateBusinessDto = businessRegistry.register('UpdateBusinessDto', UpdateBusinessSchema);
const AddBusinessReviewDto = businessRegistry.register('AddBusinessReviewDto', AddBusinessReviewSchema);
const AddBusinessWorkingHoursDto = businessRegistry.register('AddBusinessWorkingHoursDto', AddBusinessWorkingHoursSchema);
const AddBusinessPhotoDto = businessRegistry.register('AddBusinessPhotoDto', AddBusinessPhotoSchema);
const AddBusinessOfTheWeekDto = businessRegistry.register('AddBusinessOfTheWeekDto', AddBusinessOfTheWeekSchema);

// Register common response schemas
businessRegistry.registerComponent('schemas', 'BusinessResponse', {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    description: { type: 'string' },
    category: { type: 'string' },
    address: { type: 'string' },
    email: { type: 'string', format: 'email' },
    phoneNumber: { type: 'string' },
    experience: { type: 'number' },
    profileImg: { type: 'string' },
    coverImg: { type: 'string' },
    website: { type: 'string' },
    whatsapp: { type: 'string' },
    twitterLink: { type: 'string' },
    instagramLink: { type: 'string' },
    youtubeLink: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
});

businessRegistry.registerComponent('schemas', 'StateResponse', {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    code: { type: 'string' },
  },
});

businessRegistry.registerComponent('schemas', 'LgaResponse', {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    stateId: { type: 'string' },
  },
});

businessRegistry.registerComponent('schemas', 'CategoryResponse', {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
  },
});

// GET /states
businessRegistry.registerPath({
  method: 'get',
  path: '/states',
  tags: ['Business'],
  summary: 'Get all states',
  responses: {
    200: {
      description: 'List of states retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/StateResponse' },
          },
        },
      },
    },
  },
});

// GET /states/:id/lgas
businessRegistry.registerPath({
  method: 'get',
  path: '/states/{id}/lgas',
  tags: ['Business'],
  summary: 'Get LGAs by state ID',
  request: {
    params: businessRegistry.register(
      'StateIdParam',
      z.object({
        id: z.string().min(1, 'State ID is required'),
      }),
    ),
  },
  responses: {
    200: {
      description: 'LGAs retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/LgaResponse' },
          },
        },
      },
    },
    404: {
      description: 'State not found',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
        },
      },
    },
  },
});

// GET /business/categories
businessRegistry.registerPath({
  method: 'get',
  path: '/business/categories',
  tags: ['Business'],
  summary: 'Get all business categories',
  responses: {
    200: {
      description: 'Categories retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/CategoryResponse' },
          },
        },
      },
    },
  },
});

// GET /business/:id/related
businessRegistry.registerPath({
  method: 'get',
  path: '/business/{id}/related',
  tags: ['Business'],
  summary: 'Get related businesses',
  request: {
    params: businessRegistry.register(
      'BusinessIdParam',
      z.object({
        id: z.uuid('Invalid business ID format'),
      }),
    ),
  },
  responses: {
    200: {
      description: 'Related businesses retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/BusinessResponse' },
          },
        },
      },
    },
    404: {
      description: 'Business not found',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
        },
      },
    },
  },
});

// GET /business/business-of-the-week
businessRegistry.registerPath({
  method: 'get',
  path: '/business/business-of-the-week',
  tags: ['Business'],
  summary: 'Get current business of the week',
  responses: {
    200: {
      description: 'Business of the week retrieved successfully',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/BusinessResponse' },
        },
      },
    },
    404: {
      description: 'No business of the week found',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
        },
      },
    },
  },
});

// GET /business/:id
businessRegistry.registerPath({
  method: 'get',
  path: '/business/{id}',
  tags: ['Business'],
  summary: 'Get business by ID',
  request: {
    params: businessRegistry.register(
      'BusinessIdParam2',
      z.object({
        id: z.string().uuid('Invalid business ID format'),
      }),
    ),
  },
  responses: {
    200: {
      description: 'Business retrieved successfully',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/BusinessResponse' },
        },
      },
    },
    404: {
      description: 'Business not found',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
        },
      },
    },
  },
});

// GET /business
businessRegistry.registerPath({
  method: 'get',
  path: '/business',
  tags: ['Business'],
  summary: 'Get all businesses with pagination',
  request: {
    query: businessRegistry.register(
      'BusinessQueryParams',
      z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        category: z.string().optional(),
        state: z.string().optional(),
        search: z.string().optional(),
      }),
    ),
  },
  responses: {
    200: {
      description: 'Businesses retrieved successfully',
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
  },
});

// GET /user/business (Protected)
businessRegistry.registerPath({
  method: 'get',
  path: '/user/business',
  tags: ['Business'],
  summary: 'Get user businesses',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'User businesses retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/BusinessResponse' },
          },
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
        },
      },
    },
  },
});

// GET /business/:id/products (Protected)
businessRegistry.registerPath({
  method: 'get',
  path: '/business/{id}/products',
  tags: ['Business'],
  summary: 'Get all business products',
  security: [{ bearerAuth: [] }],
  request: {
    params: businessRegistry.register(
      'BusinessIdParam3',
      z.object({
        id: z.string().uuid('Invalid business ID format'),
      }),
    ),
  },
  responses: {
    200: {
      description: 'Business products retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
              },
            },
          },
        },
      },
    },
    401: { $ref: '#/components/responses/Unauthorized' },
    404: { $ref: '#/components/responses/NotFound' },
  },
});

// GET /business/:id/jobs (Protected)
businessRegistry.registerPath({
  method: 'get',
  path: '/business/{id}/jobs',
  tags: ['Business'],
  summary: 'Get all business jobs',
  security: [{ bearerAuth: [] }],
  request: {
    params: businessRegistry.register(
      'BusinessIdParam4',
      z.object({
        id: z.string().uuid('Invalid business ID format'),
      }),
    ),
  },
  responses: {
    200: {
      description: 'Business jobs retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                salary: { type: 'number' },
              },
            },
          },
        },
      },
    },
    401: { $ref: '#/components/responses/Unauthorized' },
    404: { $ref: '#/components/responses/NotFound' },
  },
});

// POST /business (Protected)
businessRegistry.registerPath({
  method: 'post',
  path: '/business',
  tags: ['Business'],
  summary: 'Create a new business',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateBusinessDto,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Business created successfully',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/BusinessResponse' },
        },
      },
    },
    400: { $ref: '#/components/responses/BadRequest' },
    401: { $ref: '#/components/responses/Unauthorized' },
  },
});

// PUT /business/:id (Protected)
businessRegistry.registerPath({
  method: 'put',
  path: '/business/{id}',
  tags: ['Business'],
  summary: 'Update business',
  security: [{ bearerAuth: [] }],
  request: {
    params: businessRegistry.register(
      'BusinessIdParam5',
      z.object({
        id: z.string().uuid('Invalid business ID format'),
      }),
    ),
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

// POST /business/:id/review (Protected)
businessRegistry.registerPath({
  method: 'post',
  path: '/business/{id}/review',
  tags: ['Business'],
  summary: 'Add business review',
  security: [{ bearerAuth: [] }],
  request: {
    params: businessRegistry.register(
      'BusinessIdParam6',
      z.object({
        id: z.uuid('Invalid business ID format'),
      }),
    ),
    body: {
      content: {
        'application/json': {
          schema: AddBusinessReviewDto,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Review added successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              review: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  review: { type: 'string' },
                  star: { type: 'number' },
                  createdAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
      },
    },
    400: { $ref: '#/components/responses/BadRequest' },
    401: { $ref: '#/components/responses/Unauthorized' },
    404: { $ref: '#/components/responses/NotFound' },
  },
});
