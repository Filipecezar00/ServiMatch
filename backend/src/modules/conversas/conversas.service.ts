import AppError from "../../utils/AppError";
import { buscaUsuarioId } from "../conversas/conversas.repository";

export async function buscaUsuarioId_service(
  usuarioId: number,
  conversa_id: number,
) {
  if (!usuarioId) {
 throw new AppError("usuario não localizado",404); 
  }
  if(!conversa_id){
    throw new AppError("Conversa não localizada",404)
  }

  await buscaUsuarioId(usuarioId,conversa_id)
}               