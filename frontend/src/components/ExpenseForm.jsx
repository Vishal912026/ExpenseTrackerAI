import { useState } from "react";
import API from "../api/axios";

export const CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Education", "Other"];

const ExpenseForm = ({ onAdded }) => {
  const today = new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(today);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.post("/expenses", { title, amount: Number(amount), category, date });
      setTitle("");
      setAmount("");
      onAdded();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add expense");
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Add manually</h3>

      {error && <p className="error-msg">{error}</p>}

      <div className="row" style={{ marginTop: "12px" }}>
        <input
          type="text"
           placeholder="Title (e.g. Tea)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <button className="btn" type="submit">
          Add
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;