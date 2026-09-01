import "dotenv/config";
import { authMiddleware } from "../../middleware/auth";
import { express } from "express";
import {
  criar_controller,
  listar_ativos_controller,
} from "./service_wanted_controller";
const router = express.Router();

router.post("/criar-wanted", authMiddleware, criar_controller);
router.get("/listar-ativos-wanted", listar_ativos_controller);

export default router;
