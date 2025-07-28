import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { JobSchema, GetJobsSchema } from '../schemas/jobs.schema';

export const jobsRegistry = new OpenAPIRegistry();

// Register DTOs
const CreateJobDto = jobsRegistry.register('CreateJobDto', JobSchema);
const UpdateJobDto = jobsRegistry.register('UpdateJobDto', JobSchema.partial());
const GetJobsDto = jobsRegistry.register('GetJobsQuery', GetJobsSchema);

// Shared schema
const IdParam = z.object({ id: z.uuid('Invalid ID format') });
const BusinessIdParam = z.object({ business_id: z.uuid('Invalid business ID format') });

// Component: JobResponse
jobsRegistry.registerComponent('schemas', 'JobResponse', {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    companyName: { type: 'string' },
    businessId: { type: 'string' },
    title: { type: 'string' },
    type: { type: 'string' },
    location: { type: 'string' },
    salary: { type: 'string' },
    description: { type: 'string' },
    benefit: { type: 'string' },
    applicationMethod: { type: 'string' },
    overview: { type: 'string' },
    applicationExpiry: { type: 'string' },
    tags: {
      type: 'array',
      items: { type: 'string' },
    },
    created_at: { type: 'string', format: 'date-time' },
  },
});

// Component: JobsPaginatedResponse
jobsRegistry.registerComponent('schemas', 'JobsPaginatedResponse', {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: { $ref: '#/components/schemas/JobResponse' },
    },
    meta: { $ref: '#/components/schemas/PaginationMeta' },
  },
});

// POST /jobs
jobsRegistry.registerPath({
  method: 'post',
  path: '/jobs',
  tags: ['Jobs'],
  summary: 'Create job (user)',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateJobDto,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Job created',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/JobResponse' },
        },
      },
    },
  },
});

// POST /jobs/admin
jobsRegistry.registerPath({
  method: 'post',
  path: '/jobs/admin',
  tags: ['Jobs'],
  summary: 'Create job (admin)',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateJobDto,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Admin job created',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/JobResponse' },
        },
      },
    },
  },
});

// GET /jobs
jobsRegistry.registerPath({
  method: 'get',
  path: '/jobs',
  tags: ['Jobs'],
  summary: 'Get jobs (public)',
  request: {
    query: GetJobsDto,
  },
  responses: {
    200: {
      description: 'Jobs list',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/JobsPaginatedResponse' },
        },
      },
    },
  },
});

// GET /jobs/all
jobsRegistry.registerPath({
  method: 'get',
  path: '/jobs/all',
  tags: ['Jobs'],
  summary: 'Get all jobs (admin)',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'All jobs (unpaginated)',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/JobResponse' },
          },
        },
      },
    },
  },
});

// GET /jobs/:id
jobsRegistry.registerPath({
  method: 'get',
  path: '/jobs/{id}',
  tags: ['Jobs'],
  summary: 'Get job by ID',
  request: {
    params: jobsRegistry.register('JobIdParam', IdParam),
  },
  responses: {
    200: {
      description: 'Job found',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/JobResponse' },
        },
      },
    },
  },
});

// GET /jobs/:id/related
jobsRegistry.registerPath({
  method: 'get',
  path: '/jobs/{id}/related',
  tags: ['Jobs'],
  summary: 'Get related jobs',
  request: {
    params: jobsRegistry.register('JobRelatedIdParam', IdParam),
  },
  responses: {
    200: {
      description: 'Related jobs',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/JobResponse' },
          },
        },
      },
    },
  },
});

// GET /jobs/:business_id/jobs
jobsRegistry.registerPath({
  method: 'get',
  path: '/jobs/{business_id}/jobs',
  tags: ['Jobs'],
  summary: 'Get jobs for a business',
  request: {
    params: jobsRegistry.register('BusinessJobsParam', BusinessIdParam),
  },
  responses: {
    200: {
      description: 'Business jobs',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/JobResponse' },
          },
        },
      },
    },
  },
});

// PUT /jobs/:id
jobsRegistry.registerPath({
  method: 'put',
  path: '/jobs/{id}',
  tags: ['Jobs'],
  summary: 'Update job',
  request: {
    params: jobsRegistry.register('UpdateJobParam', IdParam),
    body: {
      content: {
        'application/json': {
          schema: UpdateJobDto,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Job updated',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/JobResponse' },
        },
      },
    },
  },
});

// DELETE /jobs/admin/:id
jobsRegistry.registerPath({
  method: 'delete',
  path: '/jobs/admin/{id}',
  tags: ['Jobs'],
  summary: 'Delete job (admin)',
  security: [{ bearerAuth: [] }],
  request: {
    params: jobsRegistry.register('DeleteJobAdminParam', IdParam),
  },
  responses: {
    204: {
      description: 'Job deleted',
    },
  },
});

// DELETE /jobs/:id
jobsRegistry.registerPath({
  method: 'delete',
  path: '/jobs/{id}',
  tags: ['Jobs'],
  summary: 'Delete job (user)',
  security: [{ bearerAuth: [] }],
  request: {
    params: jobsRegistry.register('DeleteJobParam', IdParam),
  },
  responses: {
    204: {
      description: 'Job deleted',
    },
  },
});
