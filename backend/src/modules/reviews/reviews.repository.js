import { pool } from "../../config/database.js";

export async function criar_review_repository(
  exchangeId,
  reviewerId,
  reviewedId,
  rating,
  comment,
) {
  const [resultado] = await pool.query(
    `
        INSERT INTO reviews (exchange_id,reviewer_id,reviewed_id,rating,comment) values (?,?,?,?,?)
    `,
    [exchangeId, reviewerId, reviewedId, rating, comment],
  );
  return resultado.insertId;
}

export async function buscar_dados_review_repository(exchangeId, usuarioId) {
  const [resultado] = await pool.query(
    `
    SELECT e.*,ep.proposer_id,ep.receiver_id FROM exchanges e 
    JOIN exchange_proposals ep ON e.proposal_id = ep.id 
    WHERE e.id = ? AND (ep.proposer_id = ? OR ep.receiver_id = ?)
`,
    [exchangeId, usuarioId, usuarioId],
  );
  return resultado[0];
}

export async function listar_review_repository(reviewedId) {
  const [resultado] = await pool.query(
    `
        SELECT r.*, u.id, u.nome FROM reviews r
        JOIN users u ON r.reviewer_id = u.id WHERE
        r.reviewed_id = ?
    `,
    [reviewedId],
  );
  return resultado;
}
