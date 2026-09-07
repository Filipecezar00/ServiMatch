import "dotenv/config";
import express from "express";
import authMiddleware from "../../middleware/auth.js";
import { criar_review_controller } from "./reviews.controller.js";

const review_router = express.Router();

review_router.post("/criar", authMiddleware, criar_review_controller);

export default review_router;
