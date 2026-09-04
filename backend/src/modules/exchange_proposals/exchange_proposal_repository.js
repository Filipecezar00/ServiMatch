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

export async function buscar_offered_service(offered_service_id) {
  const [resposta] = await pool.query(
    `
    SELECT * FROM services_offered WHERE id = ?
 `,
    [offered_service_id],
  );
  return resposta[0];
}

export async function buscar_wanted_service(wanted_service_id) {
  const [resposta] = await pool.query(
    `
    SELECT * FROM services_offered WHERE id = ? 
    `,
    [wanted_service_id],
  );
  return resposta[0];
}

export async function verify_pending(offered_service_id, wanted_service_id) {
  const [resposta] = await pool.query(
    `
    SELECT * FROM exchange_proposals WHERE status = 'pending' AND (offered_service_id=? AND wanted_service_id = ?)
`,
    [offered_service_id, wanted_service_id],
  );
  return resposta[0];
}

export async function aceitar_servico(proposer_id, receiver_id) {
  const [resposta] = await pool.query(
    `
    UPDATE exchange_proposals SET status = 'accepted' WHERE proposer_id = ?, receiver_id = ?
    `,
    [proposer_id, receiver_id],
  );
  return resposta.insertId;
}

export async function rejeitar_servico(proposer_id, receiver_id) {
  const [resposta] = await pool.query(
    `
    UPDATE exchange_proposals SET status = 'rejected' WHERE proposer_id = ?, receiver_id = ?
    `,
    [proposer_id, receiver_id],
  );
  return resposta.insertId;
}

export async function buscar_servico(proposer_id) {
  const [resposta] = await pool.query(
    `SELECT * FROM exchange_proposals WHERE proposer_id = ?`,
    [proposer_id],
  );
  return resposta[0];
}
