import { extractErrorMessage } from "../api/utils";
import { api } from "../config/api";
import { CriarServico, Servico } from "../types/service";

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

export async function ListarServicoWante(): Promise<Servico> {
  try {
    const resposta_api = await api.get("/services-wanted/listar-minhas");
    return resposta_api.data;
  } catch (erro) {
    throw new Error(extractErrorMessage(erro));
  }
}
