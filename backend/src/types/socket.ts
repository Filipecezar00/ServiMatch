export type SocketData = {
  user: {
    id: number;
    email: string;
    nome: string;
  };
};

export type ClientToServerEvents = {
  join_room(conversaId: number): void;
  send_message(payload: { conversaId: number; mensagem: string }): void;
};

export type ServerToClientEvents = {
  receive_message(mensagem: MensagemFormatada): void;
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
