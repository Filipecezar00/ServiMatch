import { pool } from "../../config/database.js";

export async function criar(
  proposer_id,
  receiver_id,
  offered_service_id,
  wanted_service_id,
  mensagem,
) {
  const [resultado] = await pool.query(
    `
  INSERT INTO exchange_proposals 
  (proposer_id,receiver_id,offered_service_id,wanted_service_id,mensagem) VALUES(?,?,?,?,?)
  `,
    [proposer_id, receiver_id, offered_service_id, wanted_service_id, mensagem],
  );
  return resultado.insertId;
}

export async function buscar_offered_service(user_id) {
  const [resposta] = await pool.query(
    `
SELECT * FROM services_offered WHERE user_id = ?
 `,
    [user_id],
  );
  return resposta;
}

export async function buscar_wanted_service(user_id) {
  const [resposta] = await pool.query(
    `
    SELECT * FROM services_wanted WHERE user_id = ? 
    `,
    [user_id],
  );
  return resposta;
}
