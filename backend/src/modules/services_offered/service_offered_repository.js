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

export async function buscarTodosAtivos() {
  const [resultado] = await pool.query(`
        SELECT s.id,s.titulo,s.descricao,c.nome AS categoria,
        u.nome AS prestador_nome FROM services_offered s 
        LEFT JOIN categories c ON s.category_id = c.id
        INNER JOIN users u ON s.user_id = u.id 
        WHERE s.ativo = true
    `);
  return resultado;
}

export async function buscarMeusServicos(userId) {
  const [resultado] = await pool.query(
    `
    SELECT s.id,s.titulo,s.descricao,s.ativo, c.nome AS categoria
    FROM services_offered s LEFT JOIN categories c ON s.category_id = c.id
    WHERE s.user_id = ? 
    `,
    [userId],
  );
  return resultado;
}

export async function buscarServicoPorId(id) {
  const [servico] = await pool.query(
    `
       SELECT id,user_id,category_id FROM services_offered WHERE id = ?
    `,
    [id],
  );

  return servico[0];
}

export async function atualizar(id, titulo, descricao, categoryId) {
  const [resposta] = await pool.query(
    `
      UPDATE services_offered SET titulo = ?,
      descricao = ?, category_id = ? WHERE id = ?
    `,
    [titulo, descricao, categoryId, id],
  );
  return resposta;
}
