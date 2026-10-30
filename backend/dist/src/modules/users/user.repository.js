"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buscarPorEmail = buscarPorEmail;
exports.criar = criar;
const database_js_1 = require("../../config/database.js");
async function buscarPorEmail(email) {
    const busca_email = await database_js_1.pool.query(`SELECT * FROM users WHERE email = ?`, [
        email,
    ]);
    const resultado = busca_email[0][0];
    return resultado;
}
async function criar(nome, email, senha) {
    const cadastro = await database_js_1.pool.query(`
    INSERT INTO users (nome,email,senha) VALUES (?,?,?)
    `, [nome, email, senha]);
    const resultado = cadastro[0].insertId;
    return resultado;
}
