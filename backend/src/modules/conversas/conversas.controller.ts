import e, {Request,Response,NextFunction} from "express"
import {buscaMensagens_service,buscaConversas_service,criarConversa_service} from "../conversas/conversas.service"


export async function buscaMensagens_controller(req:Request,res:Response,next:NextFunction){
  try{
    const conversa_id = Number(req.params.conversa_id); 
    const {page,limit} = req.query; 
    const usuarioId = req.usuario?.id
    
    const resposta = await buscaMensagens_service(Number(usuarioId),conversa_id,Number(page),Number(limit))

    return res.status(200).json(resposta); 
    }catch(error){
        next(error)
    }
}

export async function buscaConversas_controller(req:Request,res:Response,next:NextFunction){
  try{
    const usuarioId = req.usuario?.id
    const resposta = await buscaConversas_service(Number(usuarioId));

    return res.status(200).json(resposta)
  }catch(error){
    next(error);
  }
}

export async function criarConversa_controller(req:Request, res:Response,next:NextFunction){
  try{
    const proposer_id = req.usuario?.id
    const {receiver_id,service_id} = req.body;

    const resposta = await criarConversa_service(Number(proposer_id),Number(receiver_id),Number(service_id))
    return res.status(201).json(resposta)
  }catch(error){
    next(error)
  }
}