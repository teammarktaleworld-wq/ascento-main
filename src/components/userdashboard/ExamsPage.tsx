"use client";

import { EXAMS } from "./data";

export default function ExamsPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-title">Exams & Results</h2>
        <p className="page-sub">Your exam schedule and performance</p>
      </div>

      <div className="exams-list">
        {EXAMS.map((e, i) => (
          <div
            key={i}
            className={`exam-full-card ${e.status === "upcoming" ? "exam-upcoming" : ""}`}
          >
            <div className="exam-full-left">
              <div
                className="efcard-date-box"
                style={{ background: e.color + "20", color: e.color }}
              >
                <div className="efcard-month">
                  {e.date.split(",")[0].split(" ")[0].toUpperCase()}
                </div>
                <div className="efcard-day">
                  {e.date.split(" ")[1]?.replace(",", "")}
                </div>
              </div>
              <div className="efcard-info">
                <div className="efcard-title">{e.title}</div>
                <div className="efcard-meta">{e.date} · {e.time}</div>
                {e.status === "upcoming" ? (
                  <div className="efcard-upcoming-tag">📅 Upcoming</div>
                ) : (
                  <div className="efcard-result">
                    Score:{" "}
                    <strong style={{ color: (e.score ?? 0) >= 80 ? "#4ECDC4" : "#FFB347" }}>
                      {e.score}/{e.total}
                    </strong>
                    <div className="efcard-grade">
                      {(e.score ?? 0) >= 90 ? "A+ 🏆" : (e.score ?? 0) >= 80 ? "A 🌟" : "B ✔"}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {e.status === "completed" && e.score && (
              <div className="efcard-score-circle" style={{ borderColor: e.color }}>
                <span style={{ color: e.color, fontFamily: "'Fredoka One', cursive" }}>
                  {e.score}%
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}