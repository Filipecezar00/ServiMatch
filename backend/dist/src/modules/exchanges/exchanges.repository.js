"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listar_exchanges_repository = listar_exchanges_repository;
exports.buscar_dados_proposta_repository = buscar_dados_proposta_repository;
exports.update_exchange_repository = update_exchange_repository;
exports.completed_exchange_repository = completed_exchange_repository;
exports.canceled_exchange_repository = canceled_exchange_repository;
exports.buscar_status_exchange_repository = buscar_status_exchange_repository;
const database_js_1 = require("../../config/database.js");
async function listar_exchanges_repository(usuarioId) {
    const [resposta] = await database_js_1.pool.query(`
     SELECT e.*, ep.proposer_id, ep.receiver_id,
     CASE 
     WHEN ep.proposer_id = ? THEN so.titulo 
     ELSE sw.titulo 
     END AS servico_oferecido_titulo,CASE WHEN ep.proposer_id = ? THEN sw.titulo ELSE so.titulo
     END AS servico_desejado_titulo,CASE 
     WHEN ep.proposer_id = ? THEN u_receiver.nome
     ELSE u_proposer.nome
     END AS outro_usuario_nome 
     FROM exchanges e
     JOIN exchange_proposals ep ON e.proposal_id = ep.id
     JOIN users u_proposer ON ep.proposer_id = u_proposer.id
     JOIN users u_receiver ON ep.receiver_id = u_receiver.id
     JOIN services_offered so ON ep.offered_service_id = so.id
     JOIN services_wanted sw ON ep.wanted_service_id = sw.id
     WHERE ep.proposer_id = ? OR ep.receiver_id = ?
    `, [usuarioId, usuarioId, usuarioId, usuarioId, usuarioId]);
    return resposta;
}
async function buscar_dados_proposta_repository(exchangeId, usuarioId) {
    const [resultado] = await database_js_1.pool.query(`
    SELECT e.* , ep.proposer_id, ep.receiver_id FROM exchanges e 
    JOIN exchange_proposals ep ON e.proposal_id = ep.id 
    WHERE e.id = ? AND (ep.proposer_id = ? OR ep.receiver_id = ?)
    `, [exchangeId, usuarioId, usuarioId]);
    return resultado[0];
}
async function update_exchange_repository(exchangeId, status, scheduled_date, location) {
    const [resposta] = await database_js_1.pool.query(`
    UPDATE exchanges
    SET status = COALESCE(?,status),
    scheduled_date = COALESCE(?,scheduled_date),
    location = COALESCE(?,location)
    WHERE id = ? 
`, [status, scheduled_date, location, exchangeId]);
    return resposta.affectedRows;
}
async function completed_exchange_repository(id) {
    const [resposta] = await database_js_1.pool.query(`
        UPDATE exchanges set status = 'completed',
        completed_at = NOW() WHERE id = ?
    `, [id]);
    return resposta.affectedRows;
}
async function canceled_exchange_repository(id) {
    const [resposta] = await database_js_1.pool.query(`
        UPDATE exchanges set status = 'cancelled' WHERE id = ?
    `, [id]);
    return resposta.affectedRows;
}
async function buscar_status_exchange_repository(id, usuarioId) {
    const [resposta] = await database_js_1.pool.query(`
    SELECT e.id,e.status
    FROM exchanges e
    JOIN exchange_proposals ep ON e.proposal_id = ep.id
    WHERE e.id = ? AND (ep.proposer_id = ? OR ep.receiver_id = ?) 
    `, [id, usuarioId, usuarioId]);
    return resposta[0];
}
