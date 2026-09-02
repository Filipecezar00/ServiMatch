import "dotenv/config";
import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import {
  alterarStatusServico_controller,
  criar_controller,
} from "./service_offered_controller.js";
import {
  listarAtivos_controller,
  listarServicosUsuario_controller,
  editarServico_controller,
} from "./service_offered_controller.js";

const service_router_offered = express.Router();

service_router_offered.post("/criar", authMiddleware, criar_controller);
service_router_offered.get("/listar-ativos", listarAtivos_controller);
service_router_offered.get(
  "/listar-minhas",
  authMiddleware,
  listarServicosUsuario_controller,
);
service_router_offered.put("/:id", authMiddleware, editarServico_controller);
service_router_offered.patch(
  "/:id/status",
  authMiddleware,
  alterarStatusServico_controller,
);
export default service_router_offered;
