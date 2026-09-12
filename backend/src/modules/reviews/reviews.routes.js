import "dotenv/config";
import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import {
  criar_review_controller,
  listar_reviews_controller,
} from "./reviews.controller.js";

const review_router = express.Router();

/**
 * @openapi
 * /api/reviews/criar/{exchangeId}:
 *   post:
 *     summary: Cria uma avaliação para uma troca concluída
 *     tags:
 *       - Avaliações
 *     security:
 *       - bearerAuth: []
 *     paramaters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da troca (exchange) a ser avaliada
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Nota de 1 a 5 para a experiência
 *               comment:
 *                 type: string
 *                 description: Comentário opcional sobre o serviço prestado
 *     responses:
 *       201:
 *         description: Avaliaçãpo enviada com sucesso
 *       400:
 *         description: Dados inválidos ou a troca ainda não foi concluída
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Você não participou desta troca
 *       409:
 *         description: Você já avaliou esta troca
 *
 */

review_router.post(
  "/criar/:exchangeId",
  authMiddleware,
  criar_review_controller,
);

/**
 * @openapi
 * /api/reviews/{reviewedId}/reviews:
 *   get:
 *     summary: Lista reviews de um usuário
 *     tags:
 *       - Avaliações
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewedId
 *         required: true
 *         description: ID do usuário avaliado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de avaliações retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   exchange_id:
 *                     type: integer
 *                   reviewer_id:
 *                     type: integer
 *                   rating:
 *                     type: integer
 *                   comment:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *         404:
 *           description: Usuário não encontrado
 */

review_router.get("/:reviewedId/reviews", listar_reviews_controller);
export default review_router;
