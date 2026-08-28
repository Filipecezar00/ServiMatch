import express from "express";
import {
  criarUsuario,
  loginUsuario,
} from "../../modules/users/users.controller.js";
const router = express.Router();

router.post("/cadastro", criarUsuario);
router.post("/login", loginUsuario);

export default router;
