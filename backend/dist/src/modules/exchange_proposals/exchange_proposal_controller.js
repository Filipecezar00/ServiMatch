"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criar_controller = criar_controller;
exports.mudar_status_controller = mudar_status_controller;
exports.listaPropostasRecebidas_controller = listaPropostasRecebidas_controller;
exports.listaPropostasEnviadas_controller = listaPropostasEnviadas_controller;
const exchange_proposal_service_js_1 = require("./exchange_proposal_service.js");
async function criar_controller(req, res, next) {
    try {
        const { receiver_id, offered_service_id, wanted_service_id, mensagem } = req.body;
        const proposer_id = req.usuario.id;
        const resposta = await (0, exchange_proposal_service_js_1.criar_service)(proposer_id, receiver_id, offered_service_id, wanted_service_id, mensagem);
        return res.status(201).json({ resposta });
    }
    catch (erro) {
        next(erro);
    }
}
async function mudar_status_controller(req, res, next) {
    try {
        const id = req.params.id;
        const usuarioId = req.usuario.id;
        const { statusProposta } = req.body;
        const resposta = await (0, exchange_proposal_service_js_1.mudar_status)(id, usuarioId, statusProposta);
        res.status(200).json({ resposta });
    }
    catch (erro) {
        next(erro);
    }
}
async function listaPropostasRecebidas_controller(req, res, next) {
    try {
        const usuarioId = req.usuario.id;
        const resposta = await (0, exchange_proposal_service_js_1.listaPropostasRecebidas_service)(usuarioId);
        return res.status(200).json(resposta);
    }
    catch (error) {
        next(error);
    }
}
async function listaPropostasEnviadas_controller(req, res, next) {
    try {
        const usuarioId = req.usuario.id;
        const resposta = await (0, exchange_proposal_service_js_1.listarPropostasEnviadas_service)(usuarioId);
        return res.status(200).json(resposta);
    }
    catch (error) {
        next(error);
    }
}
