import {
  criar_service,
  mudar_status,
  listaPropostasRecebidas_service,
  listarPropostasEnviadas_service,
} from "./exchange_proposal_service.js";
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

export async function mudar_status_controller(req, res, next) {
  try {
    const id = req.params.id;
    const usuarioId = req.usuario.id;
    const { status } = req.body;

    const resposta = await mudar_status(id, usuarioId, status);

    res.status(200).json({ resposta });
  } catch (erro) {
    next(erro);
  }
}

export async function listaPropostasRecebidas_controller(req, res, next) {
  try {
    const usuarioId = req.usuario.id;
    const resposta = await listaPropostasRecebidas_service(usuarioId);
    return res.status(200).json({ resposta });
  } catch (error) {
    next(error);
  }
}

export async function listaPropostasRecebidas_controller(req, res, next) {
  try {
    const usuarioId = req.usuario.id;
    const resposta = await listarPropostasEnviadas_service(usuarioId);

    return res.status(200).json({ resposta });
  } catch (error) {
    next(error);
  }
}
