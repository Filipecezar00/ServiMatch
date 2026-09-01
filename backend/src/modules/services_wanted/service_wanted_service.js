import AppError from "../../utils/AppError.js";
import {
  buscarCategoriaPorId,
  salvar,
  listar_ativos,
} from "../services_wanted/service_wanted.repository.js";

export async function criar_service(user_id, titulo, descricao, categoryId) {
  if (!titulo || !descricao) {
    throw new AppError("Campos obrigatórios ausentes", 400);
  }
  if (titulo.trim().length < 3 || titulo.trim().length > 200) {
    throw new AppError("O titulo deve conter entre 3 a 200 caracteres", 400);
  }
  if (descricao.trim().length < 10) {
    throw new AppError("A descrição deve ter no mínimo 10 caracteres", 400);
  }
  if (!categoryId) {
    categoryId = null;
  } else {
    const resposta = await buscarCategoriaPorId(categoryId);
    if (!resposta) {
      throw new AppError("Categoria não encontrada", 404);
    }
  }

  const dados_solicitacao = await salvar(
    user_id,
    titulo,
    descricao,
    categoryId,
  );
  return dados_solicitacao;
}

export async function listar_ativos_service() {
  const servicos_ativos = await listar_ativos();
  return servicos_ativos;
}
