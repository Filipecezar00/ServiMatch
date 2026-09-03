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
