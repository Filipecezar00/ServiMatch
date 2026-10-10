import { api }from "../config/api";
import {extractErrorMessage} from "./utils"
import {Mensagens} from "../types/chat"

export async function carregarHistorico(conversa_id:number):Promise<Mensagens[]>{
    try{
        const resposta = await api.get(`/${conversa_id}/mensagens`);
        return resposta.data
    }catch(error:any){  
     throw new Error(extractErrorMessage(error))
    }
}