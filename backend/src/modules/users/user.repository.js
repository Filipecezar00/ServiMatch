import pool from "../../../index.js";

export async function buscarPorEmail(email) {
  const busca_email = await pool.query(`SELECT * FROM users WHERE email = ?`, [
    email,
  ]);
  const resultado = busca_email[0][0];

  return resultado;
}

export async function criar(dadosUsuario) {}
