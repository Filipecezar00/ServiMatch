import { Troca } from "./exchangeTypes";

export interface Review {
  id?: number;
  exchange_id: number;
  reviewer_id: number;
  reviewed_id: number;
  rating: number;
  comment?: string;
  created_at?: string;
}
export interface AvaliarTrocaProps {
  visible: boolean;
  troca: Troca | null;
  onClose: () => void;
  onSuccess: () => void;
}
