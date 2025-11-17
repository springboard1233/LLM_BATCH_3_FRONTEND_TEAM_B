// src/TransactionForm.jsx
import React, { useState } from "react";
import PredictionCard from "./PredictionCard";

export default function TransactionForm() {
  const [formData, setFormData] = useState({
    customer_id: "",
    amount: "",
    channel: "",
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    try {
      // 🌐 Replace this URL with your real backend API endpoint
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      // Example API returns: { label: "fraud", score: 0.87 }
      setPrediction(data);
    } catch (err) {
      console.error(err);
      alert("Error: Unable to get prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, minHeight: "100vh", background: "#f9fafb" }}>
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          background: "#fff",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          Transaction Prediction Form
        </h2>

        <form onSubmit={handleSubmit}>
          <label>Customer ID</label>
          <input
            type="text"
            name="customer_id"
            value={formData.customer_id}
            onChange={handleChange}
            required
            placeholder="Enter Customer ID"
          />

          <label>Amount ($)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="Enter Amount"
          />

          <label>Channel</label>
          <select
            name="channel"
            value={formData.channel}
            onChange={handleChange}
            required
          >
            <option value="">Select Channel</option>
            <option value="Online Banking">Online Banking</option>
            <option value="Wire Transfer">Wire Transfer</option>
            <option value="Mobile App">Mobile App</option>
            <option value="ATM">ATM</option>
            <option value="Branch">Branch</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#111827",
              color: "#fff",
              padding: "10px 16px",
              width: "100%",
              borderRadius: 8,
              fontWeight: 600,
              marginTop: 12,
              cursor: "pointer",
            }}
          >
            {loading ? "Predicting..." : "Submit Transaction"}
          </button>
        </form>
      </div>

      {/* Show result if available */}
      {prediction && (
        <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
          <PredictionCard
            transactionId={formData.customer_id}
            label={prediction.label}
            score={prediction.score}
            amount={formData.amount}
            channel={formData.channel}
            date={new Date().toLocaleDateString()}
          />
        </div>
      )}
    </div>
  );
}
