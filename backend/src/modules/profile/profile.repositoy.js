import { pool } from "../../config/database";

export async function Informacoes_profile(usuarioId) {
  const [usuarioInformations] = await pool.query(
    `
        SELECT u.id,u.nome,u.email,u.criado_em,
        COALESCE((SELECT AVG(rating) FROM reviews WHERE reviewed_id=u.id),0)AS media_rating,
        (SELECT COUNT(id) FROM reviews WHERE reviewed_id = u.id) AS total_reviews,
        (SELECT COUNT(id) FROM exchanges WHERE (user_a_id = u.id OR user_b_id = u.id)AND status = 'completed') AS trocas_concluidas
        FROM users u WHERE u.id = ?
    `,
    [usuarioId],
  );

  const usuario = usuarioInformations[0];
  if (!usuario) return null;
}
