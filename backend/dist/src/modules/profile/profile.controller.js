"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Informacoes_profile_controller = Informacoes_profile_controller;
exports.EditarProfile_controller = EditarProfile_controller;
exports.EditarFoto_controller = EditarFoto_controller;
const profile_service_js_1 = require("../profile/profile.service.js");
async function Informacoes_profile_controller(req, res, next) {
    try {
        const usuarioId = req.params.id ? Number(req.params.id) : req.usuario.id;
        const resposta = await (0, profile_service_js_1.Informacoes_profile_service)(usuarioId);
        return res.status(200).json(resposta);
    }
    catch (error) {
        next(error);
    }
}
async function EditarProfile_controller(req, res, next) {
    try {
        const usuarioId = req.usuario.id;
        const { nome, email } = req.body;
        const resposta = await (0, profile_service_js_1.editarInformacoes)(nome, email, usuarioId);
        return res.status(200).json({ mensagem: "Perfil atualizado com sucesso!" });
    }
    catch (error) {
        next(error);
    }
}
async function EditarFoto_controller(req, res, next) {
    try {
        const usuarioId = req.usuario.id;
        const fotoPerfil = req.file?.buffer;
        await (0, profile_service_js_1.editarFoto)(fotoPerfil, usuarioId);
        return res.status(200).json({ mensagem: "Foto de perfil atualizada com sucesso!" });
    }
    catch (error) {
        next(error);
    }
}
