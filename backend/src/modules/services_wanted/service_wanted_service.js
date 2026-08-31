import AppError from "../../utils/AppError.js";
import {
  buscarCategoriaPorId,
  salvar,
} from "../services_wanted/service_wanted.repository.js";

export async function salvar_service(user_id, titulo, descricao, categoryId) {
  if (!user_id) {
    throw new AppError("Usuario não autenticado", 401);
  }
  if (!titulo || titulo.trim().length < 3 || titulo.trim().length > 200) {
    throw new AppError("O titulo deve conter entre 3 a 200 caracteres", 400);
  }
  if (
    !descricao ||
    descricao.trim().length < 10 ||
    descricao.trim().length > 500
  ) {
    throw new AppError(
      "A descrição deve conter entre 10 e 500 caracteres",
      400,
    );
  }
  if (!categoryId) {
    categoryId = null;
  } else {
    const resposta = await buscarCategoriaPorId(categoryId);
    if (!resposta) {
      throw new AppError("Essa categoria não existe", 400);
    }
  }

  const resultado = await salvar(user_id, titulo, descricao, categoryId);
  return {
    id: Number(resultado.insertId),
    user_id,
    titulo,
    descricao,
    categoryId,
  };
}
