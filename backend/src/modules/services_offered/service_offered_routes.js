import "dotenv/config";
import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { criar_controller } from "./service_offered_controller.js";

const router = express.Router();

router.post("/criar", authMiddleware, criar_controller);

export default router;
