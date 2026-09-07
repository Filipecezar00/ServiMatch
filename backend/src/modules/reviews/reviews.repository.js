import { pool } from "../../config/database";

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
