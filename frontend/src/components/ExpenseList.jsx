import { CATEGORIES } from "./ExpenseForm";

const ExpenseList = ({ expenses, category, setCategory, month, setMonth, onDelete }) => {
  return (
    <div className="card">
      <h3>Expenses</h3>

      <div className="filters" style={{ marginTop: "12px" }}>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />

        <button
          className="btn btn-secondary"
          onClick={() => {
            setCategory("All");
            setMonth("");
          }}
        >
          Clear
        </button>
      </div>

      {expenses.length === 0 ? (
        <p className="muted">No expenses yet.</p>
) : (
        expenses.map((e) => (
          <div className="expense-item" key={e._id}>
            <div className="expense-info">
              <strong>{e.title}</strong>
              <span className="badge">{e.category}</span>
              {e.source === "ai" && <span className="badge badge-ai">AI</span>}
              <br />
              <small>{new Date(e.date).toLocaleDateString("en-IN")}</small>
            </div>

            <div className="expense-right">
              <span>₹{e.amount}</span>
              <button className="btn btn-danger" onClick={() => onDelete(e._id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExpenseList;