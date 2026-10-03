import { api } from "../config/api";
import { extractErrorMessage } from "./utils";
import { Troca, FinalizarTroca, TrocaEditada } from "../types/exchangeTypes";

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
    const { id, ...dadosBody } = payload;
    const resposta = await api.patch(`/exchange/${id}/concluir`, dadosBody);
    return resposta.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function cancelarTroca(
  payload: FinalizarTroca,
): Promise<FinalizarTroca> {
  try {
    const resposta = await api.patch(`/exchange/${payload.id}/cancelar`);
    return resposta.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function updateTroca(
  exchangeId: number,
  payload: { location: string; scheduled_date: string },
): Promise<TrocaEditada> {
  try {
    const resposta = await api.patch(`/exchange/${exchangeId}/editar`, payload);
    return resposta.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function updateStatus(
  exchangeId: number,
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "disputed",
): Promise<TrocaEditada> {
  try {
    const resposta = await api.patch(`/exchange/${exchangeId}/editar`, status);
    return resposta.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
