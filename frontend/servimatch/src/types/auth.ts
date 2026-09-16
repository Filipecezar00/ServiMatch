export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

export interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  login: (usuario: Usuario, token: string) => void;
  logout: () => void;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}
