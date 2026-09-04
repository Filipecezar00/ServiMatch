import "dotenv/config";
import express from "express";
import { criar_controller } from "./exchange_proposal_controller.js";
import { authMiddleware } from "../../middleware/auth.js";

const exchange_proposal_router = express.Router();

exchange_proposal_router.post("/criar", authMiddleware, criar_controller);

export default exchange_proposal_router;
