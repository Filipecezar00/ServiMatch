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

pool.getConnection.mockResolvedValue(mockConnection);

describe("mudar_status_exchange_service", () => {
  test("Deve alterar o status da proposta com sucesso", async () => {
    exchangesRepository.buscar_proposta_porId.mockResolvedValue({
      id: 1,
      status: "pending",
      proposer_id: 2,
      receiver_id: 3,
    });

    const resultado = await mudar_status(1, 3, "accepted");

    expect(resultado).toBeDefined();
    expect(mockConnection.commit).toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });

  test("Deve disparar erro se a proposta não for encontrada", async () => {
    exchangesRepository.buscar_proposta_porId.mockResolvedValue(null);

    await expect(mudar_status(999, 3, "accepted")).rejects.toThrow();
  });

  test("Deve disparar erro quando o receiver_id está errado", async () => {
    exchangesRepository.buscar_proposta_porId.mockResolvedValue({ id: 1 });

    await expect(mudar_status(1, 2, "accepted")).rejects.toThrow();
  });

  test("Deve disparar o erro quando o status estiver incorreto", async () => {
    exchangesRepository.buscar_proposta_porId.mockResolvedValue({
      id: 1,
    });

    await expect(mudar_status(1, 3, "in_progress")).rejects.toThrow();
  });
});
