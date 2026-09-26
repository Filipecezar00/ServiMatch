import { extractErrorMessage } from "../api/utils";
import { api } from "../config/api";
import {
  CriarServico,
  Servico,
  ServicoEditado,
  StatusServico,
  Categoria,
} from "../types/service";

export async function criarServicoWanted(
  payload: CriarServico,
): Promise<CriarServico> {
  try {
    const resposta_api = await api.post(`/services-wanted/criar`, payload);
    return resposta_api.data;
  } catch (erro) {
    throw new Error(extractErrorMessage(erro));
  }
}

export async function listarServicoWanted(
  busca?: string,
  categoryId?: number | null,
): Promise<Servico[]> {
  try {
    const resposta_api = await api.get("/services-wanted/buscar-servicos", {
      params: {
        busca: busca,
        categoryId: categoryId,
      },
    });
    return resposta_api.data;
  } catch (erro) {
    throw new Error(extractErrorMessage(erro));
  }
}

export async function editarServicoWanted(
  payload: ServicoEditado,
): Promise<ServicoEditado> {
  try {
    const resposta_api = await api.put(
      `/services-wanted/${payload.id}`,
      payload,
    );
    return resposta_api.data;
  } catch (erro) {
    throw new Error(extractErrorMessage(erro));
  }
}

export async function editarStatusServicoWanted(
  payload: StatusServico,
): Promise<StatusServico> {
  try {
    const resposta_api = await api.patch(
      `/services-wanted/${payload.id}/status`,
      payload,
    );
    return resposta_api.data;
  } catch (erro) {
    throw new Error(extractErrorMessage(erro));
  }
}

export async function obterServicoWantedId(id: number) {
  try {
    const resposta_api = await api.get(`/services-wanted/${id}`);
    return resposta_api.data;
  } catch (erro) {
    throw new Error(extractErrorMessage(erro));
  }
}
export async function listarCategorias(): Promise<Categoria[]> {
  try {
    const resposta_api = await api.get<Categoria[]>(
      `/services-wanted/categorias`,
    );
    return resposta_api.data;
  } catch (erro) {
    throw new Error(extractErrorMessage(erro));
  }
}
