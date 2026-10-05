import "dotenv/config";
import { Informacoes_profile_controller } from "../profile/profile.controller";
import { authMiddleware } from "../../middleware/auth";
import express from "express";

const Profilerouter = express.Router();

Profilerouter.get(
  "/profile/:id?",
  authMiddleware,
  Informacoes_profile_controller,
);

return Profilerouter;
