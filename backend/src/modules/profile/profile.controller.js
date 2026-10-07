import {
  Informacoes_profile_service,
  editarInformacoes,
} from "../profile/profile.service.js";

export async function Informacoes_profile_controller(req, res, next) {
  try {
    const usuarioId = req.params.id ? Number(req.params.id) : req.usuario.id;
    const resposta = await Informacoes_profile_service(usuarioId);
    return res.status(200).json(resposta);
  } catch (error) {
    next(error);
  }
}

export async function EditarProfile_controller(req, res, next) {
  try {
    const usuarioId = req.usuario.id;
    const { nome, email } = req.body;
    const resposta = await editarInformacoes(nome, email, usuarioId);
    return res.status(200).json({ mensagem: "Perfil atualizado com sucesso!" });
  } catch (error) {
    next(error);
  }
}
