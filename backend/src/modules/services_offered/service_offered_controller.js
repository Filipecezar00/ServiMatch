import {
  criar_service,
  editarServico_service,
  listarServicosUsuario_service,
} from "./service_offered_service";
import { listarServicosAtivos_service } from "./service_offered_service.js";
export async function criar_controller(req, res, next) {
  try {
    const { titulo, descricao, categoryId } = req.body;
    const userId = req.usuario.id;
    const criar_service_value = await criar_service(
      userId,
      titulo,
      descricao,
      categoryId,
    );
    return res.status(201).json(criar_service_value);
  } catch (erro) {
    next(erro);
  }
}

export async function listarAtivos_controller(req, res, next) {
  try {
    let servicos = await listarServicosAtivos_service();
    return res.status(200).json(servicos);
  } catch (erro) {
    next(erro);
  }
}

export async function listarServicosUsuario_controller(req, res, next) {
  try {
    const usuarioId = req.usuario.id;
    const servicos = await listarServicosUsuario_service(usuarioId);
    return res.status(200).json(servicos);
  } catch (erro) {
    next(erro);
  }
}

export async function editarServico_controller(req, res, next) {
  try {
    const { id } = req.params;
    const { titulo, descricao, categoryId } = req.body;
    const usuarioId = req.usuario.id;

    const resultado = await editarServico_service(
      id,
      usuarioId,
      titulo,
      descricao,
      categoryId,
    );
    return res.status(200).json(resultado);
  } catch (erro) {
    next(erro);
  }
}
