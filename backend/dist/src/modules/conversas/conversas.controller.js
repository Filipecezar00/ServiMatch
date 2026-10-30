"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buscaMensagens_controller = buscaMensagens_controller;
exports.buscaConversas_controller = buscaConversas_controller;
exports.criarConversa_controller = criarConversa_controller;
const conversas_service_1 = require("../conversas/conversas.service");
async function buscaMensagens_controller(req, res, next) {
    try {
        const conversa_id = Number(req.params.conversa_id);
        const { page, limit } = req.query;
        const usuarioId = req.usuario?.id;
        const resposta = await (0, conversas_service_1.buscaMensagens_service)(Number(usuarioId), conversa_id, Number(page), Number(limit));
        return res.status(200).json(resposta);
    }
    catch (error) {
        next(error);
    }
}
async function buscaConversas_controller(req, res, next) {
    try {
        const usuarioId = req.usuario?.id;
        const resposta = await (0, conversas_service_1.buscaConversas_service)(Number(usuarioId));
        return res.status(200).json(resposta);
    }
    catch (error) {
        next(error);
    }
}
async function criarConversa_controller(req, res, next) {
    try {
        const proposer_id = req.usuario?.id;
        const { receiver_id, service_id } = req.body;
        const resposta = await (0, conversas_service_1.criarConversa_service)(Number(proposer_id), Number(receiver_id), service_id ? Number(service_id) : undefined);
        return res.status(201).json(resposta);
    }
    catch (error) {
        next(error);
    }
}
