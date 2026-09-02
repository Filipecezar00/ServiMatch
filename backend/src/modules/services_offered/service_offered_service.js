import AppError from "../../utils/AppError.js";
import {
  atualizar,
  buscarCategoriaPorId,
  buscarServicoPorId,
  salvar,
  buscarTodosAtivos,
  buscarMeusServicos,
  alterarStatusServico,
} from "./service_offered_repository.js";

export async function criar_service(userId, titulo, descricao, categoryId) {
  if (!titulo || !descricao) {
    throw new AppError("Campos obrigatórios ausentes", 400);
  }
  if (titulo.trim().length < 3 || titulo.trim().length > 200) {
    throw new AppError("titulo deve ter entre 3 e 200 caracteres", 400);
  }
  if (descricao.trim().length < 10) {
    throw new AppError("Descrição deve ter no mínimo 10 caracteres", 400);
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

export async function editarServico_service(
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
  await atualizar(id, tituloFinal, descricaoFinal, categoriaFinal);

  return {
    id: Number(id),
    titulo: tituloFinal,
    descricao: descricaoFinal,
    categoryId: categoriaFinal,
  };
}

export async function alterarStatusServico_service(id, userId, novoStatus) {
  const servico = await buscarServicoPorId(id);
  if (!servico || Number(servico.user_id) !== Number(userId)) {
    throw new AppError("Serviço não encontrado", 404);
  }
  if (typeof novoStatus !== "boolean") {
    throw new AppError(
      "O campo novoStatus deve ser um valor booleano (true ou false)",
      400,
    );
  }
  await alterarStatusServico(id, novoStatus);
  return { id: Number(id), ativo: novoStatus };
}
