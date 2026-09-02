import AppError from "../../utils/AppError.js";
import {
  buscarServicoPorId,
  buscarCategoriaPorId,
  salvar,
  listar_ativos,
  listar_meusServicos,
  editar_servico_repository,
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

export async function listar_meusAtivos_service(userId) {
  const resposta = await listar_meusServicos(userId);
  return resposta;
}

export async function editar_servico_service(
  id,
  userId,
  titulo,
  descricao,
  categoryId,
) {
  const servico = await buscarServicoPorId(id);
  if (!servico || Number(servico.user_id) !== Number(userId)) {
    throw new AppError("Serviço não encontrado", 404);
  }

  const tituloFinal = titulo ?? servico.titulo;
  const descricaoFinal = descricao ?? servico.descricao;
  const categoriaFinal = categoryId ?? servico.category_id;

  if (titulo !== undefined) {
    if (!titulo || titulo.trim().length < 3 || titulo.trim().length > 200) {
      throw new AppError("O titulo deve conter entre 3 e 200 caracteres", 400);
    }
  }

  if (descricao !== undefined) {
    if (
      !descricao ||
      descricao.trim().length < 10 ||
      descricao.trim().length > 1000
    ) {
      throw new AppError(
        "A descrição deve conter entre 10 e 1000 caracteres",
        400,
      );
    }
  }
  if (categoryId !== undefined && categoryId !== null) {
    const categoriaExiste = await buscarCategoriaPorId(categoryId);
    if (!categoriaExiste) {
      throw new AppError("Categoria informada não existe", 400);
    }
  }
  await editar_servico_repository(
    id,
    tituloFinal,
    descricaoFinal,
    categoriaFinal,
  );

  return {
    id: Number(id),
    titulo: tituloFinal,
    descricao: descricaoFinal,
    categoryId: categoriaFinal,
  };
}
