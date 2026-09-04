import criar_service from "./exchange_proposal_service.js";
export async function criar_controller(req, res, next) {
  try {
    const {
      proposer_id,
      receiver_id,
      offered_service_id,
      wanted_service_id,
      mensagem,
    } = req.body;
    const resposta = await criar_service(
      proposer_id,
      receiver_id,
      offered_service_id,
      wanted_service_id,
      mensagem,
    );
    return res.status(200).json({ resposta });
  } catch (erro) {
    next(erro);
  }
}
