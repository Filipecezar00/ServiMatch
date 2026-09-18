export interface HomeResponse {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string | null;
  prestador_nome: string;
}

export interface CriarServico {
  titulo: string;
  descricao: string;
  categoriaId: string;
}

export interface ServicoCriado {
  id: number;
  titulo: string;
  descricao: string;
  userId: number;
  categoryId: number;
}
