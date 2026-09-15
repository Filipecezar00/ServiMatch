import { LoginResponse, RegisterResponse } from "../types/auth";
import { api } from "../config/api";
import axios from "axios";

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
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.mensagem ||
        "Erro ao realizar login. Tente novamente";

      throw new Error(errorMessage);
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Ocorreu um erro inesperado.");
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
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.mensagem ||
        "Erro ao realizar cadastro";
      throw new Error(errorMessage);
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Ocorreu um erro inesperado.");
  }
}
