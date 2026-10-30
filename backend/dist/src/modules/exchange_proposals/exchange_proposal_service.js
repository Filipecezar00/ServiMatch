"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criar_service = criar_service;
exports.mudar_status = mudar_status;
exports.listarPropostasEnviadas_service = listarPropostasEnviadas_service;
exports.listaPropostasRecebidas_service = listaPropostasRecebidas_service;
const AppError_js_1 = __importDefault(require("../../utils/AppError.js"));
const exchange_proposal_repository_js_1 = require("./exchange_proposal_repository.js");
const database_js_1 = require("../../config/database.js");
async function criar_service(proposer_id, receiver_id, offered_service_id, wanted_service_id, mensagem) {
    if (Number(proposer_id) === Number(receiver_id)) {
        throw new AppError_js_1.default("Você não pode enviar uma proposta para você mesmo", 403);
    }
    if (mensagem !== null && mensagem !== undefined) {
        if (mensagem.trim().length == 0 || mensagem.trim().length > 200) {
            throw new AppError_js_1.default("Mensagem inválida ou excede o limite de caracteres", 400);
        }
    }
    const busca_offered = await (0, exchange_proposal_repository_js_1.buscar_offered_service)(offered_service_id);
    const busca_wanted = await (0, exchange_proposal_repository_js_1.buscar_wanted_service)(wanted_service_id);
    if (!busca_offered || !busca_wanted) {
        throw new AppError_js_1.default("Um dos serviços selecionados não existe", 404);
    }
    if (Number(busca_offered.user_id) !== Number(proposer_id)) {
        throw new AppError_js_1.default("O serviço oferecido não pertence ao proponente", 409);
    }
    if (Number(busca_wanted.user_id) !== Number(receiver_id)) {
        throw new AppError_js_1.default("O serviço desejado não pertence ao destinatário", 409);
    }
    const offered_pending = await (0, exchange_proposal_repository_js_1.verify_pending)(offered_service_id, wanted_service_id);
    if (offered_pending) {
        throw new AppError_js_1.default("Já existe uma proposta pendente para esses serviços", 409);
    }
    const idCriado = await (0, exchange_proposal_repository_js_1.criar)(proposer_id, receiver_id, offered_service_id, wanted_service_id, mensagem);
    return {
        id: idCriado,
        proposer_id,
        receiver_id,
        offered_service_id,
        wanted_service_id,
        mensagem,
        status: "pending",
    };
}
async function mudar_status(id, usuarioId, statusProposta) {
    const proposal = await (0, exchange_proposal_repository_js_1.buscar_proposta_porId)(id);
    if (!proposal) {
        throw new AppError_js_1.default("Não foi possivel localizar essa proposta", 404);
    }
    if (Number(proposal.receiver_id) !== Number(usuarioId)) {
        throw new AppError_js_1.default("Você não pode alterar essa proposta", 403);
    }
    if (statusProposta !== "accepted" && statusProposta !== "rejected") {
        throw new AppError_js_1.default("Esse status não é válido", 403);
    }
    if (proposal.status !== "pending") {
        throw new AppError_js_1.default("Essa proposta já foi aceita ou recusada", 409);
    }
    let connection;
    try {
        connection = await database_js_1.pool.getConnection();
        await connection.beginTransaction();
        const retorno_banco = await (0, exchange_proposal_repository_js_1.alterar_status_repository)(id, statusProposta, connection);
        if (retorno_banco === 0) {
            throw new AppError_js_1.default("O banco não respondeu essa consulta", 404);
        }
        if (statusProposta === "accepted") {
            await (0, exchange_proposal_repository_js_1.exchange_criar)(proposal.id, connection);
        }
        await connection.commit();
    }
    catch (error) {
        console.log("Erro na transação:", error);
        if (connection) {
            await connection.rollback();
        }
        throw new AppError_js_1.default("Erro ao atualizar o status da proposta", 500);
    }
    finally {
        if (connection) {
            connection.release();
        }
    }
    return { id, statusProposta };
}
async function listarPropostasEnviadas_service(usuarioId) {
    if (!usuarioId) {
        throw new AppError_js_1.default("Nenhum usuário está vinculado a essa proposta!");
    }
    const resposta = await (0, exchange_proposal_repository_js_1.listarPropostasEnviadas_repository)(usuarioId);
    return resposta;
}
async function listaPropostasRecebidas_service(usuarioId) {
    if (!usuarioId) {
        throw new AppError_js_1.default("Nenhum usuário está vinculado a essa proposta!");
    }
    const resposta = await (0, exchange_proposal_repository_js_1.listaPropostasRecebidas_repository)(usuarioId);
    return resposta;
}
