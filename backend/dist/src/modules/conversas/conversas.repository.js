import { pool } from "../../config/database";
export async function buscaUsuarioId(usuarioId, conversa_id) {
    const [resposta] = await pool.query(`
  SELECT * FROM conversas
  WHERE id = ? AND (proposer_id = ? OR receiver_id = ? )
  `, [conversa_id, usuarioId, usuarioId]);
    return resposta;
}
export async function inserirMensagem(conversa_id, usuarioId, mensagem) {
    const [resposta] = await pool.query(`
        INSERT INTO mensagens (conversa_id,sender_id,mensagem) VALUES (?,?,?)
    `, [conversa_id, usuarioId, mensagem]);
    return {
        id: resposta.insertId,
        conversa_id,
        sender_id: usuarioId,
        mensagem,
        lido: false,
        created_at: new Date()
    };
}
export async function buscaMensagens(conversa_id, limit, offset) {
    const [mensagensPromise, quantidade_mensagem] = await Promise.all([
        pool.query(`
  SELECT * FROM mensagens WHERE conversa_id  = ?
  ORDER BY created_at DESC
  LIMIT ? OFFSET ?
  `, [conversa_id, limit, offset]),
        pool.query(`
    SELECT COUNT(*) AS total
    FROM mensagens WHERE conversa_id = ? 
  `, [conversa_id])
    ]);
    const [mensagens] = mensagensPromise;
    const [totalRows] = quantidade_mensagem;
    return { mensagens: mensagens, total: totalRows[0].total };
}
export async function marcarLido({ mensagemId, conversaId, usuarioId }) {
    const [resposta] = await pool.query(`
    UPDATE mensagens SET lido = 1 WHERE id = ? AND conversa_id = ? AND sender_id <> ? AND lido = 0 
  `, [mensagemId, conversaId, usuarioId]);
    return resposta.affectedRows > 0;
}
export async function buscaConversas(usuarioId) {
    const respostas = await pool.query(`
    SELECT c.*,u.nome AS nome_outro_usuario FROM conversas c
    JOIN users u ON (
    (c.proposer_id = ? AND c.receiver_id = u.id) OR
    (c.receiver_id = ? AND c.proposer_id = u.id) 
  )
    WHERE c.proposer_id = ? OR c.receiver_id = ?
  `, [usuarioId, usuarioId, usuarioId, usuarioId]);
    return respostas[0];
}
export async function buscaService_id(service_id) {
    const [service] = await pool.query(`
   SELECT id FROM services_offered WHERE id = ?
  `, [service_id]);
    if (!service || service.length === 0) {
        return null;
    }
    return service[0];
}
export async function criarConversa(proposer_id, receiver_id, service_id) {
    let query = `
  SELECT id FROM conversas
  WHERE ((proposer_id = ? AND receiver_id = ?) OR (proposer_id = ? AND receiver_id = ?))
  `;
    const params = [proposer_id, receiver_id, receiver_id, proposer_id];
    if (service_id !== null && service_id !== undefined) {
        query += `AND service_id = ?`;
        params.push(service_id);
    }
    else {
        query += `AND service_id IS NULL`;
    }
    const [conversas] = await pool.query(query, params);
    if (conversas.length > 0) {
        return conversas[0];
    }
    const [resposta] = await pool.query(`
    INSERT INTO conversas (proposer_id,receiver_id,service_id) VALUES (?,?,?)
  `, [proposer_id, receiver_id, service_id || null]);
    return { id: resposta.insertId };
}
export async function buscarParticipantesConversa(conversa_id) {
    const [resposta] = await pool.query(`
    SELECT proposer_id,receiver_id FROM conversas
    WHERE id = ? 
    `, [conversa_id]);
    return resposta[0] || null;
}
