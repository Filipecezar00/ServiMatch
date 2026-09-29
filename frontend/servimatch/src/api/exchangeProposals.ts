import { api } from "../config/api";
import { extractErrorMessage } from "./utils";
import {
  PropostaTroca,
  PropostaEnviada,
  PropostaRecebida,
  StatusProposta,
} from "../types/exchangeTypes";

export async function criarProposta(
  payload: PropostaTroca,
): Promise<PropostaTroca> {
  try {
    const resposta_api = await api.post<PropostaTroca>(
      `/exchange-proposals/criar`,
      payload,
    );
    return resposta_api.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function listaPropostasRecebidas(): Promise<PropostaRecebida[]> {
  try {
    const resposta_api = await api.get(`/exchange-proposals/listar-recebidas`);
    return resposta_api.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function listaPropostasEnviadas(): Promise<PropostaEnviada[]> {
  try {
    const resposta_api = await api.get(`/exchange-proposals/listar-enviadas`);
    return resposta_api.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function alterarStatusProposta(
  payload: StatusProposta,
): Promise<StatusProposta> {
  try {
    const resposta_api = await api.patch(
      `/exchange-proposals/${payload.id}/status`,
      { statusProposta: payload.statusProposta },
    );
    return resposta_api.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
