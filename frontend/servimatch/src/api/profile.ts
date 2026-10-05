import { api } from "../config/api";
import { extractErrorMessage } from "./utils";

export async function profile_informations(usuarioId: number) {
  try {
    const resposta = await api.get(`/profile/profile/${usuarioId}`);
    return resposta.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
