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

/**
 * @openapi
 * /api/services-wanted/listar-ativos:
 *   get:
 *     summary: Lista serviços ativos
 *     tags:
 *       - services-wanted
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
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

service_router_wanted.get("/listar-ativos", listar_ativos_controller);

/**
 * @openapi
 * /api/services-wanted/listar-minhas:
 *   get:
 *     summary: Lista serviços que quero ativos
 *     tags:
 *       - services-wanted
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: lista de meus serviços retornada com sucesso
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
 *       401:
 *          description: Token ausente ou inválido
 */
service_router_wanted.get(
  "/listar-minhas",
  authMiddleware,
  listar_meusAtivos_controller,
);
/**
 * @openapi
 * /api/services-wanted/{id}:
 *   put:
 *     summary: Editar serviço que quero
 *     tags:
 *       - services-wanted
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do serviço oferecido a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titulo atualizado do serviço
 *               description:
 *                 type: string
 *                 description: Detalhes atualizado do serviço
 *               category_id:
 *                 type: integer
 *                 description: ID da categoria
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso
 *       400:
 *         description: Dados fornecidos inválidos
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Sem permissão para alterar este serviço
 *       404:
 *         description: Serviço não encontrado
 */

service_router_wanted.put("/:id", authMiddleware, editar_servico_controller);
/**
 * @openapi
 * /api/services-wanted/{id}/status:
 *   patch:
 *     summary: Editar Status do serviço
 *     tags:
 *       - services-wanted
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do serviço a ter o status atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ativo
 *             properties:
 *               ativo:
 *                 type: boolean
 *                 description: Indica se o serviço está ativo (true) ou inativo (false)
 *     responses:
 *       200:
 *         description: Status do serviço atualizado
 *       400:
 *         description: Status inválido
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Sem permissão para alterar este serviço
 *       404:
 *         description: Serviço não encontrado
 */
service_router_wanted.patch(
  "/:id/status",
  authMiddleware,
  editar_statusServico_controller,
);

export default service_router_wanted;
