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
    const formData = new FormData(); 

    formData.append("titulo",payload.titulo); 
    formData.append("descricao",payload.descricao); 
    formData.append("categoryId",String(payload.categoryId)); 

    if(payload.imagem){
      formData.append("imagem",{
        uri:payload.imagem.uri, 
        name:
        payload.imagem.fileName ?? `servico-${Date.now()}.jpg`, 
        type: payload.imagem.mimeType ?? "image/jpeg",
      }as any,
    );
    }

    const resposta_api = await api.post<ServicoCriado>(
      "/services-offered/criar",
      formData,
      {
        headers:{
          "Content-Type":"multipart/form-data", 
        },
      },  
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
  try {
    const resposta_api = await api.get(`/services-offered/${id}`);
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

export async function BuscarServicoOffered(
  busca?: string,
  categoryId?: number | null,
): Promise<Servico[]> {
  try {
    const resposta_api = await api.get("/services-offered/buscar-servicos", {
      params: {
        busca: busca && busca.trim() !== "" ? busca : undefined,
        categoryId: categoryId ?? undefined,
      },
    });
    return resposta_api.data;
  } catch (erro) {
    throw new Error(extractErrorMessage(erro));
  }
}
