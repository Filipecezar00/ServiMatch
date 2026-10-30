"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buscaUsuarioId_service = buscaUsuarioId_service;
exports.inserirMensagem_service = inserirMensagem_service;
exports.buscaMensagens_service = buscaMensagens_service;
exports.buscaConversas_service = buscaConversas_service;
exports.marcaComoLida_service = marcaComoLida_service;
exports.criarConversa_service = criarConversa_service;
const AppError_1 = __importDefault(require("../../utils/AppError"));
const conversas_repository_1 = require("../conversas/conversas.repository");
async function buscaUsuarioId_service(usuarioId, conversa_id) {
    if (!usuarioId) {
        throw new AppError_1.default("Usuário não localizado", 404);
    }
    if (!conversa_id) {
        throw new AppError_1.default("Conversa não localizada", 404);
    }
    const conversas = await (0, conversas_repository_1.buscaUsuarioId)(usuarioId, conversa_id);
    if (!conversas || conversas.length === 0) {
        throw new AppError_1.default("Conversa não encontrada ou usuário sem acesso", 403);
    }
    return true;
}
async function inserirMensagem_service(conversa_id, usuarioId, mensagem) {
    if (!conversa_id) {
        throw new AppError_1.default("Conversa não localizada", 404);
    }
    if (!usuarioId) {
        throw new AppError_1.default("Usuário não localizado", 404);
    }
    if (!mensagem || mensagem.trim() === "") {
        throw new AppError_1.default("Envie uma mensagem", 400);
    }
    if (mensagem.length > 1000) {
        throw new AppError_1.default("A mensagem é muito longa. O limite é de 1000 caracteres.", 400);
    }
    await buscaUsuarioId_service(usuarioId, conversa_id);
    const resposta = await (0, conversas_repository_1.inserirMensagem)(conversa_id, usuarioId, mensagem);
    return resposta;
}
async function buscaMensagens_service(usuarioId, conversa_id, page, limit) {
    await buscaUsuarioId_service(usuarioId, conversa_id);
    let page_number = Number(page) || 1;
    let limit_number = Number(limit) || 20;
    if (page_number < 1) {
        page_number = 1;
    }
    if (limit_number < 1) {
        limit_number = 20;
    }
    let offset = Number((page_number - 1) * limit_number) || 0;
    const mensagens = await (0, conversas_repository_1.buscaMensagens)(conversa_id, limit_number, offset);
    const totalPages = Math.ceil(mensagens.total / limit_number);
    return ({
        page: page_number,
        limit: limit_number,
        total: mensagens.total,
        totalPages,
        data: mensagens.mensagens
    });
}
async function buscaConversas_service(usuarioId) {
    if (!usuarioId) {
        throw new AppError_1.default("Usuário não localizado", 404);
    }
    const conversas = await (0, conversas_repository_1.buscaConversas)(usuarioId);
    return conversas;
}
async function marcaComoLida_service({ mensagemId, conversaId, usuarioId }) {
    if (!Number.isInteger(conversaId) || conversaId <= 0) {
        throw new AppError_1.default("Conversa inválida.", 400);
    }
    if (!Number.isInteger(mensagemId) || mensagemId <= 0) {
        throw new AppError_1.default("Mensagem inválida", 400);
    }
    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
        throw new AppError_1.default("Usuário não autenticado", 400);
    }
    const participa = await (0, conversas_repository_1.buscaUsuarioId)(usuarioId, conversaId);
    if (!participa) {
        throw new AppError_1.default("Você não tem permissão para acessar essa conversa.", 403);
    }
    const atualizada = await (0, conversas_repository_1.marcarLido)({ mensagemId, conversaId, usuarioId });
    if (!atualizada) {
        return null;
    }
    return {
        conversaId,
        mensagemId,
        leitorId: usuarioId
    };
}
async function criarConversa_service(proposer_id, receiver_id, service_id) {
    if (!proposer_id) {
        throw new AppError_1.default("Usuário não localizado", 404);
    }
    if (!receiver_id) {
        throw new AppError_1.default("Usuário não localizado", 404);
    }
    if (service_id != null) {
        const servicoExistente = await (0, conversas_repository_1.buscaService_id)(service_id);
        if (!servicoExistente) {
            throw new AppError_1.default("Serviço não localizado", 404);
        }
    }
    const conversas = await (0, conversas_repository_1.criarConversa)(proposer_id, receiver_id, service_id !== undefined && service_id !== null ? Number(service_id) : null);
    return conversas;
}
