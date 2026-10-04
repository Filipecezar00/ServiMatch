import {
  listar_exchanges_service,
  update_exchange_service,
  completed_exchange_service,
  canceled_exchange_service,
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
    const { status, scheduled_date, location, notes } = req.body;
    const usuarioId = req.usuario.id;

    const resposta = await update_exchange_service(
      status,
      scheduled_date,
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

export async function completed_exchange_controller(req, res, next) {
  try {
    const usuarioId = req.usuario.id;
    const { id } = req.params;

    const resposta = await completed_exchange_service(id, usuarioId);

    return res.status(200).json(resposta);
  } catch (erro) {
    next(erro);
  }
}

export async function canceled_exchange_controller(req, res, next) {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const resposta = await canceled_exchange_service(id, usuarioId);

    return res.status(200).json(resposta);
  } catch (erro) {
    next(erro);
  }
}
