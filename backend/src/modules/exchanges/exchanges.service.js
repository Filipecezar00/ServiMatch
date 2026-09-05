import AppError from "../../utils/AppError.js";
import { listar_exchanges_repository } from "./exchanges.repository.js";

export async function listar_exchanges_service(usuarioId) {
  if (!usuarioId) {
    throw new AppError("Usuário não autenticado", 400);
  }
  const resposta = await listar_exchanges_repository(usuarioId);
  return resposta;
}
