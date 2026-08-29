import { pool } from "../../config/database.js";

export async function buscarCategoriaPorId(categoryId) {
  const [resultado] = await pool.query(
    `SELECT id FROM categories WHERE id = ?`,
    [categoryId],
  );
  return resultado[0];
}

export async function salvar(userId, titulo, descricao, categoryId) {
  const [resultado] = await pool.query(
    `
    INSERT INTO services_offered (user_id,category_id,titulo,descricao)
    values (?,?,?,?)`,
    [userId, categoryId, titulo, descricao],
  );
  return { id: resultado.insertId, userId, titulo, descricao, categoryId };
}
