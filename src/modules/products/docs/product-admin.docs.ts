import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { CreateBlackFridayDealSchema, UpdateBlackFridayDealSchema } from '../schemas/products.schema';
import { z } from 'zod';

export const productsAdminRegistry = new OpenAPIRegistry();

const IdParam = z.object({ id: z.uuid('Invalid ID format') });

const CreateBlackFridayDealDto = productsAdminRegistry.register('CreateBlackFridayDealDto', CreateBlackFridayDealSchema);
const UpdateBlackFridayDealDto = productsAdminRegistry.register('UpdateBlackFridayDealDto', UpdateBlackFridayDealSchema);

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

const ExistingBlackFridayDealDto = productsAdminRegistry.register('ExistingBlackFridayDealDto', CreateBlackFridayDealSchema.options[0]);

const NewBlackFridayDealDto = productsAdminRegistry.register('NewBlackFridayDealDto', CreateBlackFridayDealSchema.options[1]);

productsAdminRegistry.registerPath({
  method: 'post',
  path: '/admin/products',
  tags: ['Products Admin'],
  summary: 'Create Black Friday deal (uses exsting product or add new product)',
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
// productsAdminRegistry.registerPath({
//   method: 'put',
//   path: '/admin/products/black-friday/{id}',
//   tags: ['Products Admin'],
//   summary: 'Update Black Friday deal',
//   security: [{ bearerAuth: [] }],
//   request: {
//     params: productsAdminRegistry.register('UpdateBlackFridayDealParam', IdParam),
//     body: {
//       content: {
//         'application/json': {
//           schema: UpdateBlackFridayDealDto,
//         },
//       },
//     },
//   },
//   responses: {
//     200: {
//       description: 'Black Friday deal updated',
//       content: {
//         'application/json': {
//           schema: { $ref: '#/components/schemas/BlackFridayDealResponse' },
//         },
//       },
//     },
//   },
// });

// productsAdminRegistry.registerPath({
//   method: 'get',
//   path: '/admin/products/black-friday',
//   tags: ['Products Admin'],
//   summary: 'List Black Friday deals',
//   security: [{ bearerAuth: [] }],
//   responses: {
//     200: {
//       description: 'List of Black Friday deals',
//       content: {
//         'application/json': {
//           schema: {
//             type: 'array',
//             items: { $ref: '#/components/schemas/BlackFridayDealResponse' },
//           },
//         },
//       },
//     },
//   },
// });

// productsAdminRegistry.registerPath({
//   method: 'delete',
//   path: '/admin/products/black-friday/{id}',
//   tags: ['Products Admin'],
//   summary: 'Delete Black Friday deal',
//   security: [{ bearerAuth: [] }],
//   request: {
//     params: productsAdminRegistry.register('DeleteBlackFridayDealParam', IdParam),
//   },
//   responses: {
//     204: {
//       description: 'Black Friday deal deleted',
//     },
//   },
// });
