import { listar_reviews_service } from "../src/modules/reviews/reviews.service.js";
import * as reviewsRepository from "../src/modules/reviews/reviews.repository.js";

jest.mock("../src/modules/reviews/reviews.repository.js");

describe("listar_reviews_service", () => {
  test("Retorna a lista de reviews e a média com sucesso", async () => {
    reviewsRepository.listar_review_repository.mockResolvedValue([
      { id: 1, rating: 5, comment: "Excelente Profissional!" },
    ]);
    reviewsRepository.buscar_media_repository.mockResolvedValue({ media: 5 });
    const resultado = await listar_reviews_service(1);
    expect(resultado).toEqual({
      reviews: [{ id: 1, rating: 5, comment: "Excelente Profissional!" }],
      media: { media: 5 },
    });
  });
});
