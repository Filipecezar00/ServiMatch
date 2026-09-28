export interface PropostaTroca {
  receiver_id: number;
  offered_service_id: number;
  wanted_service_id: number;
  mensagem: string;
}

export interface PropostaRecebida {
  id: number;
  status: string;
  mensagem: string;
  outro_usuario_nome: string;
}

export interface PropostaEnviada {
  id: number;
  status: string;
  mensagem: string;
  outro_usuario_nome: string;
}
