import { api } from "../config/api";
import { extractErrorMessage } from "./utils";
import { Troca } from "../types/exchangeTypes";

export async function Troca() {
  try {
    const resposta = await api.get("/exchange/listar");
    return resposta.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
