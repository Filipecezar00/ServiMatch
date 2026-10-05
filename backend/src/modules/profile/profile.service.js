import AppError from "../../utils/AppError.js";
import { Informacoes_profile } from "./profile.repository.js";

export async function Informacoes_profile_service(usuarioId) {
  if (!usuarioId) {
    throw new AppError("Id do usuário é obrigatório", 400);
  }

  const perfil = await Informacoes_profile(usuarioId);

  if (!perfil || !perfil.usuario) {
    throw new AppError("Usuário não encontrado", 404);
  }
  return perfil;
}
