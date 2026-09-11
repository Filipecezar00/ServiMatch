import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ServiMatch API",
      version: "1.0.0",
      description: "Documentação oficial da API do backend ServiMatch",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local de Desenvolvimento",
      },
    ],
  },
  apis: ["./src/modules/**/*.js", "./src/routes/*.js"],
};
const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
