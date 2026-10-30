"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criar_controller = criar_controller;
exports.listar_ativos_controller = listar_ativos_controller;
exports.listar_meusAtivos_controller = listar_meusAtivos_controller;
exports.editar_servico_controller = editar_servico_controller;
exports.editar_statusServico_controller = editar_statusServico_controller;
exports.buscar_servico_controller = buscar_servico_controller;
exports.listar_categorias_controller = listar_categorias_controller;
const service_wanted_service_js_1 = require("./service_wanted_service.js");
async function criar_controller(req, res, next) {
    try {
        const userId = req.usuario.id;
        const { titulo, descricao, categoryId } = req.body;
        const resposta = await (0, service_wanted_service_js_1.criar_service)(userId, titulo, descricao, categoryId);
        return res.status(201).json(resposta);
    }
    catch (erro) {
        next(erro);
    }
}
async function listar_ativos_controller(req, res, next) {
    try {
        const reposta = await (0, service_wanted_service_js_1.listar_ativos_service)();
        return res.status(200).json(reposta);
    }
    catch (erro) {
        next(erro);
    }
}
async function listar_meusAtivos_controller(req, res, next) {
    try {
        const userId = req.usuario.id;
        const resposta = await (0, service_wanted_service_js_1.listar_meusAtivos_service)(userId);
        return res.status(200).json(resposta);
    }
    catch (erro) {
        next(erro);
    }
}
async function editar_servico_controller(req, res, next) {
    try {
        const user_id = req.usuario.id;
        const { id } = req.params;
        const { titulo, descricao, categoryId } = req.body;
        const resposta = await (0, service_wanted_service_js_1.editar_servico_service)(id, user_id, titulo, descricao, categoryId);
        return res.status(200).json(resposta);
    }
    catch (erro) {
        next(erro);
    }
}
async function editar_statusServico_controller(req, res, next) {
    try {
        const { id } = req.params;
        const user_id = req.usuario.id;
        const { ativo } = req.body;
        const resposta = await (0, service_wanted_service_js_1.editar_statusServico_service)(id, user_id, ativo);
        return res.status(200).json(resposta);
    }
    catch (erro) {
        next(erro);
    }
}
async function buscar_servico_controller(req, res, next) {
    try {
        const { id } = req.params;
        const resposta = await (0, service_wanted_service_js_1.buscarServicoPorId_service)(id);
        return res.status(200).json(resposta);
    }
    catch (erro) {
        next(erro);
    }
}
async function listar_categorias_controller(req, res, next) {
    try {
        const resposta = await (0, service_wanted_service_js_1.listarCategorias_service)();
        res.setHeader("Cache-Control", "public, max-age=3600");
        return res.status(200).json(resposta);
    }
    catch (erro) {
        next(erro);
    }
}
