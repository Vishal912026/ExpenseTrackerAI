import { useState } from "react";
import API from "../api/axios";

const AiInput = ({ onAdded }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/ai/add", { text });
      setText("");
      onAdded();
    } catch (err) {
      setError(err.response?.data?.message || "AI error, please try again");
    }
    setLoading(false);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
        <h3>✨ Add expense with AI</h3>
      <p className="muted">Write in Hindi, Hinglish or English. You can add multiple expenses in one sentence.</p>

      {error && <p className="error-msg">{error}</p>}

      <textarea
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
      placeholder="e.g. Spent 80 rupees on tea and auto yesterday, lunch today was 150"
        required
      />

      <button className="btn" type="submit" disabled={loading} style={{ marginTop: "10px" }}>
        {loading ? "AI is thinking..." : "Add with AI"}
      </button>
    </form>
  );
};

export default AiInput;