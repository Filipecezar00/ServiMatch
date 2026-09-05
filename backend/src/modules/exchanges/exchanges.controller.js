import { listar_exchanges_service } from "./exchanges.service.js";

export async function listar_exchange_controller(req, res, next) {
  try {
    const usuarioId = req.usuario.id;
    const resposta = await listar_exchanges_service(usuarioId);

    return res.status(200).json(resposta);
  } catch (erro) {
    next(erro);
  }
}
