"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_js_1 = require("../../modules/users/users.controller.js");
const user_router = express_1.default.Router();
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
user_router.post("/cadastro", users_controller_js_1.criarUsuario);
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
user_router.post("/login", users_controller_js_1.loginUsuario);
exports.default = user_router;
