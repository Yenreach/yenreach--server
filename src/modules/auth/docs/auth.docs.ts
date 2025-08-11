import { extendZodWithOpenApi, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { CreateAdminSchema, CreateAuthSchema, LoginSchema } from '../schemas';
import { AdminLoginSchema } from '../schemas/auth.schema';

export const authRegistry = new OpenAPIRegistry();

const CreateAuthDto = authRegistry.register('CreateAuthDto', CreateAuthSchema);
const LoginDto = authRegistry.register('LoginDto', LoginSchema);
const CreateAdminDto = authRegistry.register('CreateAdminDto', CreateAdminSchema);
const AdminLoginDto = authRegistry.register('AdminLoginDto', AdminLoginSchema);

authRegistry.registerComponent('schemas', 'ErrorResponse', {
  type: 'object',
  properties: {
    error: {
      type: 'string',
      example: 'Invalid credentials',
    },
    message: {
      type: 'string',
      example: 'The provided email or password is incorrect',
    },
    statusCode: {
      type: 'number',
      example: 400,
    },
  },
  required: ['error', 'message', 'statusCode'],
});

authRegistry.registerComponent('schemas', 'SuccessResponse', {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      example: 'Operation completed successfully',
    },
    data: {
      type: 'object',
      additionalProperties: true,
    },
  },
  required: ['message'],
});

authRegistry.registerComponent('schemas', 'AuthResponse', {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      example: 'Login successful',
    },
    token: {
      type: 'string',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    user: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
      },
    },
    expiresIn: {
      type: 'string',
      example: '24h',
    },
  },
  required: ['message', 'token', 'user'],
});

authRegistry.registerComponent('schemas', 'ValidationErrorResponse', {
  type: 'object',
  properties: {
    error: {
      type: 'string',
      example: 'Validation failed',
    },
    details: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
            example: 'email',
          },
          message: {
            type: 'string',
            example: 'Invalid email format',
          },
        },
      },
    },
  },
  required: ['error', 'details'],
});

authRegistry.registerPath({
  method: 'post',
  path: '/auth/signup',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateAuthDto,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User created successfully',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/SuccessResponse' },
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
        },
      },
    },
    409: {
      description: 'User already exists',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
        },
      },
    },
  },
});

authRegistry.registerPath({
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: LoginDto,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Login successful',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/AuthResponse' },
        },
      },
    },
    400: {
      description: 'Invalid credentials',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
        },
      },
    },
    404: {
      description: 'User not found',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
        },
      },
    },
  },
});

authRegistry.registerPath({
  method: 'post',
  path: '/auth/admin-login',
  tags: ['Admin Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: AdminLoginDto,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Admin login successful',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/AuthResponse' },
        },
      },
    },
    400: {
      description: 'Invalid credentials',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
        },
      },
    },
    404: {
      description: 'Admin not found',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
        },
      },
    },
  },
});
