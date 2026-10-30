"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listar_exchange_controller = listar_exchange_controller;
exports.update_exchange_controller = update_exchange_controller;
exports.completed_exchange_controller = completed_exchange_controller;
exports.canceled_exchange_controller = canceled_exchange_controller;
const exchanges_service_js_1 = require("./exchanges.service.js");
async function listar_exchange_controller(req, res, next) {
    try {
        const usuarioId = req.usuario.id;
        const resposta = await (0, exchanges_service_js_1.listar_exchanges_service)(usuarioId);
        return res.status(200).json(resposta);
    }
    catch (erro) {
        next(erro);
    }
}
async function update_exchange_controller(req, res, next) {
    try {
        const exchangeId = req.params.id;
        const { status, scheduled_date, location } = req.body;
        const usuarioId = req.usuario.id;
        const resposta = await (0, exchanges_service_js_1.update_exchange_service)(status, scheduled_date, location, exchangeId, usuarioId);
        return res.status(200).json(resposta);
    }
    catch (erro) {
        next(erro);
    }
}
async function completed_exchange_controller(req, res, next) {
    try {
        const usuarioId = req.usuario.id;
        const { id } = req.params;
        const resposta = await (0, exchanges_service_js_1.completed_exchange_service)(id, usuarioId);
        return res.status(200).json(resposta);
    }
    catch (erro) {
        next(erro);
    }
}
async function canceled_exchange_controller(req, res, next) {
    try {
        const { id } = req.params;
        const usuarioId = req.usuario.id;
        const resposta = await (0, exchanges_service_js_1.canceled_exchange_service)(id, usuarioId);
        return res.status(200).json(resposta);
    }
    catch (erro) {
        next(erro);
    }
}
