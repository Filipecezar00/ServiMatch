export interface Mensagens{
    id:number; 
    conversa_id:number; 
    sender_id:number; 
    mensagem:string; 
    lido:boolean; 
    enviando?:boolean
    created_at:string;
}