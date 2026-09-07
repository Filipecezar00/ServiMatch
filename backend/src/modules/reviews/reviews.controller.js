import { criar_review_service } from "./reviews.service.js";
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
