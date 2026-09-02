import { pool } from "../../config/database.js";

export async function buscarServicoPorId(id) {
  const [resposta] = await pool.query(
    `
    SELECT * FROM services_wanted WHERE id = ?
    `,
    [id],
  );
  return resposta[0];
}

export async function buscarCategoriaPorId(categoryId) {
  const [resultado] = await pool.query(
    `
    SELECT id FROM categories WHERE id = ?
    `,
    [categoryId],
  );
  return resultado[0];
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

export async function listar_ativos() {
  const [resposta] = await pool.query(
    `SELECT s.id,s.titulo,s.descricao,c.nome AS categoria,
    u.nome AS prestador_nome FROM services_wanted s 
    LEFT JOIN categories c ON s.category_id = c.id
    INNER JOIN users u ON s.user_id = u.id 
    WHERE s.ativo = true
    `,
  );
  return resposta;
}

export async function listar_meusServicos(userId) {
  const [resposta] = await pool.query(
    `
    SELECT s.id,s.titulo,s.descricao,s.ativo, c.nome AS categoria
    FROM services_wanted s LEFT JOIN categories c ON s.category_id = c.id 
    WHERE s.user_id = ?    
    `,
    [userId],
  );
  return resposta;
}

export async function editar_servico_repository(
  id,
  titulo,
  descricao,
  categoryId,
) {
  const [resposta] = await pool.query(
    `UPDATE services_wanted SET titulo = ?, descricao = ?,
    category_id = ? WHERE id = ? 
    `,
    [titulo, descricao, categoryId, id],
  );
  return resposta;
}
