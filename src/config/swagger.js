import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Andes Airlines Check-in API',
    version: '1.0.0',
    description: 'API para check-in automático de pasajeros',
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // Rutas donde están los comentarios JSDoc
};

export const swaggerSpec = swaggerJSDoc(options);
