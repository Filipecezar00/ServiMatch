import AppError from "../../utils/AppError";
import { buscarCategoriaPorId, salvar } from "./service_offered_repository.js";
import {
  buscarTodosAtivos,
  buscarMeusServicos,
} from "./service_offered_repository.js";

export async function criar_service(userId, titulo, descricao, categoryId) {
  if (!titulo || !descricao) {
    throw new AppError("Campos obrigatórios ausentes", 400);
  }
  if (titulo.trim().length < 3 || titulo.trim().length > 200) {
    throw new AppError("titulo deve ter entre 3 e 200 caracteres");
  }
  if (descricao.trim().length < 10) {
    throw new AppError("Descrição deve ter no mínimo 10 caracteres");
  }
  if (!categoryId) {
    categoryId = null;
  } else {
    const categoria_Existente = await buscarCategoriaPorId(categoryId);
    if (!categoria_Existente) {
      throw new AppError("Categoria não encontrada", 404);
    }
  }
  const dados_solicitacao = await salvar(userId, titulo, descricao, categoryId);
  return dados_solicitacao;
}

export async function listarServicosAtivos_service() {
  let servicos = await buscarTodosAtivos();
  return servicos;
}

export async function listarServicosUsuario_service(userId) {
  let servicos_usuario = await buscarMeusServicos(userId);
  return servicos_usuario;
}
