import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AiInput from "../components/AiInput";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import Charts from "../components/Charts";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ thisMonthTotal: 0, byCategory: [], byMonth: [] });
  const [category, setCategory] = useState("All");
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const params = {};
      if (category !== "All") params.category = category;
      if (month) params.month = month;

      const [expRes, sumRes] = await Promise.all([
        API.get("/expenses", { params }),
        API.get("/expenses/summary"),
      ]);

      setExpenses(expRes.data);
      setSummary(sumRes.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      }
      console.log("Fetch error:", err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [category, month]);

  const handleDelete = async (id) => {
     if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await API.delete(`/expenses/${id}`);
      fetchData();
    } catch (err) {
       alert(err.response?.data?.message || "Could not delete expense");
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Welcome, {user.name} 👋</h2>

      <div className="stats-grid" style={{ marginTop: "16px" }}>
        <div className="card stat-card">
          <h3>This month's total</h3>
          <p>₹{summary.thisMonthTotal}</p>
        </div>
        <div className="card stat-card">
          <h3>Expenses shown</h3>
          <p>{expenses.length}</p>
        </div>
      </div>

      <Charts summary={summary} />

      <div className="chart-grid">
        <AiInput onAdded={fetchData} />
        <ExpenseForm onAdded={fetchData} />
      </div>

      <ExpenseList
        expenses={expenses}
        category={category}
        setCategory={setCategory}
        month={month}
        setMonth={setMonth}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Dashboard;