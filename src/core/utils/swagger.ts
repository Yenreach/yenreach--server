import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Yenreach-server',
      version: '1.0.0',
      description: 'Api swagger documentation for yenreach server',
    },
    schemes: ['http', 'https'],
    servers: [
      {
        url: 'http://localhost:3800',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemas: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    responses: {
      400: {
        descripition: 'Bad Request',
        contents: 'application/json',
      },
      401: {
        descripition: 'Unathorized',
        contents: 'application/json',
      },
      404: {
        descripition: 'Not found',
        contents: 'application/json',
      },
      500: {
        descripition: 'Server Error',
        contents: 'application/json',
      },
    },
  },
  // apis: ['./core/schemas/*.ts', './modules/**/schemas/*.ts', './modules/**/routes/*.ts', './core/routes/*.ts'],
  apis: ['./src/modules/**/routes/*.ts'], // Correct path to your route files
};
const swaggerSpecs = swaggerJSDoc(swaggerOptions);

export { swaggerOptions, swaggerSpecs };
