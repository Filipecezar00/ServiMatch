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
 *       - services-offered
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

/**
 * @openapi
 * /api/services-offered/listar-ativos:
 *   get:
 *     summary: Lista serviços ativos de outros usuarios
 *     tags:
 *       - services-offered
 *     security:
 *       - bearerAuth: []
 *     responses:
 *        200:
 *         description: Lista de serviços retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *         401:
 *          description: Token ausente ou inválido
 */
service_router_offered.get("/listar-ativos", listarAtivos_controller);

/**
 * @openapi
 * /api/services-offered/listar-minhas:
 *   get:
 *     summary: Lista meus serviços ativos
 *     tags:
 *       - services-offered
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de meus serviços retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format : date-time
 *       401:
 *         description: Token ausente ou inválido
 */
service_router_offered.get(
  "/listar-minhas",
  authMiddleware,
  listarServicosUsuario_controller,
);

/**
 * @openapi
 * /api/services-offered/{id}:
 *  put:
 *    summary: Atualiza um serviço oferecido
 *    tags:
 *      - services-offered
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID do serviço oferecido a ser atualizado
 *        schema:
 *          type: integer
 *    requestBody:
 *      required: true
 *      content:
 *       application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titulo atualizado do serviço
 *               description:
 *                 type: string
 *                 description: Detalhes atualizado do serviço
 *               categoryId:
 *                 type: integer
 *                 description: ID da categoria
 *      responses:
 *        200:
 *          description: Serviço atualizado com sucesso
 *        400:
 *          description: Dados fornecidos inválidos
 *        401:
 *          description: Token ausente ou inválido
 *        403:
 *          description: Sem permissão para alterar este serviço
 *        404:
 *          description: Serviço não encontrado
 */
service_router_offered.put("/:id", authMiddleware, editarServico_controller);
/**
 * @openapi
 * /api/services-offered/{id}/status:
 *   patch:
 *     summary: Altera o status de um serviço oferecido
 *     tags:
 *       - services-offered
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do serviço oferecido a ter o status atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - ativo
 *            properties:
 *              ativo:
 *                type: boolean
 *                description: Indica se o serviço está ativo (true) ou inativo (falso)
 *      responses:
 *       200:
 *         description: Status do serviço atualizado
 *       400:
 *         description: Status inválido
 *       401:
 *         description: Token ausente ou invalido
 *       403:
 *         description: Sem permissão para alterar este serviço
 *       404:
 *         description: Serviço não encontrado
 */
service_router_offered.patch(
  "/:id/status",
  authMiddleware,
  alterarStatusServico_controller,
);
export default service_router_offered;
