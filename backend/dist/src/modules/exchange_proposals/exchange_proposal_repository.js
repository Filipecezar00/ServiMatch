"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criar = criar;
exports.buscar_offered_service = buscar_offered_service;
exports.buscar_wanted_service = buscar_wanted_service;
exports.verify_pending = verify_pending;
exports.alterar_status_repository = alterar_status_repository;
exports.buscar_proposta_porId = buscar_proposta_porId;
exports.exchange_criar = exchange_criar;
exports.listarPropostasEnviadas_repository = listarPropostasEnviadas_repository;
exports.listaPropostasRecebidas_repository = listaPropostasRecebidas_repository;
exports.buscar_dados_notificacao = buscar_dados_notificacao;
const database_js_1 = require("../../config/database.js");
async function criar(proposer_id, receiver_id, offered_service_id, wanted_service_id, mensagem) {
    const [resultado] = await database_js_1.pool.query(`
  INSERT INTO exchange_proposals 
  (proposer_id,receiver_id,offered_service_id,wanted_service_id,mensagem) VALUES(?,?,?,?,?)
  `, [proposer_id, receiver_id, offered_service_id, wanted_service_id, mensagem]);
    return resultado.insertId;
}
async function buscar_offered_service(offered_service_id) {
    const [resposta] = await database_js_1.pool.query(`
    SELECT * FROM services_offered WHERE id = ?
 `, [offered_service_id]);
    return resposta[0];
}
async function buscar_wanted_service(wanted_service_id) {
    const [resposta] = await database_js_1.pool.query(`
    SELECT * FROM services_offered WHERE id = ? 
    `, [wanted_service_id]);
    return resposta[0];
}
async function verify_pending(offered_service_id, wanted_service_id) {
    const [resposta] = await database_js_1.pool.query(`
    SELECT * FROM exchange_proposals WHERE status = 'pending' AND (offered_service_id=? AND wanted_service_id = ?)
`, [offered_service_id, wanted_service_id]);
    return resposta[0];
}
async function alterar_status_repository(id, status, connection = database_js_1.pool) {
    const [resposta] = await connection.query(`
    UPDATE exchange_proposals SET status = ? WHERE id = ?
    `, [status, id]);
    return resposta.affectedRows;
}
async function buscar_proposta_porId(id) {
    const [resposta] = await database_js_1.pool.query(`SELECT * FROM exchange_proposals WHERE id = ?`, [id]);
    return resposta[0];
}
async function exchange_criar(id, connection = database_js_1.pool) {
    const [resposta] = await connection.query(`INSERT INTO exchanges (proposal_id) VALUES(?)`, [id]);
    return resposta;
}
async function listarPropostasEnviadas_repository(usuarioId) {
    const [resposta] = await database_js_1.pool.query(`
    SELECT ep.id, ep.status, ep.mensagem,
    ep.created_at, ep.receiver_id, 
    u.nome AS outro_usuario_nome, 
    so.titulo AS servico_oferecido_titulo, 
    sw.titulo AS servico_desejado_titulo 
    FROM exchange_proposals ep 
    JOIN users u ON ep.receiver_id = u.id 
    JOIN services_offered so ON ep.offered_service_id = so.id 
    JOIN services_offered sw ON ep.wanted_service_id = sw.id
    WHERE ep.proposer_id = ? 
    ORDER BY ep.created_at DESC
  `, [usuarioId]);
    return resposta;
}
async function listaPropostasRecebidas_repository(usuarioId) {
    const [resposta] = await database_js_1.pool.query(`
  SELECT ep.id,ep.status, ep.mensagem,
  ep.created_at, ep.proposer_id, 
  u.nome AS outro_usuario_nome, 
  so.titulo AS servico_oferecido_titulo, 
  sw.titulo AS servico_desejado_titulo 
  FROM exchange_proposals ep 
  JOIN users u ON ep.proposer_id = u.id 
  JOIN services_offered so ON ep.offered_service_id = so.id
  JOIN services_offered sw ON ep.wanted_service_id = sw.id
  WHERE ep.receiver_id = ?
  ORDER BY CASE WHEN ep.status = 'pending' THEN 1 ELSE 2 END, 
  ep.created_at DESC  
  `, [usuarioId]);
    return resposta;
}
async function buscar_dados_notificacao(proposalId) {
    const [resposta] = await database_js_1.pool.query(`
  SELECT ep.id AS proposal_id,
  ep.mensagem,
  ep.status,
  ep.created_at, 
  remetente.id AS proposer_id,
  remetente.nome AS proposer_nome, 
  destinatario.id AS receiver_id,
  destinatario.nome AS receiver_nome, 
  destinatario.email AS receiver_email,
  servico_oferecido.titulo AS offered_service,
  servico_solicitado.titulo AS wanted_service
  FROM exchange_proposals ep
  INNER JOIN users remetente ON ep.proposer_id = remetente.id
  INNER JOIN users destinatario ON ep.receiver_id = destinatario.id
  INNER JOIN services_offered servico_oferecido ON ep.offered_service_id = servico_oferecido.id
  INNER JOIN services_offered servico_solicitado ON ep.wanted_service_id = servico_solicitado.id
  WHERE ep.id = ?
  `, [proposalId]);
    return resposta[0] ?? null;
}
