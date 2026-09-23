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
  categoriaId: number;
}

export interface ServicoCriado {
  id: number;
  titulo: string;
  descricao: string;
  userId: number;
  categoryId: number;
}

export interface Servico {
  id: number;
  titulo: string;
  descricao: string;
  ativo: boolean;
}

export interface ServicoEditado {
  id: number;
  titulo: string;
  descricao: string;
  categoryId: number;
}

export interface Categoria {
  id: number;
  nome: string;
}

export interface StatusServico {
  id: number;
  ativo: boolean;
}
