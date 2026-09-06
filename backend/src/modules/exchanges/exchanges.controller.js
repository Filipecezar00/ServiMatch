import {
  listar_exchanges_service,
  update_exchange_service,
} from "./exchanges.service.js";

export async function listar_exchange_controller(req, res, next) {
  try {
    const usuarioId = req.usuario.id;
    const resposta = await listar_exchanges_service(usuarioId);

    return res.status(200).json(resposta);
  } catch (erro) {
    next(erro);
  }
}

export async function update_exchange_controller(req, res, next) {
  try {
    const exchangeId = req.params.id;
    const { status, schedule_date, location, notes } = req.body;
    const usuarioId = req.usuario.id;

    const resposta = await update_exchange_service(
      status,
      schedule_date,
      location,
      notes,
      exchangeId,
      usuarioId,
    );

    return res.status(200).json(resposta);
  } catch (erro) {
    next(erro);
  }
}
