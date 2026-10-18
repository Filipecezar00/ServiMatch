export type SocketData = {
  user: {
    id: number;
    email: string;
    nome: string;
  };
};

export type ClientToServerEvents = {
  join_room(payload:{roomId:number}): void;
  send_message(payload: { roomId: number; mensagem: string }): void;
  read_message(payload:{conversaId:number;mensagemId:number}):void;
};

export type ServerToClientEvents = {
  receive_message(mensagem: MensagemFormatada): void;
  read_message(payload:{conversaId:number;mensagemId:number;leitorId:number;}):void;
  user_typing(data: { conversaId: number; userId: number }): void;
  error_message(error:string):void;
};

export type InterServerEvents = {};

export type MensagemFormatada = {
  id: number;
  conversa_id: number;
  sender_id: number;
  mensagem: string;
  lido: boolean;
  created_at: string | Date;
};

export type MarcarMensagemComoLidaInput ={
  mensagemId:number; 
  conversaId:number; 
  usuarioId:number; 
}