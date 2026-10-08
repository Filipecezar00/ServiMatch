import AppError from "../../utils/AppError";
import { buscaUsuarioId,inserirMensagem } from "../conversas/conversas.repository";

export async function buscaUsuarioId_service(
  usuarioId: number,
  conversa_id: number,
) {
  if (!usuarioId) {
 throw new AppError("Usuário não localizado",404); 
  }
  if(!conversa_id){
    throw new AppError("Conversa não localizada",404)
  }

  const conversas = await buscaUsuarioId(usuarioId,conversa_id)

  if(!conversas || conversas.length===0){
    throw new AppError("Conversa não encontrada ou usuário sem acesso",403)
  }
  return true
}  

export async function inserirMensagem_service(conversa_id:number,usuarioId:number,mensagem:string){
if(!conversa_id){
 throw new AppError("Conversa não localizada",404)
}
if(!usuarioId){
    throw new AppError("Usuário não localizado",404)
}
if(!mensagem||mensagem.trim()===""){
    throw new AppError("Envie uma mensagem",400)
}
await buscaUsuarioId_service(usuarioId,conversa_id)
const resposta = await inserirMensagem(conversa_id,usuarioId,mensagem);
return resposta
}