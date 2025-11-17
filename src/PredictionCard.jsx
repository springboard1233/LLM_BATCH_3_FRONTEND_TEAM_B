import React from "react";
import PropTypes from "prop-types";
import "./PredictionCard.css";

/**
 * PredictionCard — simple UI to show Fraud/Legitimate + risk %
 *
 * Props:
 *  - transactionId (string)
 *  - label (string) 'fraud'|'legitimate'|'safe' etc.
 *  - score (number) 0-1 or 0-100
 *  - amount, date, channel (optional)
 */
function normalizeScore(score) {
  if (typeof score !== "number" || Number.isNaN(score)) return 0;
  if (score <= 1) return Math.max(0, Math.min(1, score));
  return Math.max(0, Math.min(100, score)) / 100;
}
function prettyLabel(label) {
  if (!label) return "Unknown";
  const l = String(label).toLowerCase();
  if (l.includes("fraud")) return "Fraud";
  if (l.includes("legit") || l.includes("safe")) return "Legitimate";
  return label;
}

export default function PredictionCard({
  transactionId = "—",
  label = "Unknown",
  score = 0,
  amount,
  date,
  channel,
}) {
  const normalized = normalizeScore(score);
  const percent = Math.round(normalized * 100);
  const displayLabel = prettyLabel(label);
  const isFraud = displayLabel.toLowerCase() === "fraud" || percent >= 70;
  const theme = isFraud ? "fraud" : "safe";

  return (
    <div className={`pc-card pc-${theme}`} role="region" aria-label="Prediction card">
      <div className="pc-top">
        <div className="pc-left">
          <div className="pc-icon" aria-hidden>
            {isFraud ? "⚠️" : "✅"}
          </div>
          <div className="pc-info">
            <div className="pc-tid">{transactionId}</div>
            <div className="pc-sub">{channel || "Unknown channel"} • {date || "—"}</div>
          </div>
        </div>

        <div className="pc-right">
          {amount && <div className="pc-amount">${amount}</div>}
          <div className={`pc-badge pc-badge-${theme}`}>{displayLabel}</div>
        </div>
      </div>

      <div className="pc-bar-row">
        <div className="pc-percent">{percent}%</div>
        <div className="pc-bar-wrap" aria-hidden>
          <div className="pc-bar-bg">
            <div className={`pc-bar-fill pc-bar-${theme}`} style={{ width: `${percent}%` }} />
          </div>
          <div className="pc-scale"><span>Low</span><span>Medium</span><span>High</span></div>
        </div>
      </div>

      <div className="pc-bottom">
        <div className="pc-message">
          {isFraud ? "Flagged: High risk — review this transaction." : "Looks legitimate — no action required."}
        </div>
        <div className="pc-actions">
          <button className="pc-btn" onClick={() => navigator.clipboard?.writeText(`${transactionId} ${displayLabel} ${percent}%`)}>Copy</button>
        </div>
      </div>
    </div>
  );
}

PredictionCard.propTypes = {
  transactionId: PropTypes.string,
  label: PropTypes.string,
  score: PropTypes.number,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  date: PropTypes.string,
  channel: PropTypes.string,
};
