"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criar_review_controller = criar_review_controller;
exports.listar_reviews_controller = listar_reviews_controller;
const reviews_service_js_1 = require("./reviews.service.js");
async function criar_review_controller(req, res, next) {
    try {
        const { reviewedId, rating, comment } = req.body;
        const { exchangeId } = req.params;
        const reviewerId = req.usuario.id;
        const resposta = await (0, reviews_service_js_1.criar_review_service)(exchangeId, reviewerId, reviewedId, rating, comment);
        return res.status(201).json(resposta);
    }
    catch (erro) {
        next(erro);
    }
}
async function listar_reviews_controller(req, res, next) {
    try {
        const { reviewedId } = req.params;
        const review = await (0, reviews_service_js_1.listar_reviews_service)(reviewedId);
        return res.status(200).json(review);
    }
    catch (erro) {
        next(erro);
    }
}
