import { api } from "../config/api";
import { extractErrorMessage } from "./utils";
import { PerfilResponse } from "../types/profile";

export async function profile_informations(
  usuarioId?: number,
): Promise<PerfilResponse> {
  try {
    const resposta = await api.get(`/profile/profile/${usuarioId}`);
    return resposta.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
