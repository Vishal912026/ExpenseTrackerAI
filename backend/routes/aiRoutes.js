import express from "express";
import rateLimit from "express-rate-limit";
import protect from "../middleware/authMiddleware.js";
import { addExpenseWithAI } from "../controllers/aiController.js";

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20,
   message: { message: "Too many AI requests, please try again later" },
});

router.post("/add", protect, aiLimiter, addExpenseWithAI);

export default router;