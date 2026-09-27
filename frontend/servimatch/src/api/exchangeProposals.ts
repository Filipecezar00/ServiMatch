import { api } from "../config/api";
import { extractErrorMessage } from "./utils";
import { PropostaTroca } from "../types/exchangeTypes";

export async function criarProposta(
  payload: PropostaTroca,
): Promise<PropostaTroca> {
  try {
    const resposta_api = await api.post<PropostaTroca>(
      `/exchanges/criar`,
      payload,
    );
    return resposta_api.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
