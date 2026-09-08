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
  test("Cenário de listas vazias", async () => {
    reviewsRepository.listar_review_repository.mockResolvedValue([]);
    reviewsRepository.buscar_media_repository.mockResolvedValue([]);
    const resultado = await listar_reviews_service(1);
    expect(resultado.reviews).toEqual([]);
  });

  test("Cenário de erro", async () => {
    reviewsRepository.listar_review_repository.mockRejectedValue(
      new Error("Erro de listagem de reviews"),
    );
    reviewsRepository.buscar_media_repository.mockRejectedValue(
      new Error("Erro ao Processar média de reviews"),
    );
    await expect(listar_reviews_service(1)).rejects.toThrow(
      "Erro de listagem de reviews",
    );
  });
});
