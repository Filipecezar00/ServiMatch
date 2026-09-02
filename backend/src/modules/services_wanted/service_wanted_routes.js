import "dotenv/config";
import { authMiddleware } from "../../middleware/auth";
import { express } from "express";
import {
  criar_controller,
  listar_ativos_controller,
  listar_meusAtivos_controller,
  editar_servico_controller,
  editar_statusServico_controller,
} from "./service_wanted_controller";
const service_router_wanted = express.Router();

service_router_wanted.post("/criar", authMiddleware, criar_controller);
service_router_wanted.get("/listar-ativos", listar_ativos_controller);
service_router_wanted.get(
  "/listar-minhas",
  authMiddleware,
  listar_meusAtivos_controller,
);
service_router_wanted.put("/:id", authMiddleware, editar_servico_controller);
service_router_wanted.patch(
  "/:id/status",
  authMiddleware,
  editar_statusServico_controller,
);

export default service_router_wanted;
