import express from "express";
import protect from "../middleware/authMiddleware.js";
import { addExpense, getExpenses, deleteExpense, getSummary } from "../controllers/expenseController.js";

const router = express.Router();

router.use(protect); 

router.get("/summary", getSummary);
router.route("/").get(getExpenses).post(addExpense);
router.delete("/:id", deleteExpense);

export default router;