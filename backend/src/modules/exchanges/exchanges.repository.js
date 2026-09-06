import { pool } from "../../config/database";

export async function listar_exchanges_repository(usuarioId) {
  const [resposta] = await pool.query(
    `
    SELECT e.*, ep.proposer_id, ep.receiver_id
    FROM exchanges e JOIN exchange_proposals ep ON e.proposal_id = ep.id
    WHERE ep.proposer_id = ? OR ep.receiver_id = ? 
    `,
    [usuarioId, usuarioId],
  );
  return resposta;
}

export async function buscar_dados_proposta_repository(exchangeId, usuarioId) {
  const [resultado] = await pool.query(
    `
    SELECT e.* , ep.proposer_id, ep.receiver_id FROM exchanges e 
    JOIN exchange_proposals ep ON e.proposal_id = ep.id 
    WHERE e.id = ? AND (ep.proposer_id = ? OR ep.receiver_id = ?)
    `,
    [exchangeId, usuarioId, usuarioId],
  );

  return resultado[0];
}

export async function update_exchange_repository(
  exchangeId,
  status,
  schedule_date,
  location,
  notes,
) {
  const [resposta] = await pool.query(
    `
    UPDATE exchanges
    SET status = COALESCE(?,status),
    schedule_date = COALESCE(?,schedule_date),
    location = COALESCE(?,location),
    notes = COALESCE(?,notes)
    WHERE id = ? 
`,
    [status, schedule_date, location, notes, exchangeId],
  );

  return resposta.affectedRows;
}

export async function completed_exchange_repository(id) {
  const [resposta] = await pool.query(
    `
        UPDATE exchanges set status = 'completed',
        completed_at = NOW() WHERE id = ?
    `,
    [id],
  );
  return resposta.affectedRows;
}

export async function buscar_status_exchange_repository(id, usuarioId) {
  const [resposta] = await pool.query(
    `
    SELECT e.id,e.status FROM
    exchanges e JOIN exchange_proposals ep ON e.proposal_id = ep.id
    WHERE e.id = ? AND ep.proposer_id = ?
    `,
    [id, usuarioId],
  );
  return resposta[0];
}
