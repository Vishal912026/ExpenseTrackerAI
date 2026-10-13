import Expense from "../models/Expense.js";

export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ message: "Title and amount are required" });
    }

    const expense = await Expense.create({
      user: req.user.id,
      title,
      amount,
      category,
      date: date || Date.now(),
      source: "manual",
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const { month, category } = req.query; // month format: 2026-10

    const filter = { user: req.user.id };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (month) {
      const start = new Date(`${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSummary = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });

    const now = new Date();
    let thisMonthTotal = 0;
    const byCategory = {};
    const byMonth = {};

    expenses.forEach((e) => {
      const d = new Date(e.date);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      byMonth[monthKey] = (byMonth[monthKey] || 0) + e.amount;

      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        thisMonthTotal += e.amount;
        byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
      }
    });

    res.json({
      thisMonthTotal,
      byCategory: Object.entries(byCategory).map(([name, value]) => ({ name, value })),
      byMonth: Object.entries(byMonth)
        .sort()
        .map(([month, total]) => ({ month, total })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};