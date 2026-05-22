"use client";

import { FEES } from "./data";

interface FeesPageProps {
  onToast: (msg: string) => void;
}

export default function FeesPage({ onToast }: FeesPageProps) {
  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-title">Fees</h2>
        <p className="page-sub">Monthly fee statements</p>
      </div>

      {FEES.filter((f) => f.status === "pending").map((f, i) => (
        <div key={i} className="fee-alert">
          <div>
            <div className="fee-alert-title">⚠️ Payment Due — {f.month}</div>
            <div className="fee-alert-sub">₹{f.amount.toLocaleString()} due by {f.due}</div>
          </div>
          <button className="fee-pay-btn" onClick={() => onToast("Redirecting to payment gateway…")}>
            Pay Now
          </button>
        </div>
      ))}

      <div className="dash-card">
        <div className="card-title" style={{ marginBottom: 16 }}>Fee History</div>
        <div className="fee-list">
          {FEES.map((f, i) => (
            <div key={i} className="fee-row">
              <div className="fee-month">{f.month}</div>
              <div className="fee-amount">₹{f.amount.toLocaleString()}</div>
              <div className={`fee-status-badge ${f.status === "paid" ? "fee-paid" : "fee-pending"}`}>
                {f.status === "paid" ? `✓ Paid on ${f.paid}` : `⏳ Due ${f.due}`}
              </div>
              {f.status === "paid" && (
                <button className="receipt-btn" onClick={() => onToast("Generating receipt…")}>
                  Receipt
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}