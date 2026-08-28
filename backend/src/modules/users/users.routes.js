import express from "express";
import {
  criarUsuario,
  loginUsuario,
} from "../../modules/users/users.controller.js";
const app = express.Router();

app.post("/cadastro", criarUsuario);
app.post("/login", loginUsuario);

export default app;
