import { criar_service } from "./service_wanted_service.js";
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
