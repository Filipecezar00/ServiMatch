import "dotenv/config";
import express from "express";
import authMiddleware from "../../middleware/auth.js";
import {
  criar_review_controller,
  listar_reviews_controller,
} from "./reviews.controller.js";

const review_router = express.Router();

review_router.post("/criar/:id", authMiddleware, criar_review_controller);
review_router.get("/:reviewedId/reviews", listar_reviews_controller);
export default review_router;
