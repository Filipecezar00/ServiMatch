import "dotenv/config";
import { authMiddleware } from "../../middleware/auth";
import { express } from "express";
import { criar_controller } from "./service_wanted_controller";
const router = express.Router();

router.post("/criar-wanted", authMiddleware, criar_controller);

export default router;
