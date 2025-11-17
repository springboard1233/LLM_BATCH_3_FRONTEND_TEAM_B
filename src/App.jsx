import React from "react";
import PredictionCard from "./PredictionCard";
import TransactionForm from "./TransactionForm";
import "./index.css";

export default function App() {
  const example = {
    transactionId: "TXN001",
    label: "fraud",
    score: 87,
    amount: "25,000.00",
    date: "2025-10-29",
    channel: "Wire Transfer",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f7fb"
    }}>
      <PredictionCard {...example} />
      <TransactionForm />
    </div>
  );
}
