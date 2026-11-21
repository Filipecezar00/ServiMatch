import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../types/socket.js";

interface JWTPayload {
  id: number;
}
export function authSocket(
  socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  next: (err?: Error) => void,
) {
  let token = socket.handshake.auth.token;
  if (typeof token !== "string" || !token.trim()) {
    return next(new Error("Token não fornecido"));
  }
  token = token.trim(); 

  if (token.toLowerCase().startsWith("bearer ")) {
    token = token.slice(7).trim(); 
  }

  const secret = process.env.TOKEN_JWT;

  if(!secret){
    return next(new Error("Configuração de autenticação indisponivel")); 
  }

  try {
    const resultado = jwt.verify(token, secret) as JWTPayload;
    if(!Number.isInteger(resultado.id)||resultado.id<=0){
      return next(new Error("Token inválido ou expirado"));
    }
    socket.data.user = {
      id: resultado.id,
    };
    return next();
  } catch (error) {
    return next(new Error("Token inválido ou expirado"));
  }
}
