"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSocket = authSocket;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authSocket(socket, next) {
    let token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error("Token não fornecido"));
    }
    if (token.startsWith("Bearer ")) {
        token = token.replace("Bearer ", "").trim();
    }
    try {
        const secret = process.env.TOKEN_JWT || "";
        const resultado = jsonwebtoken_1.default.verify(token, secret);
        socket.data.user = {
            id: resultado.id,
            email: resultado.email,
            nome: resultado.nome,
        };
        next();
    }
    catch (error) {
        return next(new Error("Token inválido ou expirado"));
    }
}
