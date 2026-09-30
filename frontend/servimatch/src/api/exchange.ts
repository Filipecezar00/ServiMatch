import { api } from "../config/api";
import { extractErrorMessage } from "./utils";
import { Troca, FinalizarTroca } from "../types/exchangeTypes";

export async function listarTrocas(): Promise<Troca[]> {
  try {
    const resposta = await api.get("/exchange/listar");
    return resposta.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function concluirTroca(
  payload: FinalizarTroca,
): Promise<FinalizarTroca> {
  try {
    const resposta = await api.patch(`/exchange/${payload.id}/concluir`);
    return resposta.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
