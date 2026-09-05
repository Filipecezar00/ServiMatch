import AppError from "../../utils/AppError.js";
import {
  listar_exchanges_repository,
  buscar_dados_proposta,
} from "./exchanges.repository.js";

export async function listar_exchanges_service(usuarioId) {
  if (!usuarioId) {
    throw new AppError("Usuário não autenticado", 400);
  }
  const resposta = await listar_exchanges_repository(usuarioId);
  return resposta;
}

export async function buscar_exchange_service(exchangeid, usuarioId) {
  if (!exchangeid || !usuarioId) {
    throw new AppError("Não foi possivel atualizar essa troca", 400);
  }

  const resposta = await buscar_dados_proposta(exchangeid, usuarioId);

  if (!resposta) {
    throw new AppError("Não foi possivel localizar dados dessa proposta", 404);
  }

  return resposta;
}
