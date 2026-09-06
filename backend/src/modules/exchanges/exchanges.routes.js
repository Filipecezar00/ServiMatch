import "dotenv/config";
import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import {
  listar_exchange_controller,
  update_exchange_controller,
} from "./exchanges.controller.js";

const exchange_router = express.Router();

exchange_router.get("/listar", authMiddleware, listar_exchange_controller);
exchange_router.patch(
  "/:id/editar",
  authMiddleware,
  update_exchange_controller,
);

export default exchange_router;
