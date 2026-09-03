import AppError from "../../utils/AppError";
import { criar } from "../users/user.repository";

async function criar_service(
  proposer_id,
  receiver_id,
  offered_service_id,
  wanted_service_id,
  mensagem,
) {
  if (proposer_id === receiver_id) {
    throw new AppError("Você não pode enviar uma proposta para você mesmo");
  }
  if (mensagem.trim().length == 0 || mensagem.trim().length > 200) {
    throw new AppError("Mensagem inválida ou excede o limite de caracteres");
  }
}
