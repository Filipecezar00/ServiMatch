import { api } from "../config/api";
import { extractErrorMessage } from "./utils";
import { PropostaTroca } from "../types/exchangeTypes";

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

export async function listaPropostasRecebidas() {
  try {
    const resposta_api = await api.get(`/exchanges-proposals/listar-recebidas`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
