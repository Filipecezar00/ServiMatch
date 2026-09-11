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
 *       - Propostas
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
exchange_router.patch(
  "/:id/editar",
  authMiddleware,
  update_exchange_controller,
);
exchange_router.patch(
  "/:id/concluir",
  authMiddleware,
  completed_exchange_controller,
);
exchange_router.patch(
  "/:id/cancelar",
  authMiddleware,
  canceled_exchange_controller,
);

export default exchange_router;
