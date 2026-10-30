"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarUsuario = criarUsuario;
exports.loginUsuario = loginUsuario;
const user_service_js_1 = require("./user.service.js");
async function criarUsuario(req, res) {
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;
    const usuario = await (0, user_service_js_1.cadastro)(nome, email, senha);
    return res.status(201).json(usuario);
}
async function loginUsuario(req, res) {
    const email = req.body.email;
    const senha = req.body.senha;
    const resultado = await (0, user_service_js_1.autenticar)(email, senha);
    return res.status(200).json(resultado);
}
