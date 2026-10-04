export interface PropostaTroca {
  receiver_id: number;
  offered_service_id: number;
  wanted_service_id: number;
  mensagem: string;
}

export interface Proposta {
  id: number;
  titulo: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  mensagem: string;
  created_at: string;
  outro_usuario_nome: string;
  servico_oferecido_titulo: string;
  servico_desejado_titulo: string;
}

export interface StatusProposta {
  id: number;
  statusProposta: "accepted" | "rejected";
}
export type PropostaRecebida = Proposta;
export type PropostaEnviada = Proposta;

export interface Troca {
  id: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "disputed";
  scheduled_date: string | null;
  location: string | null;
  notes: string | null;
  completed_at: string | null;
  proposer_id: number;
  receiver_id: number;
  outro_usuario_nome: string;
  servico_oferecido_titulo: string;
  servico_desejado_titulo: string;
  rating: number | null;
}

export interface TrocaEditada {
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "disputed";
  scheduled_date: string;
  location: string;
  notes: string;
  exchangeId: number;
  usuarioId: number;
}

export interface UpdateStatusPayload {
  exchangeId: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "disputed";
  scheduled_date?: string;
  location?: string;
  notes?: string | null;
  rating?: number | null;
}

export interface FinalizarTroca {
  id: number;
  status: "cancelled" | "completed";
}

export interface AvaliarTrocaProps {
  visible: boolean;
  troca: Troca | null;
  onClose: () => void;
}
