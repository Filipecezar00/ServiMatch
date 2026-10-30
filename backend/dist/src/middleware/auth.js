"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
require("dotenv/config");
const AppError_js_1 = __importDefault(require("../utils/AppError.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const bearerToken = req.headers["authorization"];
    if (!bearerToken) {
        throw new AppError_js_1.default("Usuário não autenticado", 401);
    }
    try {
        const string_token = bearerToken.split(" ");
        const token = jsonwebtoken_1.default.verify(string_token[1], process.env.TOKEN_JWT);
        req.usuario = token;
        next();
    }
    catch (erro) {
        console.log("Erro ao executar middleware de autenticação:", erro);
        throw new AppError_js_1.default("Token inválido ou expirado", 401);
    }
}
