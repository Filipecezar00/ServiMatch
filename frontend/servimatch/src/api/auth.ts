import { LoginResponse } from "../types/auth";
import { api } from "../config/api";

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
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.mensagem ||
      "Erro ao realizar login. Tente novamente";

    throw new Error(errorMessage);
  }
}
