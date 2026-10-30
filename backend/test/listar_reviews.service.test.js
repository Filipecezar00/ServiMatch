import {jest} from "@jest/globals";

jest.unstable_mockModule(
 "../src/modules/reviews/reviews.repository.js",
 ()=>({
  buscar_dados_review_repository:jest.fn(), 
  criar_review_repository:jest.fn(), 
  buscar_review_existente_repository:jest.fn(), 
  listar_review_repository:jest.fn(), 
  buscar_media_repository:jest.fn(), 
 }),
);

const reviewsRepository = await import(
  "../src/modules/reviews/reviews.repository.js"
); 

const {listar_reviews_service} = await import(
"../src/modules/reviews/reviews.service.js"
)

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
