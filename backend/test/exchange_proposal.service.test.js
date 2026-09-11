import { pool } from "../src/config/database.js";
import { mudar_status } from "../src/modules/exchange_proposals/exchange_proposal_service.js";
import * as exchangesRepository from "../src/modules/exchange_proposals/exchange_proposal_repository.js";

jest.mock("../src/config/database.js");
jest.mock("../src/modules/exchange_proposals/exchange_proposal_repository.js");

const mockConnection = {
  beginTransaction: jest.fn().mockResolvedValue(),
  commit: jest.fn().mockResolvedValue(),
  rollback: jest.fn().mockResolvedValue(),
  release: jest.fn().mockResolvedValue(),
  query: jest.fn().mockResolvedValue([{ affectedRows: 1 }]),
};

describe("mudar_status_exchange_service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    pool.getConnection.mockResolvedValue(mockConnection);
  });
  test("Deve alterar o status da proposta com sucesso", async () => {
    exchangesRepository.buscar_proposta_porId.mockResolvedValue({
      id: 1,
      status: "pending",
      proposer_id: 2,
      receiver_id: 3,
    });

    exchangesRepository.alterar_status_repository.mockResolvedValue({
      affectedRows: 1,
    });

    const resultado = await mudar_status(1, 3, "accepted");

    expect(resultado).toBeDefined();
    expect(mockConnection.commit).toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();

    expect(exchangesRepository.alterar_status_repository).toHaveBeenCalledWith(
      1,
      "accepted",
      mockConnection,
    );

    expect(exchangesRepository.exchange_criar).toHaveBeenCalledWith(
      1,
      mockConnection,
    );
  });

  test("Deve disparar erro se a proposta não for encontrada", async () => {
    exchangesRepository.buscar_proposta_porId.mockResolvedValue(null);

    await expect(mudar_status(999, 3, "accepted")).rejects.toThrow(
      "Não foi possivel localizar essa proposta",
    );
  });

  test("Deve disparar erro quando o receiver_id está errado", async () => {
    exchangesRepository.buscar_proposta_porId.mockResolvedValue({
      id: 1,
      status: "pending",
      proposer_id: 2,
      receiver_id: 3,
    });

    await expect(mudar_status(1, 2, "accepted")).rejects.toThrow(
      "Você não pode alterar essa proposta",
    );
  });

  test("Deve disparar o erro quando o status estiver incorreto", async () => {
    exchangesRepository.buscar_proposta_porId.mockResolvedValue({
      id: 1,
      status: "pending",
      proposer_id: 2,
      receiver_id: 3,
    });

    await expect(mudar_status(1, 3, "in_progress")).rejects.toThrow(
      "Esse status não é válido",
    );
  });

  test("Testando execução rollback e não comitar se a query falhar", async () => {
    exchangesRepository.buscar_proposta_porId.mockResolvedValue({
      id: 1,
      status: "pending",
      proposer_id: 2,
      receiver_id: 3,
    });

    exchangesRepository.alterar_status_repository.mockRejectedValueOnce(
      new Error("Erro ao atualizar o status da proposta"),
    );

    await expect(mudar_status(1, 3, "accepted")).rejects.toThrow(
      "Erro ao atualizar o status da proposta",
    );
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });
});
