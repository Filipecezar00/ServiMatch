import "dotenv/config";
import { Informacoes_profile_controller } from "../profile/profile.controller";
import { authMiddleware } from "../../middleware/auth";
import express from "express";

const profile_router = express.Router();

profile_router.get(
  "/profile/:id?",
  authMiddleware,
  Informacoes_profile_controller,
);

return profile_router;
