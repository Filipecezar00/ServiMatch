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

export interface RegisterResponse {
  usuario: Usuario;
}

export interface HomeResponse {
  id: string | number;
  nome: string;
  descricao: string;
}
