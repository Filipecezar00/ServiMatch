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
const router = express.Router();

router.post("/criar", authMiddleware, criar_controller);
router.get("/listar-ativos", listar_ativos_controller);
router.get("/listar-minhas", authMiddleware, listar_meusAtivos_controller);
router.put("/:id", authMiddleware, editar_servico_controller);
router.patch("/:id/status", authMiddleware, editar_statusServico_controller);

export default router;
