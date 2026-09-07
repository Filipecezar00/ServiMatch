import AppError from "../../utils/AppError.js";
import {
  buscar_dados_review_repository,
  criar_review_repository,
} from "./reviews.repository.js";
export async function criar_review_service(
  exchangeId,
  reviewerId,
  reviewedId,
  rating,
  comment,
) {
  const dados_exchange = await buscar_dados_review_repository(
    exchangeId,
    reviewerId,
  );

  if (!dados_exchange) {
    throw new AppError("Erro ao buscar dados dessa solicitação", 404);
  }

  if (dados_exchange.status !== "completed") {
    throw new AppError("Essa solicitação ainda não foi concluida", 409);
  }

  if (!Number(dados_exchange.proposer_id) === Number(reviewerId)) {
    throw new AppError("Esse usuário não pode enviar o review", 403);
  }

  if (!Number(dados_exchange.receiver_id) === Number(reviewedId)) {
    throw new AppError("Esse usuário não pode enviar o review", 403);
  }

  if (Number(reviewerId) === Number(dados_exchange.proposer_id)) {
    if (Number(reviewedId) !== Number(dados_exchange.receiver_id)) {
      throw new AppError("Esse processo não é válido", 409);
    }
  }

  if (Number(reviewerId) === Number(dados_exchange.receiver_id)) {
    if (Number(reviewedId) !== Number(dados_exchange.proposer_id)) {
      throw new AppError("Esse processo não é válido", 409);
    }
  }

  if (rating < 1 || rating > 5) {
    throw new AppError("A nota não está válida", 409);
  }

  if (comment !== null && comment !== undefined) {
    if (
      comment.trim().length > 200 ||
      comment.trim().length < 10 ||
      comment === ""
    ) {
      throw new AppError("O comentario deve ter entre 10 e 200 caracteres");
    }
  }

  const resultado = await criar_review_repository(
    exchangeId,
    reviewerId,
    reviewedId,
    rating,
    comment,
  );

  return resultado;
}
