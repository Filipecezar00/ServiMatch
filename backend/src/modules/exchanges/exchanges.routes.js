import "dotenv/config";
import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import {
  listar_exchange_controller,
  update_exchange_controller,
  completed_exchange_controller,
  canceled_exchange_controller,
} from "./exchanges.controller.js";

const exchange_router = express.Router();

/**
 * @openapi
 * /api/exchange/listar:
 *   get:
 *     summary: Lista as propostas de troca do usuário autenticado
 *     tags:
 *       - exchange
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         description: Filtrar proposta por status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *     responses:
 *       200:
 *         description: Lista de propostas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   proposer_id:
 *                     type: integer
 *                   receiver_id:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *          description: Token ausente ou inválido
 */
exchange_router.get("/listar", authMiddleware, listar_exchange_controller);

/**
 * @openapi
 * /api/exchange/{id}/editar:
 *    patch:
 *     summary: Edição de propostas
 *     tags:
 *       - exchange
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da proposta a ser atualizada
 *         schema:
 *           type: integer
 *    requestBody:
 *      required:  true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              offered_service_id:
 *                type: integer
 *                description: ID do serviço oferecido atualizado
 *              requested_service_id:
 *                type: integer
 *                description: ID do serviço solicitado atualizado
 *              description:
 *                type: string
 *                description: Detalhes ou observações atualizadas
 *    responses:
 *      200:
 *        description: Proposta atualizada com sucesso
 *      400:
 *        description: Dados fornecidos inválidos
 *      401:
 *        description: Token ausente ou inválido
 *      403:
 *        description: Sem permissão para alterar esta proposta
 *      404:
 *        description: Proposta não encontrada
 *
 */

exchange_router.patch(
  "/:id/editar",
  authMiddleware,
  update_exchange_controller,
);

/**
 * @openapi
 * /api/exchange/{id}/concluir:
 *   patch:
 *      summary: Concluir proposta
 *      tags:
 *        - exchange
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID da proposta a ser concluida
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: Proposta concluída com sucesso
 *        400:
 *          description: A proposta não pode ser concluída no status atual
 *        401:
 *          description: Token ausente ou inválido
 *        403:
 *          description: Sem permissão para concluir esta proposta
 *        404:
 *          description: Proposta não encontrada
 */
exchange_router.patch(
  "/:id/concluir",
  authMiddleware,
  completed_exchange_controller,
);

/**
 * @openapi
 * /api/exchange/{id}/cancelar:
 *   patch:
 *      summary: Cancelar Proposta
 *      tags:
 *        - exchange
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID da proposta a ser concluida
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: Proposta cancelada com Sucesso
 *        400:
 *          description: A proposta já foi cancelada
 *        401:
 *          description: Token ausente ou inválido
 *        403:
 *          description: Sem permissão para cancelar essa troca
 *        404:
 *          description: Proposta não encontra
 *
 */
exchange_router.patch(
  "/:id/cancelar",
  authMiddleware,
  canceled_exchange_controller,
);

export default exchange_router;
