import AppError from "../../utils/AppError";
import { buscaUsuarioId,inserirMensagem,buscaMensagens,buscaConversas,criarConversa,buscaService_id,marcarLido } from "../conversas/conversas.repository";
import { MarcarMensagemComoLidaInput} from "../../types/socket"

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

if(mensagem.length > 1000){
  throw new AppError("A mensagem é muito longa. O limite é de 1000 caracteres.",400)
}
await buscaUsuarioId_service(usuarioId,conversa_id)
const resposta = await inserirMensagem(conversa_id,usuarioId,mensagem);
return resposta
}

export async function buscaMensagens_service(usuarioId:number,conversa_id:number,page:number,limit:number){
await buscaUsuarioId_service(usuarioId,conversa_id); 
let page_number = Number(page) || 1; 
let limit_number = Number(limit) || 20; 

if(page_number<1){
  page_number = 1 
}
if(limit_number < 1 ){
  limit_number = 20
}
let offset = Number((page_number-1) * limit_number) || 0

const mensagens = await buscaMensagens(conversa_id,limit_number,offset); 
const totalPages = Math.ceil(mensagens.total/limit_number)

return ({
  page:page_number, 
  limit:limit_number,
  total:mensagens.total,
  totalPages,
  data:mensagens.mensagens 
})
}

export async function buscaConversas_service(usuarioId:number){
if(!usuarioId){
  throw new AppError("Usuário não localizado",404); 
}

const conversas = await buscaConversas(usuarioId)

return conversas
}

export async function marcaComoLida_service({mensagemId,conversaId,usuarioId}:MarcarMensagemComoLidaInput){
  if(!Number.isInteger(conversaId)||conversaId<=0){
    throw new AppError("Conversa inválida.",400); 
  }
  if(!Number.isInteger(mensagemId) || mensagemId <=0){
    throw new AppError("Mensagem inválida",400)
  }
  if(!Number.isInteger(usuarioId) || usuarioId<=0){
    throw new AppError("Usuário não autenticado",400)
  }

  const participa = await buscaUsuarioId(usuarioId,conversaId); 

  if(!participa){
    throw new AppError("Você não tem permissão para acessar essa conversa.",403)
  }

  const atualizada = await marcarLido({mensagemId,conversaId,usuarioId})

  if(!atualizada){
    return null; 
  }

  return {
    conversaId, 
    mensagemId, 
    leitorId:usuarioId
  }
}

export async function criarConversa_service(proposer_id:number,receiver_id:number,service_id?:number|null){
  if(!proposer_id){
    throw new AppError("Usuário não localizado",404)
  }
  if(!receiver_id){
    throw new AppError("Usuário não localizado",404)
  }
  if(service_id!=null){ 
    const servicoExistente = await buscaService_id(service_id)
    if(!servicoExistente){
      throw new AppError("Serviço não localizado",404)
    }
  }

  const conversas = await criarConversa(proposer_id,receiver_id,service_id!==undefined && service_id!==null ? Number(service_id):null); 

  return conversas
}