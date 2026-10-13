import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#6b7280"];

const Charts = ({ summary }) => {
  return (
    <div className="chart-grid">
      <div className="card">
          <h3>This month's spending by category</h3>
        {summary.byCategory.length === 0 ? (
        <p className="muted">No expenses this month.</p>
) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={summary.byCategory} dataKey="value" nameKey="name" outerRadius={90} label>
                {summary.byCategory.map((item, index) => (
                  <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="card">
         <h3>Monthly spending</h3>
        {summary.byMonth.length === 0 ? (
         <p className="muted">No data yet.</p>
) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={summary.byMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Bar dataKey="total" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Charts;