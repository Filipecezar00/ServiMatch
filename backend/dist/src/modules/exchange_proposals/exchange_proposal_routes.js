"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const exchange_proposal_controller_js_1 = require("./exchange_proposal_controller.js");
const auth_js_1 = require("../../middleware/auth.js");
const exchange_proposal_router = express_1.default.Router();
/**
 * @openapi
 * /api/exchange-proposals/criar:
 *   post:
 *     summary: Cria uma nova proposta de troca
 *     tags:
 *       - exchange-proposals
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiver_id
 *               - offered_service_id
 *               - requested_service_id
 *             properties:
 *               receiver_id:
 *                 type: integer
 *                 description: ID do usuário receptor da proposta
 *               offered_service_id:
 *                 type: integer
 *                 description: ID do serviço oferecido
 *               requested_service_id:
 *                 type: integer
 *                 description: ID do serviço desejado
 *               description:
 *                 type: string
 *                 description: Mensagem ou detalhes adicionais da troca
 *     responses:
 *       201:
 *         description: Proposta criada com sucesso
 *       400:
 *         description: Dados de entrada inválidos
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Usuário receptor ou serviço não encontrado
 *
 */
exchange_proposal_router.post("/criar", auth_js_1.authMiddleware, exchange_proposal_controller_js_1.criar_controller);
exchange_proposal_router.get("/listar-recebidas", auth_js_1.authMiddleware, exchange_proposal_controller_js_1.listaPropostasRecebidas_controller);
exchange_proposal_router.get("/listar-enviadas", auth_js_1.authMiddleware, exchange_proposal_controller_js_1.listaPropostasEnviadas_controller);
/**
 * @openapi
 * /api/exchange-proposals/{id}/status:
 *   patch:
 *     summary: Altera o status de uma proposta de troca
 *     tags:
 *       - exchange-proposals
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da proposta
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted,rejected]
 *     responses:
 *       200:
 *         description: Status alterado com sucesso
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Sem permissão ou status inválido
 *       404:
 *         description: Proposta não encontrada
 */
exchange_proposal_router.patch("/:id/status", auth_js_1.authMiddleware, exchange_proposal_controller_js_1.mudar_status_controller);
exports.default = exchange_proposal_router;
