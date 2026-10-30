"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criar_review_service = criar_review_service;
exports.listar_reviews_service = listar_reviews_service;
const AppError_js_1 = __importDefault(require("../../utils/AppError.js"));
const reviews_repository_js_1 = require("./reviews.repository.js");
async function criar_review_service(exchangeId, reviewerId, reviewedId, rating, comment) {
    const dados_exchange = await (0, reviews_repository_js_1.buscar_dados_review_repository)(exchangeId, reviewerId);
    const buscando_review = await (0, reviews_repository_js_1.buscar_review_existente_repository)(exchangeId, reviewerId);
    if (buscando_review) {
        throw new AppError_js_1.default("Essa avaliação já foi realizada", 404);
    }
    if (!dados_exchange) {
        throw new AppError_js_1.default("Erro ao buscar dados dessa solicitação", 404);
    }
    if (dados_exchange.status !== "completed") {
        throw new AppError_js_1.default("Essa solicitação ainda não foi concluida", 409);
    }
    if (Number(reviewerId) === Number(dados_exchange.proposer_id)) {
        if (Number(reviewedId) !== Number(dados_exchange.receiver_id)) {
            throw new AppError_js_1.default("Esse processo não é válido", 409);
        }
    }
    if (Number(reviewerId) === Number(dados_exchange.receiver_id)) {
        if (Number(reviewedId) !== Number(dados_exchange.proposer_id)) {
            throw new AppError_js_1.default("Esse processo não é válido", 409);
        }
    }
    if (!rating) {
        throw new AppError_js_1.default("É necessário enviar uma nota", 400);
    }
    if (rating < 1 || rating > 5) {
        throw new AppError_js_1.default("A nota não está válida", 409);
    }
    if (comment !== null && comment !== undefined) {
        if (comment.trim().length > 200 ||
            comment.trim().length < 10 ||
            comment === "") {
            throw new AppError_js_1.default("O comentario deve ter entre 10 e 200 caracteres", 400);
        }
    }
    const resultado = await (0, reviews_repository_js_1.criar_review_repository)(exchangeId, reviewerId, reviewedId, rating, comment);
    return resultado;
}
async function listar_reviews_service(reviewedId) {
    if (!reviewedId) {
        throw new AppError_js_1.default("Usuário não localizado", 404);
    }
    const [reviews, media_reviewed] = await Promise.all([
        (0, reviews_repository_js_1.listar_review_repository)(reviewedId),
        (0, reviews_repository_js_1.buscar_media_repository)(reviewedId),
    ]);
    return { reviews, media: media_reviewed };
}
