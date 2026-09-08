import express from "express";
import {
  criarUsuario,
  loginUsuario,
} from "../../modules/users/users.controller.js";
const user_router = express.Router();

user_router.post("/cadastro", criarUsuario);
user_router.post("/login", loginUsuario);

export default user_router;
