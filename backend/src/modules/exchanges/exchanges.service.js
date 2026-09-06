import AppError from "../../utils/AppError.js";
import {
  listar_exchanges_repository,
  buscar_dados_proposta,
  update_exchange_repository,
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

export async function update_exchange_service(
  status,
  schedule_date,
  location,
  notes,
  exchangeid,
  usuarioId,
) {
  if (!usuarioId) {
    throw new AppError("Usuário invalido para executar essa ação", 400);
  }
  if (!exchangeid) {
    throw new AppError("Troca não localizada", 404);
  }
  const exchange_data = await buscar_dados_proposta(exchangeid, usuarioId);
  if (!exchange_data) {
    throw new AppError("Essa troca não existe no banco", 404);
  }

  if (status !== null && status !== undefined) {
    if (!status) {
      throw new AppError("Categoria de status inválida", 400);
    }
  }
  if (schedule_date !== null && schedule_date !== undefined) {
    if (!schedule_date) {
      throw new AppError("Data de agendamento inválida", 400);
    }
  }
  if (location !== null && location !== undefined) {
    if (!location) {
      throw new AppError("Localização inválida", 400);
    }
  }
  if (notes !== null && notes !== undefined) {
    if (!notes) {
      throw new AppError("Descrição inválida", 400);
    }
  }
  const resposta = await update_exchange_repository(
    exchangeid,
    status,
    schedule_date,
    location,
    notes,
  );

  return resposta;
}
