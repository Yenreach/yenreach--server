// swagger/config.ts
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { authRegistry } from '../modules/auth/docs';
import { businessRegistry } from '../modules/business/docs';
import { adminBusinessRegistry } from '../modules/business/docs/business-admin.docs';
import { jobsRegistry } from '../modules/jobs/docs';
import { productsRegistry } from '../modules/products/docs';
import { billboardRegistry, publicBillboardRegistry } from '../modules/billboard/docs';

// Create a main registry to add global components
const mainRegistry = new OpenAPIRegistry();

// Register security schemes
mainRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

// Register common error responses
mainRegistry.registerComponent('responses', 'BadRequest', {
  description: 'Bad Request',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
});

mainRegistry.registerComponent('responses', 'Unauthorized', {
  description: 'Unauthorized',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
});

mainRegistry.registerComponent('responses', 'NotFound', {
  description: 'Not found',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
});

mainRegistry.registerComponent('schemas', 'PaginationMeta', {
  type: 'object',
  properties: {
    total: { type: 'number' },
    page: { type: 'number' },
    limit: { type: 'number' },
    totalPages: { type: 'number' },
  },
});

mainRegistry.registerComponent('responses', 'ServerError', {
  description: 'Server Error',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
});

// Combine all definitions
const allDefinitions = [
  ...mainRegistry.definitions,
  ...authRegistry.definitions,
  ...businessRegistry.definitions,
  ...adminBusinessRegistry.definitions,
  ...jobsRegistry.definitions,
  ...productsRegistry.definitions,
  ...billboardRegistry.definitions,
  ...publicBillboardRegistry.definitions,
];

// Create generator
const generator = new OpenApiGeneratorV3(allDefinitions);

// Generate OpenAPI document
export function generateOpenAPIDocument() {
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Yenreach-server',
      description: 'Api swagger documentation for yenreach server',
    },
    servers: [
      {
        url: 'http://localhost:3800/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://yenreach-server-production.up.railway.app/api/v1',
        description: 'Production server',
      },
    ],
  });
}

export const swaggerSpecs = generateOpenAPIDocument();
