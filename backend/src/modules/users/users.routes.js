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
/**
 * @openapi
 * /api/users/login:
 *    post:
 *     summary: Login do usuário
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *               senha:
 *                 type: string
 *                 format: password
 *                 description: senha do usuário
 *    responses:
 *         200:
 *           description: Usuario logado
 *         400:
 *           description: Dados de entrada inválidos
 */
user_router.post("/login", loginUsuario);

export default user_router;
