import { Socket } from "socket.io-client";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

export interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  socket:Socket | null; 
  login: (usuario: Usuario, token: string) => void;
  logout: () => void;
  connectSocket:()=>void; 
  disconnectSocket:()=>void;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface RegisterResponse {
  usuario: Usuario;
}
