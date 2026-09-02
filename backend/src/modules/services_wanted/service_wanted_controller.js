import {
  criar_service,
  listar_ativos_service,
  listar_meusAtivos_service,
  editar_servico_service,
  editar_statusServico_service,
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

export async function editar_servico_controller(req, res, next) {
  try {
    const user_id = req.usuario.id;
    const { id } = req.params;
    const { titulo, descricao, categoryId } = req.body;
    const resposta = await editar_servico_service(
      id,
      user_id,
      titulo,
      descricao,
      categoryId,
    );
    return res.status(200).json(resposta);
  } catch (erro) {
    next(erro);
  }
}

export async function editar_statusServico_controller(req, res, next) {
  try {
    const { id } = req.params;
    const user_id = req.usuario.id;
    const { novoStatus } = req.body;

    const resposta = await editar_statusServico_service(
      id,
      user_id,
      novoStatus,
    );
    return res.status(200).json(resposta);
  } catch (erro) {
    next(erro);
  }
}
