import axios from "axios";
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.mensagem ||
      "Erro ao executar operação";

    throw new Error(errorMessage);
  }
  if (error instanceof Error) {
    throw new Error(error.message);
  }
  return "Ocorreu um erro inesperado";
}
