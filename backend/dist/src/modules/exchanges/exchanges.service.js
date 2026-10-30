"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listar_exchanges_service = listar_exchanges_service;
exports.buscar_exchange_service = buscar_exchange_service;
exports.update_exchange_service = update_exchange_service;
exports.completed_exchange_service = completed_exchange_service;
exports.canceled_exchange_service = canceled_exchange_service;
const AppError_js_1 = __importDefault(require("../../utils/AppError.js"));
const exchanges_repository_js_1 = require("./exchanges.repository.js");
async function listar_exchanges_service(usuarioId) {
    if (!usuarioId) {
        throw new AppError_js_1.default("Usuário não autenticado", 401);
    }
    const resposta = await (0, exchanges_repository_js_1.listar_exchanges_repository)(usuarioId);
    return resposta;
}
async function buscar_exchange_service(exchangeId, usuarioId) {
    if (!exchangeId || !usuarioId) {
        throw new AppError_js_1.default("Não foi possivel atualizar essa troca", 403);
    }
    const resposta = await (0, exchanges_repository_js_1.buscar_dados_proposta_repository)(exchangeId, usuarioId);
    if (!resposta) {
        throw new AppError_js_1.default("Não foi possivel localizar dados dessa proposta", 404);
    }
    return resposta;
}
async function update_exchange_service(status, scheduled_date, location, exchangeId, usuarioId) {
    if (!usuarioId) {
        throw new AppError_js_1.default("Usuário invalido para executar essa ação", 400);
    }
    if (!exchangeId) {
        throw new AppError_js_1.default("Troca não localizada", 404);
    }
    const exchange_data = await (0, exchanges_repository_js_1.buscar_dados_proposta_repository)(exchangeId, usuarioId);
    if (!exchange_data) {
        throw new AppError_js_1.default("Troca não localizada", 404);
    }
    const transicoesPermitidas = {
        scheduled: ["in_progress", "cancelled"],
        in_progress: ["completed", "cancelled"],
    };
    if (status !== null && status !== undefined) {
        if (status !== "scheduled" &&
            status !== "in_progress" &&
            status !== "completed" &&
            status !== "cancelled") {
            throw new AppError_js_1.default("Esse status não é válido", 400);
        }
    }
    if (exchange_data.status === "completed" ||
        exchange_data.status === "cancelled") {
        throw new AppError_js_1.default("Essa solicitação já foi concluida ou cancelada", 409);
    }
    if (status && status !== exchange_data.status) {
        if (!transicoesPermitidas[exchange_data.status]?.includes(status)) {
            throw new AppError_js_1.default("Essa transição é inválida", 409);
        }
    }
    if (scheduled_date !== null && scheduled_date !== undefined) {
        const dataConvertida = new Date(scheduled_date);
        if (isNaN(dataConvertida.getTime())) {
            throw new AppError_js_1.default("Formato inválido de data", 400);
        }
        if (dataConvertida < new Date()) {
            throw new AppError_js_1.default("Data de agendamento inválida", 400);
        }
    }
    if (location !== null && location !== undefined) {
        if (!location) {
            throw new AppError_js_1.default("Localização inválida", 400);
        }
    }
    const resposta = await (0, exchanges_repository_js_1.update_exchange_repository)(exchangeId, status, scheduled_date, location);
    if (resposta === 0) {
        throw new AppError_js_1.default("Registro não encontrado em atualização", 404);
    }
    return resposta;
}
async function completed_exchange_service(id, usuarioId) {
    if (!id || !usuarioId) {
        throw new AppError_js_1.default("Ids necessários para a consulta não foram fornecidos.", 403);
    }
    const busca_status = await (0, exchanges_repository_js_1.buscar_status_exchange_repository)(id, usuarioId);
    if (!busca_status) {
        throw new AppError_js_1.default("Troca não localizada", 404);
    }
    if (busca_status.status !== "in_progress" &&
        busca_status.status !== "scheduled") {
        throw new AppError_js_1.default("Status inválido para realizar a conclusão", 409);
    }
    const resposta = await (0, exchanges_repository_js_1.completed_exchange_repository)(id);
    if (resposta === 0) {
        throw new AppError_js_1.default("Registro não encontrado para atualização", 404);
    }
    return resposta;
}
async function canceled_exchange_service(id, usuarioId) {
    const busca_status = await (0, exchanges_repository_js_1.buscar_status_exchange_repository)(id, usuarioId);
    if (!busca_status) {
        throw new AppError_js_1.default("Troca não localizada", 404);
    }
    if (busca_status.status === "completed") {
        throw new AppError_js_1.default("Não é possivel realizar o cancelamento dessa troca", 409);
    }
    if (busca_status.status === "cancelled") {
        throw new AppError_js_1.default("Essa troca já foi cancelada", 409);
    }
    const resposta = await (0, exchanges_repository_js_1.canceled_exchange_repository)(id);
    if (resposta === 0) {
        throw new AppError_js_1.default("Registro não encontrado para atualização", 404);
    }
    return resposta;
}
