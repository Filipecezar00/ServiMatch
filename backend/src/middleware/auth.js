import "dotenv/config";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const bearerToken = req.headers["authorization"];

  if (!bearerToken) {
    throw new AppError("Usuário não autenticado:", 401);
  }
  try {
    const string_token = bearerToken.split(" ");

    const token = jwt.verify(string_token[1], process.env.TOKEN_JWT);

    req.usuario = token;
    next();
  } catch (erro) {
    console.log("Erro ao executar middleware de autenticação:", erro);
    throw new AppError("Token inválido ou expirado", 401);
  }
}
