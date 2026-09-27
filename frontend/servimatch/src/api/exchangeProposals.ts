import { api } from "../config/api";
import { extractErrorMessage } from "./utils";

export async function criarProposta() {
  try {
    const resposta_api = await api.post(`/exchanges/criar`);
    return resposta_api.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
