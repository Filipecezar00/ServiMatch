import { extractErrorMessage } from "../api/utils";
import { api } from "../config/api";
import { CriarServico } from "../types/service";

export async function CriarServicoWanted(
  payload: CriarServico,
): Promise<CriarServico> {
  try {
    const resposta_api = await api.post(`/services-wanted/criar`, payload);
    return resposta_api.data;
  } catch (erro) {
    throw new Error(extractErrorMessage(erro));
  }
}
