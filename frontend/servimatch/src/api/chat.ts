import { api }from "../config/api";
import {extractErrorMessage} from "./utils"
import {Mensagens,Conversas,HistoricoMensagens} from "../types/chat"

export async function carregarHistorico(conversa_id:number):Promise<HistoricoMensagens>{
    try{
        const resposta = await api.get(`conversas/${conversa_id}/mensagens`);
        return resposta.data
    }catch(error:any){  
        console.log("ERRO AO CRIAR MENSAGEM"); 
        console.log("Status:", error?.response?.status);
        console.log("Dados do Erro:", error?.response?.data);
        console.log("Mensagem:", error.message);
     throw new Error(extractErrorMessage(error))
    }
}

export async function listarConversas():Promise<Conversas[]>{
try{
    const resposta = await api.get("/conversas/conversas")
    return resposta.data
}catch(error:any){
    throw new Error(extractErrorMessage(error))
}
}

export async function criarConversa(payload:{receiver_id:number,service_id:number}){
    try{
        const resposta = await api.post("/conversas/criarConversa",payload); 
        return resposta.data
    }catch(error:any){
        throw new Error(extractErrorMessage(error))
    }

}