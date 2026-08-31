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
