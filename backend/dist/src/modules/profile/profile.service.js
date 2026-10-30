"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Informacoes_profile_service = Informacoes_profile_service;
exports.editarInformacoes = editarInformacoes;
exports.editarFoto = editarFoto;
const AppError_js_1 = __importDefault(require("../../utils/AppError.js"));
const profile_repository_js_1 = require("./profile.repository.js");
const upload_service_js_1 = require("../../utils/upload.service.js");
async function Informacoes_profile_service(usuarioId) {
    if (!usuarioId) {
        throw new AppError_js_1.default("Id do usuário é obrigatório", 400);
    }
    const perfil = await (0, profile_repository_js_1.Informacoes_profile)(usuarioId);
    if (!perfil || !perfil.usuario) {
        throw new AppError_js_1.default("Usuário não encontrado", 404);
    }
    return perfil;
}
async function editarInformacoes(nome, email, usuarioId) {
    if (!usuarioId) {
        throw new AppError_js_1.default("Id do usuário é obrigatório", 400);
    }
    if (!nome && !email) {
        throw new AppError_js_1.default("Informe ao menos um campo para atualizar", 400);
    }
    if (nome) {
        if (nome.trim().length < 3) {
            throw new AppError_js_1.default("Digite um nome válido");
        }
    }
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            throw new AppError_js_1.default("O email deve conter no mínimo 10 caracteres", 400);
        }
    }
    const resposta = await (0, profile_repository_js_1.EditarProfile)(nome, email, usuarioId);
    if (resposta === 0) {
        throw new AppError_js_1.default("Usuário não encontrado ou alteração não realizada", 404);
    }
    return resposta;
}
async function editarFoto(fotoPerfil, usuarioId) {
    if (!usuarioId) {
        throw new AppError_js_1.default("Id do usuário é obrigatório", 400);
    }
    if (!fotoPerfil) {
        throw new AppError_js_1.default("Uma imagem é obrigatória", 400);
    }
    const imagem = await (0, upload_service_js_1.enviarImagemCloudinary)(fotoPerfil);
    const imagem_url = imagem.imageUrl;
    const resposta = await (0, profile_repository_js_1.AtualizarFotoPerfil)(imagem_url, usuarioId);
    if (resposta === 0 || !resposta) {
        throw new AppError_js_1.default("Erro ao realizar atualização de perfil", 500);
    }
    return resposta;
}
