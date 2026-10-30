"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Informacoes_profile = Informacoes_profile;
exports.EditarProfile = EditarProfile;
exports.AtualizarFotoPerfil = AtualizarFotoPerfil;
const database_js_1 = require("../../config/database.js");
async function Informacoes_profile(usuarioId) {
    const [usuarioInformations] = await database_js_1.pool.query(`
        SELECT u.id,u.nome,u.email,u.criado_em,u.image_url,
        COALESCE((SELECT AVG(rating) FROM reviews r WHERE reviewed_id=u.id),0)AS media_rating,
        (SELECT COUNT(id) FROM reviews WHERE reviewed_id = u.id) AS total_reviews,
        (SELECT COUNT(id) FROM exchange_proposals WHERE (proposer_id = u.id OR receiver_id = u.id)AND status = 'completed') AS trocas_concluidas
        FROM users u WHERE u.id = ?
    `, [usuarioId]);
    const usuario = usuarioInformations[0];
    if (!usuario)
        return null;
    const [servicos] = await database_js_1.pool.query(`
    SELECT id,titulo FROM services_offered WHERE user_id = ?
  `, [usuarioId]);
    const [reviews] = await database_js_1.pool.query(`
    SELECT r.id, r.rating, r.comment, r.created_at, u.nome as reviewer_nome
    FROM reviews r JOIN users u ON reviewer_id = u.id 
    WHERE r.reviewed_id = ? 
    ORDER BY r.created_at DESC
 `, [usuarioId]);
    return {
        usuario: {
            ...usuario,
            servicos,
        },
        reviews,
    };
}
async function EditarProfile(nome, email, usuarioId) {
    const [resposta] = await database_js_1.pool.query(`
    UPDATE users SET nome = COALESCE(?,nome),
    email = COALESCE(?,email) WHERE id = ?; 
  `, [nome, email, usuarioId]);
    return resposta.affectedRows;
}
async function AtualizarFotoPerfil(fotoPerfil, usuarioId) {
    const [resposta] = await database_js_1.pool.query(`
    UPDATE users SET image_url = ? WHERE id = ?
    `, [fotoPerfil, usuarioId]);
    return resposta.affectedRows;
}
