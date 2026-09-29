export interface PropostaTroca {
  receiver_id: number;
  offered_service_id: number;
  wanted_service_id: number;
  mensagem: string;
}

export interface Proposta {
  id: number;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  mensagem: string;
  created_at: string;
  outro_usuario_nome: string;
  servico_oferecido_titulo: string;
  servico_desejado_titulo: string;
}

export type PropostaRecebida = Proposta;
export type PropostaEnviada = Proposta;
