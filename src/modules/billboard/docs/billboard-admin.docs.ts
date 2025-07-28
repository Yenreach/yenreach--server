import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { CreateBillboardEntrySchema, UpdateBillboardEntrySchema } from '../schemas/billboard.schema';

export const billboardRegistry = new OpenAPIRegistry();

// DTOs
const CreateBillboardDto = billboardRegistry.register('CreateBillboardDto', CreateBillboardEntrySchema);
const UpdateBillboardDto = billboardRegistry.register('UpdateBillboardDto', UpdateBillboardEntrySchema);

// Shared param
const IdParam = z.object({ id: z.string().uuid('Invalid ID format') });

// Component: BillboardResponse
billboardRegistry.registerComponent('schemas', 'BillboardResponse', {
  type: 'object',
  properties: {
    id: { type: 'string' },
    businessId: { type: 'string', nullable: true },
    title: { type: 'string', nullable: true },
    description: { type: 'string', nullable: true },
    imageUrl: { type: 'string', nullable: true },
    ctaText: { type: 'string', nullable: true },
    ctaLink: { type: 'string', nullable: true },
    startDate: { type: 'string', format: 'date-time' },
    endDate: { type: 'string', format: 'date-time' },
    created_at: { type: 'string', format: 'date-time' },
  },
});

billboardRegistry.registerComponent('schemas', 'BillboardListResponse', {
  type: 'array',
  items: { $ref: 'BillboardResponse' },
});

// POST /admin/billboards
billboardRegistry.registerPath({
  method: 'post',
  path: '/admin/billboards',
  tags: ['Billboards'],
  summary: 'Create billboard entry',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateBillboardDto,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Billboard entry created',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/BillboardResponse' },
        },
      },
    },
  },
});

// PATCH /admin/billboards/:id
billboardRegistry.registerPath({
  method: 'patch',
  path: '/admin/billboards/{id}',
  tags: ['Billboards'],
  summary: 'Update billboard entry',
  security: [{ bearerAuth: [] }],
  request: {
    params: billboardRegistry.register('BillboardIdParam', IdParam),
    body: {
      content: {
        'application/json': {
          schema: UpdateBillboardDto,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Billboard entry updated',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/BillboardResponse' },
        },
      },
    },
  },
});

// GET /admin/billboards
billboardRegistry.registerPath({
  method: 'get',
  path: '/admin/billboards',
  tags: ['Billboards'],
  summary: 'Get all billboard entries',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Billboard entries list',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/BillboardListResponse' },
        },
      },
    },
  },
});

// DELETE /admin/billboards/:id
billboardRegistry.registerPath({
  method: 'delete',
  path: '/admin/billboards/{id}',
  tags: ['Billboards'],
  summary: 'Delete billboard entry',
  security: [{ bearerAuth: [] }],
  request: {
    params: billboardRegistry.register('DeleteBillboardParam', IdParam),
  },
  responses: {
    204: {
      description: 'Billboard entry deleted',
    },
  },
});
