import { pool } from "../../config/database.js";

export async function buscarCategoriaPorId(categoryId) {
  const [resposta] = await pool.query(
    `
    SELECT id FROM categories WHERE id = ?
    `,
    [categoryId],
  );
  return resposta[0];
}

export async function salvar(user_id, titulo, descricao, categoryId) {
  const [resposta] = await pool.query(
    `
    INSERT INTO services_wanted (user_id,category_id,titulo,descricao)
    VALUES (?,?,?,?)
`,
    [user_id, categoryId, titulo, descricao],
  );
  return { id: resposta.insertId, user_id, titulo, descricao, categoryId };
}
