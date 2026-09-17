import { LoginResponse, RegisterResponse } from "../types/auth";
import { api } from "../config/api";
import { extractErrorMessage } from "./utils";

export async function login(
  email: string,
  senha: string,
): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>(`/users/login`, {
      email: email,
      senha: senha,
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function register(
  email: string,
  nome: string,
  senha: string,
): Promise<RegisterResponse> {
  try {
    const resposta_api = await api.post<RegisterResponse>(`/users/cadastro`, {
      email: email,
      nome: nome,
      senha: senha,
    });
    return resposta_api.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error));
  }
}
