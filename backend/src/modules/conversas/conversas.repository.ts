import { pool } from "../../config/database";

export async function buscaUsuarioId(usuarioId: number, conversa_id: number) {
  const resposta = pool.query(
    `
  SELECT * FROM conversas WHERE proposer_id = ? AND conversa_id = ?
  `,
    [usuarioId, conversa_id],
  );

  return resposta;
}
