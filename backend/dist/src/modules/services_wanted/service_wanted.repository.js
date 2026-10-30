"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buscarServicoPorId = buscarServicoPorId;
exports.buscarCategoriaPorId = buscarCategoriaPorId;
exports.salvar = salvar;
exports.listar_ativos = listar_ativos;
exports.listar_meusServicos = listar_meusServicos;
exports.editar_servico_repository = editar_servico_repository;
exports.editar_statusServico_repository = editar_statusServico_repository;
exports.listar_Categorias_repository = listar_Categorias_repository;
const database_js_1 = require("../../config/database.js");
async function buscarServicoPorId(id) {
    const [resposta] = await database_js_1.pool.query(`
    SELECT * FROM services_wanted WHERE id = ?
    `, [id]);
    return resposta[0];
}
async function buscarCategoriaPorId(categoryId) {
    const [resultado] = await database_js_1.pool.query(`
    SELECT id FROM categories WHERE id = ?
    `, [categoryId]);
    return resultado[0];
}
async function salvar(user_id, titulo, descricao, categoryId) {
    const [resposta] = await database_js_1.pool.query(`
    INSERT INTO services_wanted (user_id,category_id,titulo,descricao)
    VALUES (?,?,?,?)
`, [user_id, categoryId, titulo, descricao]);
    return { id: resposta.insertId, user_id, titulo, descricao, categoryId };
}
async function listar_ativos() {
    const [resposta] = await database_js_1.pool.query(`SELECT s.id,s.titulo,s.descricao,c.nome AS categoria,
    u.nome AS prestador_nome FROM services_wanted s 
    LEFT JOIN categories c ON s.category_id = c.id
    INNER JOIN users u ON s.user_id = u.id 
    WHERE s.ativo = true
    `);
    return resposta;
}
async function listar_meusServicos(userId) {
    const [resposta] = await database_js_1.pool.query(`
    SELECT s.id,s.titulo,s.descricao,s.ativo, c.nome AS categoria
    FROM services_wanted s LEFT JOIN categories c ON s.category_id = c.id 
    WHERE s.user_id = ?    
    `, [userId]);
    return resposta;
}
async function editar_servico_repository(id, titulo, descricao, categoryId) {
    const [resposta] = await database_js_1.pool.query(`UPDATE services_wanted SET titulo = ?, descricao = ?,
    category_id = ? WHERE id = ? 
    `, [titulo, descricao, categoryId, id]);
    return resposta;
}
async function editar_statusServico_repository(id, novoStatus) {
    const [resultado] = await database_js_1.pool.query(`
    UPDATE services_wanted SET ativo = ? WHERE id = ? 
`, [novoStatus, id]);
    return resultado;
}
async function listar_Categorias_repository() {
    const [resultado] = await database_js_1.pool.query(`SELECT id,nome FROM categories ORDER BY nome ASC`);
    return resultado;
}
