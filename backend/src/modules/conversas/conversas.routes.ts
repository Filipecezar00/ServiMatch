import { Router } from "express";
import {buscaMensagens_controller} from "../conversas/conversas.controller"
import { authMiddleware } from "../../middleware/auth";

const conversas_router = Router()

conversas_router.get("/:conversa_id/mensagens",authMiddleware,buscaMensagens_controller)


export default conversas_router