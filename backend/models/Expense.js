import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Education", "Other"],
      default: "Other",
    },
    date: { type: Date, default: Date.now },
    source: { type: String, enum: ["ai", "manual"], default: "manual" },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);