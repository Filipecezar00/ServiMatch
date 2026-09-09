import { criar_review_service } from "../src/modules/reviews/reviews.service.js";
import * as reviewsRepository from "../src/modules/reviews/reviews.repository.js";

jest.mock("../src/modules/reviews/reviews.repository.js");

describe("criar_reviews_service", () => {
  test("Criar o review", async () => {
    reviewsRepository.buscar_dados_review_repository.mockResolvedValue({
      id: 1,
      status: "completed",
      proposer_id: 2,
      receiver_id: 3,
    });

    reviewsRepository.criar_review_repository.mockResolvedValue({
      insertId: 1,
    });

    const resultado = await criar_review_service(1, 2, 3, 5, "Testando review");

    expect(resultado).toBeDefined();
  });
  test("exchange não encontrada", async () => {
    reviewsRepository.buscar_dados_review_repository.mockResolvedValue(null);

    await expect(
      criar_review_service(1, 2, 3, 5, "Testando review"),
    ).rejects.toThrow("Erro ao buscar dados dessa solicitação");
  });
});
