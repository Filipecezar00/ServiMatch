"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adicionarConexao = adicionarConexao;
exports.removerConexao = removerConexao;
exports.usuarioEstaOnline = usuarioEstaOnline;
const usuariosOnline = new Map();
function adicionarConexao(usuarioId, socketId) {
    if (!usuariosOnline.has(usuarioId)) {
        usuariosOnline.set(usuarioId, new Set());
    }
    usuariosOnline.get(usuarioId).add(socketId);
}
function removerConexao(usuarioId, socketId) {
    const conexoes = usuariosOnline.get(usuarioId);
    if (!conexoes) {
        return;
    }
    conexoes.delete(socketId);
    if (conexoes.size === 0) {
        usuariosOnline.delete(usuarioId);
    }
}
function usuarioEstaOnline(usuarioId) {
    return usuariosOnline.has(usuarioId);
}
