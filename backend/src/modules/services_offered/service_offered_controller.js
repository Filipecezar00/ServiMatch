import { criar_service } from "./service_offered_service";
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
