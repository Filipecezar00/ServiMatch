import "dotenv/config";
import { authMiddleware } from "../../middleware/auth.js";
import express from "express";
import {
  criar_controller,
  listar_ativos_controller,
  listar_meusAtivos_controller,
  editar_servico_controller,
  editar_statusServico_controller,
} from "./service_wanted_controller.js";

const service_router_wanted = express.Router();

/**
 * @openapi
 * /api/services-wanted/criar:
 *   post:
 *     summary: Cria um serviço desejado
 *     tags:
 *       - services-wanted
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
 *                 description: Titulo do serviço desejado
 *               description:
 *                 type: string
 *                 description: Descrição do serviço desejado
 *               categoryId:
 *                 type: integer
 *                 description: ID da categoria
 *     responses:
 *       201:
 *         description: Serviço adicionado com sucesso
 *       400:
 *         description: Dados fornecidos inválidos
 *       401:
 *         description: Token ausente ou inválido
 */
service_router_wanted.post("/criar", authMiddleware, criar_controller);
service_router_wanted.get("/listar-ativos", listar_ativos_controller);
service_router_wanted.get(
  "/listar-minhas",
  authMiddleware,
  listar_meusAtivos_controller,
);
service_router_wanted.put("/:id", authMiddleware, editar_servico_controller);
service_router_wanted.patch(
  "/:id/status",
  authMiddleware,
  editar_statusServico_controller,
);

export default service_router_wanted;
