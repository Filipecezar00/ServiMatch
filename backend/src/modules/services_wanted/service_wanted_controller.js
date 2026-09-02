import {
  criar_service,
  listar_ativos_service,
  listar_meusAtivos_service,
} from "./service_wanted_service.js";
export async function criar_controller(req, res, next) {
  try {
    const userId = req.usuario.id;
    const { titulo, descricao, categoryId } = req.body;
    const resposta = await criar_service(userId, titulo, descricao, categoryId);
    return res.status(201).json(resposta);
  } catch (erro) {
    next(erro);
  }
}

export async function listar_ativos_controller(req, res, next) {
  try {
    const reposta = await listar_ativos_service();
    return res.status(200).json(reposta);
  } catch (erro) {
    next(erro);
  }
}

export async function listar_meusAtivos_controller(req, res, next) {
  try {
    const userId = req.usuario.id;
    const resposta = await listar_meusAtivos_service(userId);
    return res.status(200).json(resposta);
  } catch (erro) {
    next(erro);
  }
}
