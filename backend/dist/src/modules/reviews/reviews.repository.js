"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criar_review_repository = criar_review_repository;
exports.buscar_dados_review_repository = buscar_dados_review_repository;
exports.buscar_review_existente_repository = buscar_review_existente_repository;
exports.listar_review_repository = listar_review_repository;
exports.buscar_media_repository = buscar_media_repository;
const database_js_1 = require("../../config/database.js");
async function criar_review_repository(exchangeId, reviewerId, reviewedId, rating, comment) {
    const [resultado] = await database_js_1.pool.query(`
        INSERT INTO reviews (exchange_id,reviewer_id,reviewed_id,rating,comment) values (?,?,?,?,?)
    `, [exchangeId, reviewerId, reviewedId, rating, comment]);
    return resultado.insertId;
}
async function buscar_dados_review_repository(exchangeId, usuarioId) {
    const [resultado] = await database_js_1.pool.query(`
    SELECT e.*,ep.proposer_id,ep.receiver_id FROM exchanges e 
    JOIN exchange_proposals ep ON e.proposal_id = ep.id 
    WHERE e.id = ? AND (ep.proposer_id = ? OR ep.receiver_id = ?)
`, [exchangeId, usuarioId, usuarioId]);
    return resultado[0];
}
async function buscar_review_existente_repository(exchangeId, reviewerId) {
    const [resultado] = await database_js_1.pool.query(`
    SELECT * FROM reviews WHERE exchange_id = ? AND reviewer_id = ?
    `, [exchangeId, reviewerId]);
    return resultado[0];
}
async function listar_review_repository(reviewedId) {
    const [resultado] = await database_js_1.pool.query(`
        SELECT r.*, u.id as reviewer_id_user, u.nome as reviewer_nome
        FROM reviews r
        JOIN users u ON r.reviewer_id = u.id WHERE
        r.reviewed_id = ? OR r.reviewer_id = ? 
    `, [reviewedId, reviewedId]);
    return resultado;
}
async function buscar_media_repository(reviewedId) {
    const [resultado] = await database_js_1.pool.query(`
        SELECT COALESCE(AVG(rating), 0) AS media_rating,
        count(*) AS total_reviews FROM reviews 
        WHERE reviewed_id = ? 
    `, [reviewedId]);
    return resultado[0];
}
