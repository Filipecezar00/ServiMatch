export interface Servico {
  id: number;
  nome: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  reviewer_nome: string;
  created_at: string;
}

export interface UsuarioPerfil {
  id: number;
  nome: string;
  email: string;
  criado_em: string;
  media_rating: number;
  total_reviews: number;
  trocas_concluidas: number;
  servicos: Servico[];
}

export interface PerfilResponse {
  usuario: UsuarioPerfil;
  reviews: Review[];
}
