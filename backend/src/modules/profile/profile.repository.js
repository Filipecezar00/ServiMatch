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

  const [servicos] = await pool.query(
    `
    SELECT id,nome FROM services_offered WHERE user_id = ?
  `,
    [usuarioId],
  );

  const [reviews] = await pool.query(
    `
    SELECT r.id, r.rating, r.comment, r.created_at, u.nome as reviewer_nome
    FROM reviews r JOIN users u ON reviewer_id = u.id 
    WHERE r.reviewed_id = ? 
    ORDER BY r.created_at DESC
 `,
    [usuarioId],
  );

  return {
    usuario: {
      ...usuario,
      servicos,
    },
    reviews,
  };
}

export async function EditarProfile(nome, email, usuarioId) {
  const [resposta] = await pool.query(
    `
    UPDATE users SET nome = COALESCE(?,nome),
    email = COALESCE(?,email) WHERE id = ?; 
  `,
    [nome, email, usuarioId],
  );
  return resposta.affectedRows;
}
