import { pool } from "../../config/database";

export async function listar_exchanges(usuarioId) {
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
