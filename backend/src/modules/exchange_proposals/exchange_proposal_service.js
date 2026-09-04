import AppError from "../../utils/AppError.js";
import {
  criar,
  buscar_offered_service,
  buscar_wanted_service,
  verify_pending,
} from "./exchange_proposal_repository.js";

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
  const busca_offered = await buscar_offered_service(offered_service_id);
  const busca_wanted = await buscar_wanted_service(wanted_service_id);

  if (!busca_offered || !busca_wanted) {
    throw new AppError("Um dos serviços selecionados não existe");
  }
  if (busca_offered.user_id !== proposer_id) {
    throw new AppError("O serviço oferecido não pertence ao proponente");
  }
  if (busca_wanted.user_id !== receiver_id) {
    throw new AppError("O serviço desejado não pertence ao destinatário");
  }

  const offered_pending = await verify_pending(
    offered_service_id,
    wanted_service_id,
  );
  if (offered_pending) {
    throw new AppError("Já existe uma proposta pendente para esses serviços");
  }

  const idCriado = await criar(
    proposer_id,
    receiver_id,
    offered_service_id,
    wanted_service_id,
    mensagem,
  );
  return {
    id: idCriado,
    proposer_id,
    receiver_id,
    offered_service_id,
    wanted_service_id,
    mensagem,
    status: "pending",
  };
}
