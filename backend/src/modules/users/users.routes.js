import express from "express";
import {
  criarUsuario,
  loginUsuario,
} from "../../modules/users/users.controller.js";
import { authMiddleware } from "../../middleware/auth.js";
const user_router = express.Router();

user_router.post("/cadastro", authMiddleware, criarUsuario);
user_router.post("/login", authMiddleware, loginUsuario);

export default user_router;
