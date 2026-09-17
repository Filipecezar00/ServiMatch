import { api } from "../config/api";
import { extractErrorMessage } from "./utils";
import { HomeResponse } from "../types/service";

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
