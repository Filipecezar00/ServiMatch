import {
  criar_review_service,
  listar_reviews_service,
} from "./reviews.service.js";
export async function criar_review_controller(req, res, next) {
  try {
    const { reviewedId, rating, comment } = req.body;
    const { exchangeId } = req.params;
    const reviewerId = req.usuario.id;

    const resposta = await criar_review_service(
      exchangeId,
      reviewerId,
      reviewedId,
      rating,
      comment,
    );

    return res.status(201).json(resposta);
  } catch (erro) {
    next(erro);
  }
}

export async function listar_reviews_controller(req, res, next) {
  try {
    const { reviewedId } = req.params;
    const review = await listar_reviews_service(reviewedId);
    return res.status(200).json(review);
  } catch (erro) {
    next(erro);
  }
}
