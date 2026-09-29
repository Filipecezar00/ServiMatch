export interface PropostaTroca {
  receiver_id: number;
  offered_service_id: number;
  wanted_service_id: number;
  mensagem: string;
}

export interface PropostaRecebida {
  id: number;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  mensagem: string;
  created_at: number;
  outro_usuario_nome: string;
  servico_oferecido_titulo: string;
  servico_desejado_titulo: string;
}

export interface PropostaEnviada {
  id: number;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  mensagem: string;
  created_at: number;
  outro_usuario_nome: string;
  servico_oferecido_titulo: string;
  servico_desejado_titulo: string;
}
