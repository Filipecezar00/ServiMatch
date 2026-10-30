"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criar_controller = criar_controller;
exports.listarAtivos_controller = listarAtivos_controller;
exports.listarServicosUsuario_controller = listarServicosUsuario_controller;
exports.editarServico_controller = editarServico_controller;
exports.alterarStatusServico_controller = alterarStatusServico_controller;
exports.listarCategorias_controller = listarCategorias_controller;
exports.buscarServicoPorId_controller = buscarServicoPorId_controller;
exports.buscarDetalhesServico_controller = buscarDetalhesServico_controller;
exports.filtro_listar_servicos_offered_controller = filtro_listar_servicos_offered_controller;
const service_offered_service_js_1 = require("./service_offered_service.js");
async function criar_controller(req, res, next) {
    try {
        const { titulo, descricao, categoryId } = req.body;
        const userId = req.usuario.id;
        const imagens = (req.files ?? []).map((arquivo) => arquivo.buffer);
        const criar_service_value = await (0, service_offered_service_js_1.criar_service)(userId, titulo, descricao, categoryId, imagens);
        return res.status(201).json(criar_service_value);
    }
    catch (erro) {
        next(erro);
    }
}
async function listarAtivos_controller(req, res, next) {
    try {
        let servicos = await (0, service_offered_service_js_1.listarServicosAtivos_service)();
        return res.status(200).json(servicos);
    }
    catch (erro) {
        next(erro);
    }
}
async function listarServicosUsuario_controller(req, res, next) {
    try {
        const usuarioId = req.usuario.id;
        const servicos = await (0, service_offered_service_js_1.listarServicosUsuario_service)(usuarioId);
        return res.status(200).json(servicos);
    }
    catch (erro) {
        next(erro);
    }
}
async function editarServico_controller(req, res, next) {
    try {
        const { id } = req.params;
        const { titulo, descricao, categoryId } = req.body;
        const usuarioId = req.usuario.id;
        const resultado = await (0, service_offered_service_js_1.editarServico_service)(id, usuarioId, titulo, descricao, categoryId);
        return res.status(200).json(resultado);
    }
    catch (erro) {
        next(erro);
    }
}
async function alterarStatusServico_controller(req, res, next) {
    try {
        const { id } = req.params;
        const { ativo } = req.body;
        const userId = req.usuario.id;
        const resposta = await (0, service_offered_service_js_1.alterarStatusServico_service)(id, userId, ativo);
        return res.status(200).json(resposta);
    }
    catch (erro) {
        next(erro);
    }
}
async function listarCategorias_controller(req, res, next) {
    try {
        const resposta = await (0, service_offered_service_js_1.listarCategorias_service)();
        res.setHeader("Cache-Control", "public, max-age=3600");
        return res.status(200).json(resposta);
    }
    catch (erro) {
        next(erro);
    }
}
async function buscarServicoPorId_controller(req, res, next) {
    const { id } = req.params;
    try {
        const resposta = await (0, service_offered_service_js_1.buscarServicoPorId_service)(id);
        return res.status(200).json(resposta);
    }
    catch (erro) {
        next(erro);
    }
}
async function buscarDetalhesServico_controller(req, res, next) {
    const { id } = req.params;
    try {
        const resposta = await (0, service_offered_service_js_1.buscarDetalhesServico)(id);
        console.log(resposta);
        return res.status(200).json(resposta);
    }
    catch (error) {
        next(error);
    }
}
async function filtro_listar_servicos_offered_controller(req, res, next) {
    try {
        const { busca, categoryId } = req.query;
        const resposta = await (0, service_offered_service_js_1.filtro_listar_servicos_offered_service)(busca, categoryId);
        return res.status(200).json(resposta);
    }
    catch (erro) {
        next(erro);
    }
}
