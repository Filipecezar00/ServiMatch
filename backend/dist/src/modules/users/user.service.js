"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cadastro = cadastro;
exports.autenticar = autenticar;
require("dotenv/config");
const AppError_js_1 = __importDefault(require("../../utils/AppError.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_repository_js_1 = require("./user.repository.js");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function cadastro(nome, email, senha) {
    if (!email || !senha || !nome) {
        throw new AppError_js_1.default("Dados obrigatorios ausentes", 400);
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const teste_email = regex.test(email);
    if (!teste_email) {
        throw new AppError_js_1.default("Formato Inválido", 400);
    }
    if (nome.trim().length < 3) {
        throw new AppError_js_1.default("Nome muito curto", 400);
    }
    if (senha.trim().length < 8) {
        throw new AppError_js_1.default("Senha muita curta", 400);
    }
    const resultado = await (0, user_repository_js_1.buscarPorEmail)(email);
    if (resultado) {
        throw new AppError_js_1.default("Usuário já cadastrado", 409);
    }
    const senha_hash = await bcrypt_1.default.hash(senha, 10);
    const id = await (0, user_repository_js_1.criar)(nome, email, senha_hash);
    const usuario = { id, nome, email };
    const token = jsonwebtoken_1.default.sign({ id: usuario.id }, process.env.TOKEN_JWT, {
        expiresIn: "1d",
    });
    return { usuario, token };
}
async function autenticar(email, senha) {
    if (!email || !senha) {
        throw new AppError_js_1.default("Credenciais Incompletas", 400);
    }
    const resposta = await (0, user_repository_js_1.buscarPorEmail)(email);
    if (!resposta) {
        throw new AppError_js_1.default("Email ou senha Incorretos", 401);
    }
    const validar_senha = await bcrypt_1.default.compare(senha, resposta.senha);
    if (!validar_senha) {
        throw new AppError_js_1.default("Email ou senha Incorretos", 401);
    }
    const id = resposta.id;
    const nome = resposta.nome;
    const payload = {
        id,
        nome,
        email,
    };
    const token_jwt = jsonwebtoken_1.default.sign(payload, process.env.TOKEN_JWT, {
        expiresIn: "1h",
    });
    return { token: token_jwt, usuario: { id, nome, email } };
}
