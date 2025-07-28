import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

export const publicBillboardRegistry = new OpenAPIRegistry();

// Component: BillboardResponse
publicBillboardRegistry.registerComponent('schemas', 'PublicBillboardResponse', {
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
  },
});

publicBillboardRegistry.registerComponent('schemas', 'PublicBillboardListResponse', {
  type: 'array',
  items: { $ref: 'PublicBillboardResponse' },
});

// GET /billboards
publicBillboardRegistry.registerPath({
  method: 'get',
  path: '/billboards',
  tags: ['Billboards'],
  summary: 'Get active billboard entries (public)',
  responses: {
    200: {
      description: 'List of active billboards',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/PublicBillboardListResponse' },
        },
      },
    },
  },
});
