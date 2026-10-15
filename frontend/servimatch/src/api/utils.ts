import axios from "axios";
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
  return(
      error.response?.data?.message ||
      error.response?.data?.mensagem ||
      "Erro ao executar operação"
    )
  }  
  if (error instanceof Error) {
    return error.message
  }
  return "Ocorreu um erro inesperado";
}
