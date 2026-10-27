import { pool } from "../../config/database.js";

export async function buscarCategoriaPorId(categoryId) {
  const [resultado] = await pool.query(
    `SELECT id FROM categories WHERE id = ?`,
    [categoryId],
  );
  return resultado[0];
}

export async function listarCategorias_repository() {
  const [resultado] = await pool.query(
    `SELECT id,nome FROM categories ORDER BY nome ASC`,
  );
  return resultado;
}

export async function salvar(userId, titulo, descricao, categoryId,imagensUrls=[]) {
  const conexao = await pool.getConnection(); 
  try{
    await conexao.beginTransaction(); 

  const imagemPrincipal = imagensUrls[0] ?? null
  const [resultado] = await conexao.query(
    `
    INSERT INTO services_offered (user_id,category_id,titulo,descricao,image_url)
    VALUES (?,?,?,?,?)`,
    [userId, categoryId, titulo, descricao,imagemPrincipal],
  );
  const serviceId = resultado.insertId; 

  for(let i = 0; i<imagensUrls.length; i++){
    await conexao.query(
      `INSERT INTO service_images (service_id,image_url,ordem) VALUES (?,?,?)`,
      [serviceId,imagensUrls[i],i+1],
    )
  }
  await conexao.commit(); 
  return { id: serviceId, userId, titulo, descricao, categoryId,imageUrl:imagemPrincipal, imagens: imagensUrls.map((imageUrl,index)=>({
    imageUrl,
    ordem:index +1,
  })),
}
  }catch(error){
    await conexao.rollback(); 
    throw error; 
  }finally{
    conexao.release(); 
  }
 

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
       SELECT * FROM services_offered WHERE id = ?
    `,
    [id],
  );

  return servico[0];
}

export async function buscaDetalhesServico(id) {
  const [servico] = await pool.query(
    `
    SELECT s.id, s.titulo, s.descricao,s.image_url, s.category_id, c.nome AS categoria, 
    s.user_id, u.nome AS prestador_nome FROM services_offered s LEFT JOIN categories c 
    ON s.category_id = c.id INNER JOIN users u ON s.user_id = u.id WHERE s.id = ? 
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

export async function alterarStatusServico(id, novoStatus) {
  const [resposta] = await pool.query(
    `
    UPDATE services_offered SET ativo = ? WHERE id = ?
    `,
    [novoStatus, id],
  );
  return resposta;
}

export async function filtro_listar_servicos_offered_repository(
  busca,
  categoryId,
) {
  const [resultado] = await pool.query(
    `
    SELECT id,titulo,descricao, category_id FROM services_offered
    WHERE (? IS NULL OR LOWER(titulo) LIKE LOWER(CONCAT('%',?,'%'))) AND
    (? IS NULL OR category_id=?);  
    `,
    [busca, busca, categoryId, categoryId],
  );
  return resultado;
}
