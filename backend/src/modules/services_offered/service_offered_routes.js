import "dotenv/config";
import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { criar_controller } from "./service_offered_controller.js";
import {
  listarAtivos_controller,
  listarServicosUsuario_controller,
} from "./service_offered_controller.js";

const router = express.Router();

router.post("/criar", authMiddleware, criar_controller);
router.get("/listar-ativos", listarAtivos_controller);
router.get("/listar-minhas", authMiddleware, listarServicosUsuario_controller);

export default router;
