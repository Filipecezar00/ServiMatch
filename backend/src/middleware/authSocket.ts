import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../types/socket";

interface JWTPayload {
  id: number;
  email: string;
  nome: string;
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
  if (!token) {
    return next(new Error("Token não fornecido"));
  }
  if (token.startsWith("Bearer ")) {
    token = token.replace("Bearer ", "").trim();
  }

  try {
    const secret = process.env.TOKEN_JWT || "";
    const resultado = jwt.verify(token, secret) as unknown as JWTPayload;
    socket.data.user = {
      id: resultado.id,
      email: resultado.email,
      nome: resultado.nome,
    };
    next();
  } catch (error) {
    return next(new Error("Token inválido ou expirado"));
  }
}
