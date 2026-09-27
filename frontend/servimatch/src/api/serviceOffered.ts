import { api } from "../config/api";
import { extractErrorMessage } from "./utils";
import {
  HomeResponse,
  CriarServico,
  ServicoCriado,
  Categoria,
  StatusServico,
  Servico,
  ServicoEditado,
} from "../types/service";

export async function criarServico(
  payload: CriarServico,
): Promise<ServicoCriado> {
  try {
    const resposta_api = await api.post<ServicoCriado>(
      "/services-offered/criar",
      payload,
    );
    return resposta_api.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function listarCategorias(): Promise<Categoria[]> {
  try {
    const resposta_api = await api.get<Categoria[]>(
      "/services-offered/categorias",
    );
    return resposta_api.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function listaMeusServicos(): Promise<Servico[]> {
  try {
    const resposta_api = await api.get<Servico[]>(
      "/services-offered/listar-minhas",
    );
    return resposta_api.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
export async function editarStatusServico(
  payload: StatusServico,
): Promise<StatusServico> {
  try {
    const resposta_api = await api.patch<StatusServico>(
      `/services-offered/${payload.id}/status`,
      { ativo: payload.ativo },
    );
    return resposta_api.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
export async function obterDetalhesServicoPorId(id: number) {
  console.log("Chamando", `${api.defaults.baseURL}/services-offered/${id}`);
  try {
    const resposta_api = await api.get(`/services-offered/${id}`);
    console.log("Resposta requisição axios:", resposta_api);
    console.log("status:", resposta_api.status);
    console.log("data:", resposta_api.data);
    return resposta_api.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function editarServico(
  payload: ServicoEditado,
): Promise<ServicoEditado> {
  try {
    const resposta_api = await api.put(
      `/services-offered/${payload.id}`,
      payload,
    );
    return resposta_api.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
