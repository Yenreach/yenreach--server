import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { CreateSettingsSchema, UpdateSettingsSchema } from '../schema';

export const settingsRegistry = new OpenAPIRegistry();

// DTOs
const CreateSettingsDto = settingsRegistry.register('CreateSettingsDto', CreateSettingsSchema);
const UpdateSettingsDto = settingsRegistry.register('UpdateSettingsDto', UpdateSettingsSchema);

// Shared param
const NameParam = z.object({ name: z.string().min(1) });

// Components
settingsRegistry.registerComponent('schemas', 'SettingEntityResponse', {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    valueType: { type: 'string' },
    value: {},
    options: { type: 'array', items: {}, nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
});

settingsRegistry.registerComponent('schemas', 'SettingNameValueResponse', {
  type: 'object',
  properties: {
    name: { type: 'string' },
    value: {},
  },
});

// Paths

settingsRegistry.registerPath({
  method: 'get',
  path: '/settings',
  tags: ['Settings'],
  summary: 'Get all settings',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Settings retrieved',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/SettingNameValueResponse' },
          },
        },
      },
    },
  },
});

settingsRegistry.registerPath({
  method: 'post',
  path: '/settings',
  tags: ['Settings'],
  summary: 'Create a new setting',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateSettingsDto,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Setting created',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/SettingEntityResponse' },
        },
      },
    },
  },
});

settingsRegistry.registerPath({
  method: 'get',
  path: '/settings/{name}',
  tags: ['Settings'],
  summary: 'Get setting by name',
  security: [{ bearerAuth: [] }],
  request: {
    params: settingsRegistry.register('SettingNameParam', NameParam),
  },
  responses: {
    200: {
      description: 'Setting retrieved',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/SettingNameValueResponse' },
        },
      },
    },
  },
});
