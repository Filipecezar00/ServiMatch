import { api } from "../config/api";
import { extractErrorMessage } from "./utils";
import {
  HomeResponse,
  CriarServico,
  ServicoCriado,
  Categoria,
  StatusServico,
  Servico,
} from "../types/service";

export async function getHome(): Promise<HomeResponse[]> {
  try {
    const resposta_api = await api.get<HomeResponse[]>(
      "/services-offered/listar-ativos",
    );
    return resposta_api.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error));
  }
}

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
export async function obterServicoPorId(id: number) {
  try {
    const resposta_api = await api.get(`/services-offered/${id}/servico`);
    return resposta_api.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
