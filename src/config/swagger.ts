import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Caveo Backend API',
      version: '1.0.0',
      description: 'API documentation for Caveo Backend Test',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'] // Caminho para seus arquivos de rota
};

export const swaggerSpec = swaggerJSDoc(options);
