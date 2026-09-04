import criar_service from "./exchange_proposal_service.js";
export async function criar_controller(req, res, next) {
  try {
    const { receiver_id, offered_service_id, wanted_service_id, mensagem } =
      req.body;
    const proposer_id = req.usuario.id;
    const resposta = await criar_service(
      proposer_id,
      receiver_id,
      offered_service_id,
      wanted_service_id,
      mensagem,
    );
    return res.status(201).json({ resposta });
  } catch (erro) {
    next(erro);
  }
}
