export interface Mensagens{
    id:number; 
    conversa_id:number; 
    sender_id:number; 
    mensagem:string; 
    lido:boolean; 
    enviando?:boolean
    created_at:string;
}

export interface Conversas{
    id:number; 
    proposer_id:number;
    receiver_id:number; 
    service_id:number; 
    created_at:string; 
    updated_at:string; 
}