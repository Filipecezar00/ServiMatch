import AppError from "../../utils/AppError.js";
import {
  listar_exchanges_repository,
  buscar_dados_proposta_repository,
  update_exchange_repository,
  completed_exchange_repository,
  buscar_status_exchange_repository,
  canceled_exchange_repository,
} from "./exchanges.repository.js";

export async function listar_exchanges_service(usuarioId) {
  if (!usuarioId) {
    throw new AppError("Usuário não autenticado", 400);
  }
  const resposta = await listar_exchanges_repository(usuarioId);
  return resposta;
}

export async function buscar_exchange_service(exchangeId, usuarioId) {
  if (!exchangeId || !usuarioId) {
    throw new AppError("Não foi possivel atualizar essa troca", 400);
  }

  const resposta = await buscar_dados_proposta_repository(
    exchangeId,
    usuarioId,
  );

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
  exchangeId,
  usuarioId,
) {
  if (!usuarioId) {
    throw new AppError("Usuário invalido para executar essa ação", 400);
  }
  if (!exchangeId) {
    throw new AppError("Troca não localizada", 404);
  }
  const exchange_data = await buscar_dados_proposta_repository(
    exchangeId,
    usuarioId,
  );
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
    exchangeId,
    status,
    schedule_date,
    location,
    notes,
  );

  return resposta;
}

export async function completed_exchange_service(id, usuarioId) {
  const busca_status = await buscar_status_exchange_repository(id, usuarioId);

  if (!busca_status) {
    throw new AppError("Troca não localizada", 404);
  }

  if (
    busca_status.status !== "in_progress" &&
    busca_status.status !== "scheduled"
  ) {
    throw new AppError("Status inválido para realizar a conclusão", 409);
  }

  const resposta = await completed_exchange_repository(id);

  return resposta;
}
export async function canceled_exchange_service(id, usuarioId) {
  const busca_status = await buscar_status_exchange_repository(id, usuarioId);
  if (!busca_status) {
    throw new AppError("Troca não localizada", 404);
  }

  if (busca_status.status === "completed") {
    throw new AppError(
      "Não é possivel realizar o cancelamento de uma troca concluida",
      409,
    );
  }

  if (busca_status.status === "cancelled") {
    throw new AppError("Essa troca já foi cancelada", 409);
  }

  const resposta = await canceled_exchange_repository(id);

  return resposta;
}
