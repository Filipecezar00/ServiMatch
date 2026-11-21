import { pool } from "../../config/database.js";

export async function buscarPorEmail(email) {
  const busca_email = await pool.query(`SELECT * FROM users WHERE email = ?`, [
    email,
  ]);
  const resultado = busca_email[0][0];

  return resultado;
}

export async function criar(nome, email, senha) {
  const cadastro = await pool.query(
    `
    INSERT INTO users (nome,email,senha) VALUES (?,?,?)
    `,
    [nome, email, senha],
  );
  const resultado = cadastro[0].insertId;
  return resultado;
}

export async function buscarPorId(id){
const [resultado] = await pool.query(
  `SELECT id FROM users WHERE id = ?`,
  [id]
); 
return resultado[0] || null
}