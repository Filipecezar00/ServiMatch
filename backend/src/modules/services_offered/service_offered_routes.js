import "dotenv/config";
import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import {
  alterarStatusServico_controller,
  criar_controller,
} from "./service_offered_controller.js";
import {
  listarAtivos_controller,
  listarServicosUsuario_controller,
  editarServico_controller,
} from "./service_offered_controller.js";

const service_router_offered = express.Router();

/**
 * @openapi
 * /api/services-offered/criar:
 *   post:
 *     summary: Cria serviço oferecido
 *     tags:
 *       - Serviços
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título ou nome do serviço
 *               description:
 *                 type: string
 *                 description: Detalhes sobre o serviço prestado
 *               category_id:
 *                 type: integer
 *                 description: ID da categoria relacionada (opcional)
 *     responses:
 *       200:
 *         description: Serviço cadastrado com sucesso
 *       400:
 *         description: Dados de entrada inválidos ou ausentes
 *       401:
 *         description: Token ausente ou inválido
 *
 */
service_router_offered.post("/criar", authMiddleware, criar_controller);
service_router_offered.get("/listar-ativos", listarAtivos_controller);
service_router_offered.get(
  "/listar-minhas",
  authMiddleware,
  listarServicosUsuario_controller,
);
service_router_offered.put("/:id", authMiddleware, editarServico_controller);
service_router_offered.patch(
  "/:id/status",
  authMiddleware,
  alterarStatusServico_controller,
);
export default service_router_offered;
