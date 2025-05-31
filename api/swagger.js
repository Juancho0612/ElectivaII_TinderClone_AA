import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tinder App API",
      version: "1.0.0",
      description: "Documentación de la API de la app tipo Tinder",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "6657f8e8c7e1a2b3c4d5e6f7",
            },
            name: {
              type: "string",
              example: "Juan",
            },
            email: {
              type: "string",
              example: "juan@email.com",
            },
            image: {
              type: "string",
              example: "https://url.com/foto.jpg",
            },
            gender: {
              type: "string",
              example: "male",
            },
            genderPreference: {
              type: "string",
              example: "female",
            },
            likes: {
              type: "array",
              items: { type: "string" },
            },
            dislikes: {
              type: "array",
              items: { type: "string" },
            },
            matches: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        Message: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6657f8e8c7e1a2b3c4d5e6f7" },
            sender: { type: "string", example: "6657f8e8c7e1a2b3c4d5e6f7" },
            receiver: { type: "string", example: "6657f8e8c7e1a2b3c4d5e6f8" },
            content: { type: "string", example: "Hola, ¿cómo estás?" },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-31T10:00:00.000Z",
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./api/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
