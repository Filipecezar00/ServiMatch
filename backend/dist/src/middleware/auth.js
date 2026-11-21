import "dotenv/config";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
export function authMiddleware(req, res, next) {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
        return next(new AppError("Usuário não autenticado", 401));
    }
    const secret = process.env.TOKEN_JWT;
    if (!secret) {
        return next(new AppError("Configuração de autenticação indisponivel", 500));
    }
    const partes = bearerToken.trim().split(/\s+/);
    if (partes.length !== 2 || partes[0].toLowerCase() !== "bearer" || !partes[1]) {
        return next(new AppError("Formato de token inválido", 401));
    }
    try {
        const token = jwt.verify(partes[1], secret);
        if (typeof token === "string" || !Number.isInteger(Number(token.id)) || Number(token.id) <= 0) {
            return next(new AppError("Token inválido ou expirado", 401));
        }
        req.usuario = token;
        return next();
    }
    catch (erro) {
        return next(new AppError("Token invalido ou expirado", 401));
    }
}
