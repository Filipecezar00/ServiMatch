"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const auth_js_1 = require("../../middleware/auth.js");
const service_offered_controller_js_1 = require("./service_offered_controller.js");
const upload_js_1 = __importDefault(require("../../middleware/upload.js"));
const service_router_offered = express_1.default.Router();
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
service_router_offered.post("/criar", auth_js_1.authMiddleware, upload_js_1.default.array("imagens", 3), service_offered_controller_js_1.criar_controller);
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
service_router_offered.get("/listar-ativos", service_offered_controller_js_1.listarAtivos_controller);
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
service_router_offered.get("/listar-minhas", auth_js_1.authMiddleware, service_offered_controller_js_1.listarServicosUsuario_controller);
service_router_offered.get("/categorias", auth_js_1.authMiddleware, service_offered_controller_js_1.listarCategorias_controller);
service_router_offered.get("/buscar-servicos", auth_js_1.authMiddleware, service_offered_controller_js_1.filtro_listar_servicos_offered_controller);
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
service_router_offered.put("/:id", auth_js_1.authMiddleware, service_offered_controller_js_1.editarServico_controller);
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
service_router_offered.patch("/:id/status", auth_js_1.authMiddleware, service_offered_controller_js_1.alterarStatusServico_controller);
/**
 * @openapi
 * /api/services-offered/categorias:
 *   get:
 *     summary: Lista de categorias ativas
 *     tags:
 *       - services-offered
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *       401:
 *         description: Token ausente ou inválido
 */
service_router_offered.get("/:id/servico", auth_js_1.authMiddleware, service_offered_controller_js_1.buscarServicoPorId_controller);
service_router_offered.get("/:id", service_offered_controller_js_1.buscarDetalhesServico_controller);
exports.default = service_router_offered;
