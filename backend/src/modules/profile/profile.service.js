import AppError from "../../utils/AppError.js";
import { Informacoes_profile, EditarProfile,AtualizarFotoPerfil } from "./profile.repository.js"; 
import {enviarImagemCloudinary} from "../../utils/upload.service.js"

export async function Informacoes_profile_service(usuarioId) {
  if (!usuarioId) {
    throw new AppError("Id do usuário é obrigatório", 400);
  }

  const perfil = await Informacoes_profile(usuarioId);

  if (!perfil || !perfil.usuario) {
    throw new AppError("Usuário não encontrado", 404);
  }
  return perfil;
}

export async function editarInformacoes(nome, email, usuarioId) {
  if (!usuarioId) {
    throw new AppError("Id do usuário é obrigatório", 400);
  }

  if (!nome && !email) {
    throw new AppError("Informe ao menos um campo para atualizar", 400);
  }
  if (nome) {
    if (nome.trim().length < 3) {
      throw new AppError("Digite um nome válido");
    }
  }
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new AppError("O email deve conter no mínimo 10 caracteres", 400);
    }
  }

  const resposta = await EditarProfile(nome, email, usuarioId);

  if (resposta === 0) {
    throw new AppError(
      "Usuário não encontrado ou alteração não realizada",
      404,
    );
  }

  return resposta;
}

export async function editarFoto(fotoPerfil,usuarioId){
if(!usuarioId){
  throw new AppError("Id do usuário é obrigatório",400); 
}
if(!fotoPerfil){
  throw new AppError("Uma imagem é obrigatória",400); 
}

const imagem = await enviarImagemCloudinary(fotoPerfil); 
const imagem_url = imagem.imageUrl; 

const resposta = await AtualizarFotoPerfil(imagem_url,usuarioId); 

if(resposta===0 || !resposta){
  throw new AppError("Erro ao realizar atualização de perfil",500); 
}

return resposta; 
}