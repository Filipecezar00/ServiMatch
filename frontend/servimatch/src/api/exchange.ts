import { api } from "../config/api";
import { extractErrorMessage } from "./utils";
import {
  Troca,
  FinalizarTroca,
  TrocaEditada,
  UpdateStatusPayload,
} from "../types/exchangeTypes";

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
  payload: UpdateStatusPayload,
): Promise<UpdateStatusPayload> {
  try {
    const resposta = await api.patch(
      `/exchange/${payload.exchangeId}/editar`,
      payload,
    );
    return resposta.data;
  } catch (error: any) {
    console.log("Status:", error.response?.status);
    console.log("Data do Backend:", error.response?.data);
    console.log("URL chamada:", error.config?.url);
    throw new Error(extractErrorMessage(error));
  }
}
