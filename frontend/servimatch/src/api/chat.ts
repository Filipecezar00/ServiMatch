import { api }from "../config/api";
import {extractErrorMessage} from "./utils"

async function carregarHistorico(conversa_id:number){
    try{
        const resposta = await api.get(`/${conversa_id}/mensagens`);
        return resposta.data
    }catch(error:any){  
     throw new Error(extractErrorMessage(error))
    }
}