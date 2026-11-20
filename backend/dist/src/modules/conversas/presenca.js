const usuariosOnline = new Map();
export function adicionarConexao(usuarioId, socketId) {
    if (!usuariosOnline.has(usuarioId)) {
        usuariosOnline.set(usuarioId, new Set());
    }
    usuariosOnline.get(usuarioId).add(socketId);
}
export function removerConexao(usuarioId, socketId) {
    const conexoes = usuariosOnline.get(usuarioId);
    if (!conexoes) {
        return;
    }
    conexoes.delete(socketId);
    if (conexoes.size === 0) {
        usuariosOnline.delete(usuarioId);
    }
}
export function usuarioEstaOnline(usuarioId) {
    return usuariosOnline.has(usuarioId);
}
