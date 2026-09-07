import "dotenv/config";
import express from "express";
import authMiddleware from "../../middleware/auth.js";
import { criar_review_controller } from "./reviews.controller.js";

const reviews_router = express.Router();

reviews_router.post("/criar", authMiddleware, criar_review_controller);

export default reviews_router;
