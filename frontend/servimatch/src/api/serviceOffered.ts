import { api } from "../config/api";
import { extractErrorMessage } from "./utils";
import {
  HomeResponse,
  CriarServico,
  ServicoCriado,
  Categoria,
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
    const resposta_api = await api.get<Categoria[]>("/categorias");
    return resposta_api.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error));
  }
}
