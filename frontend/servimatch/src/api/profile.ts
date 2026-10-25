import { api } from "../config/api";
import { extractErrorMessage } from "./utils";
import { DadosEdicao, PerfilResponse } from "../types/profile";
import type { ImagePickerAsset } from "expo-image-picker";
import axios from "axios";

export async function profile_informations(
  usuarioId?: number,
): Promise<PerfilResponse> {
  try {
    const resposta = await api.get(`/profile/profile/${usuarioId}`);
    return resposta.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function editar_profile(dados: DadosEdicao): Promise<DadosEdicao> {
  try {
    const resposta = await api.patch(`/profile/profile`, dados);
    return resposta.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function editar_foto(fotoPerfil:ImagePickerAsset){
  try{
    const formData = new FormData(); 

    if(!fotoPerfil){
      throw new Error("Uma imagem é obrigatória"); 
    }

     formData.append("imagem",{
        uri:fotoPerfil.uri,
        name:fotoPerfil.fileName ?? `perfil-${Date.now()}.jpg`,
        type:fotoPerfil.mimeType ?? "image/jpeg",
      } as any,
    ); 
  
  const resposta = await api.patch(`profile/fotoPerfil`,formData,{
    headers:{
      "Content-Type":"multipart/form-data", 
    }, 
  }); 
  return resposta.data;
  }catch(error:unknown){
    throw new Error(extractErrorMessage(error)); 
  }
}
