import "dotenv/config";
import {
  Informacoes_profile_controller,
  EditarProfile_controller,
  EditarFoto_controller
} from "../profile/profile.controller.js";
import { authMiddleware } from "../../middleware/auth.js";
import upload from "../../middleware/upload.js";
import express from "express";

const profile_router = express.Router();

profile_router.get(
  "/profile/:id",
  authMiddleware,
  Informacoes_profile_controller,
);

profile_router.patch("/profile", authMiddleware, EditarProfile_controller);

profile_router.patch("/fotoPerfil",authMiddleware,upload.single("imagem"),EditarFoto_controller)

export default profile_router;
