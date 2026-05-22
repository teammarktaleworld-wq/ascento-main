"use client";

import { ATTENDANCE } from "./data";

interface AttendancePageProps {
  attendancePct: number;
}

export default function AttendancePage({ attendancePct }: AttendancePageProps) {
  const stats = [
    { label: "Present", value: ATTENDANCE.filter(a => a.status === "present").length, color: "#4ECDC4", bg: "#F0FFFE" },
    { label: "Absent",  value: ATTENDANCE.filter(a => a.status === "absent").length,  color: "#FF6B6B", bg: "#FFF0F0" },
    { label: "Late",    value: ATTENDANCE.filter(a => a.status === "late").length,     color: "#FFB347", bg: "#FFF8EE" },
    { label: "Overall", value: `${attendancePct}%`,                                    color: "#A78BFA", bg: "#F5F0FF" },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-title">Attendance</h2>
        <p className="page-sub">Your attendance record</p>
      </div>

      <div className="att-stats">
        {stats.map((s, i) => (
          <div
            key={i}
            className="att-stat-box"
            style={{ background: s.bg, borderColor: s.color + "44" }}
          >
            <div className="att-stat-val" style={{ color: s.color }}>{s.value}</div>
            <div className="att-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dash-card">
        <div className="card-title" style={{ marginBottom: 16 }}>Recent Classes</div>
        <div className="att-list">
          {ATTENDANCE.map((a, i) => (
            <div key={i} className="att-row">
              <div className="att-date-col">
                <div className="att-date">{a.date}</div>
                <div className="att-day">{a.day}</div>
              </div>
              <div className="att-bar" />
              <div className="att-subject">Abacus Speed Practice</div>
              <div className={`att-badge att-${a.status}`}>
                {a.status === "present" ? "✓ Present" : a.status === "late" ? "⏱ Late" : "✗ Absent"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}