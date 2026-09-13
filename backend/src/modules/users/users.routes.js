import express from "express";
import {
  criarUsuario,
  loginUsuario,
} from "../../modules/users/users.controller.js";
const user_router = express.Router();

/**
 * @openapi
 * /api/users/cadastro:
 *    post:
 *     summary: Cadastra usuário
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do usuário
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Endereço de e-mail do usuário
 *               senha:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário
 *    responses:
 *         201:
 *           description: Usuário cadastrado com sucesso
 *         400:
 *           description: Dados de entrada inválidos ou ausentes
 */
user_router.post("/cadastro", criarUsuario);
user_router.post("/login", loginUsuario);

export default user_router;
