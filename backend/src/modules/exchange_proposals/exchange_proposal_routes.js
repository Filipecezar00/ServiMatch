import "dotenv/config";
import express from "express";
import {
  criar_controller,
  mudar_status_controller,
} from "./exchange_proposal_controller.js";
import { authMiddleware } from "../../middleware/auth.js";

const exchange_proposal_router = express.Router();

exchange_proposal_router.post("/criar", authMiddleware, criar_controller);

/**
 @openapi
 /api/exchange-proposals/{id}/status:
 patch:
 summary: Altera o status de uma proposta de troca
 tags:
  - Proposta
 parameters:
  - in:path
  name: id
  required: true
  schema:
   type:integer
  description: ID da proposta
  requestBody:
   required: true
  content:
   application/json:
  schema:
   type:object
  properties:
   status:
  type: string
  enum: [accepted,rejected]

  responses:
   200:
 description: Status alterado com sucesso
  403:
 description: Sem permissão ou status inválido
  404:
 description: Proposta não encontrada
 */
exchange_proposal_router.patch(
  "/:id/status",
  authMiddleware,
  mudar_status_controller,
);

export default exchange_proposal_router;
