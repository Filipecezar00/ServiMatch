import { pool } from "../../config/database";

export async function buscaUsuarioId(usuarioId: number, conversa_id: number) {
  const [resposta]:any = await pool.query(
    `
  SELECT * FROM conversas
  WHERE id = ? AND (proposer_id = ? OR receiver_id = ? )
  `,
    [conversa_id,usuarioId,usuarioId],
  );

  return resposta;
}

