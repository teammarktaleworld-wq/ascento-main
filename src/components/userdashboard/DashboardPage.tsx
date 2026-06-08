






// src/components/userdashboard/DashboardPage.tsx
"use client";

import { STUDENT, ANNOUNCEMENTS, NOTES, ATTENDANCE } from "./data";
import type { NavPage } from "./data";

interface Props {
  greeting: string;
  attendancePct: number;
  onNavigate: (page: NavPage) => void;
  onToast: (msg: string) => void;
}

export default function DashboardPage({ greeting, attendancePct, onNavigate, onToast }: Props) {
  const quickStats = [
    { icon: "✅", label: "Attendance", value: `${attendancePct}%`, sub: "Last 30 days",        color: "#4ECDC4", bg: "#F0FFFE" },
    { icon: "📝", label: "Next Exam",  value: "Feb 8",             sub: "Level 5 Mid-Term",    color: "#FFB347", bg: "#FFF8EE" },
    { icon: "📚", label: "New Notes",  value: `${NOTES.filter(n => n.new).length}`, sub: "Unread materials", color: "#A78BFA", bg: "#F5F0FF" },
    { icon: "💳", label: "Fee Due",    value: "₹1,800",            sub: "Due Feb 5",            color: "#FF6B6B", bg: "#FFF0F0" },
  ];

  const progressBars = [
    { label: "Speed",    pct: 72,  color: "#FF6B6B" },
    { label: "Accuracy", pct: 88,  color: "#4ECDC4" },
    { label: "Oral",     pct: 65,  color: "#FFB347" },
    { label: "Mental",   pct: 55,  color: "#A78BFA" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Welcome Banner ── */}
      <div style={{
        background: "linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)",
        borderRadius: 20,
        padding: "28px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 8px 32px rgba(255,107,107,0.25)",
      }}>
        <div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.2)",
            borderRadius: 20,
            padding: "4px 12px",
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 10,
            letterSpacing: "0.05em",
          }}>🌟 Student Portal</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: "0 0 8px", lineHeight: 1.2 }}>
            {greeting}, <span style={{ opacity: 0.9 }}>{STUDENT.name.split(" ")[0]}!</span> 👋
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", margin: 0 }}>
            You have <strong style={{ color: "#fff" }}>{ANNOUNCEMENTS.filter(a => a.urgent).length} new announcement</strong> and your next class is <strong style={{ color: "#fff" }}>today at 4:00 PM</strong>.
          </p>
        </div>
        <div style={{ fontSize: 56, opacity: 0.85, flexShrink: 0 }}>🧮</div>
      </div>

      {/* ── Quick Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {quickStats.map((s, i) => (
          <div key={i} style={{
            background: s.bg,
            borderRadius: 16,
            padding: "20px 20px",
            border: `1px solid ${s.color}22`,
            display: "flex",
            alignItems: "center",
            gap: 14,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
              boxShadow: `0 4px 12px ${s.color}30`,
              flexShrink: 0,
            }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Mid Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Today's Class */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #F3F4F6" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#1A1A2E" }}>Today's Class</div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Monday · Jan 20</div>
            </div>
            <button onClick={() => onNavigate("schedule")} style={{
              fontSize: 12, fontWeight: 700, color: "#FF6B6B", background: "#FFF0F0",
              border: "none", borderRadius: 8, padding: "5px 12px", cursor: "pointer",
            }}>View all →</button>
          </div>
          <div style={{
            background: "linear-gradient(135deg, #FFF0F0, #FFF8EE)",
            borderRadius: 12, padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 12,
            border: "1px solid #FFE0CC",
          }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF6B6B", flexShrink: 0, boxShadow: "0 0 0 3px rgba(255,107,107,0.2)" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#1A1A2E" }}>Abacus Speed Practice</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>4:00–6:00 PM · Room 2 · Mrs. Bala Tomar</div>
            </div>
            <div style={{
              fontSize: 10, fontWeight: 800, color: "#fff",
              background: "#FF6B6B", borderRadius: 6, padding: "3px 8px", letterSpacing: "0.05em",
            }}>LIVE</div>
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 12, padding: "10px 12px", background: "#FAFAFA", borderRadius: 10 }}>
            💡 Tip: Practice 5-minute speed drills before class!
          </div>
        </div>

        {/* Announcements */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #F3F4F6" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#1A1A2E" }}>Announcements</div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{ANNOUNCEMENTS.length} total</div>
            </div>
            <button onClick={() => onNavigate("announcements")} style={{
              fontSize: 12, fontWeight: 700, color: "#FF6B6B", background: "#FFF0F0",
              border: "none", borderRadius: 8, padding: "5px 12px", cursor: "pointer",
            }}>View all →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ANNOUNCEMENTS.slice(0, 3).map((a) => (
              <div key={a.id} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10, background: "#FAFAFA",
                borderLeft: `3px solid ${a.color ?? "#FF6B6B"}`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E" }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{a.date}</div>
                </div>
                {a.urgent && (
                  <span style={{
                    fontSize: 9, fontWeight: 800, color: "#FF6B6B",
                    background: "#FFF0F0", borderRadius: 6, padding: "2px 7px",
                  }}>NEW</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Notes ── */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #F3F4F6" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#1A1A2E" }}>Recent Study Material</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Latest uploads from your teacher</div>
          </div>
          <button onClick={() => onNavigate("notes")} style={{
            fontSize: 12, fontWeight: 700, color: "#FF6B6B", background: "#FFF0F0",
            border: "none", borderRadius: 8, padding: "5px 12px", cursor: "pointer",
          }}>View all →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {NOTES.slice(0, 3).map((n) => (
            <div key={n.id}
              onClick={() => onToast(`Opening "${n.title}"…`)}
              style={{
                padding: "16px", borderRadius: 12, cursor: "pointer",
                background: n.color ? `${n.color}12` : "#F9FAFB",
                border: `1px solid ${n.color ?? "#E5E7EB"}33`,
                position: "relative", transition: "transform 0.15s",
              }}
              onMouseOver={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseOut={e => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {n.new && (
                <div style={{
                  position: "absolute", top: 10, right: 10,
                  width: 8, height: 8, borderRadius: "50%", background: "#FF6B6B",
                  boxShadow: "0 0 0 2px rgba(255,107,107,0.3)",
                }} />
              )}
              <div style={{ fontSize: 24, marginBottom: 8 }}>{n.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E", marginBottom: 4 }}>{n.title}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{n.type} · {n.size}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Progress */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #F3F4F6" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#1A1A2E", marginBottom: 16 }}>My Progress</div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {/* Ring */}
            <div style={{ flexShrink: 0, textAlign: "center" }}>
              <svg viewBox="0 0 80 80" width={80} height={80}>
                <circle cx="40" cy="40" r="30" fill="none" stroke="#FFF0E8" strokeWidth="8" />
                <circle cx="40" cy="40" r="30" fill="none" stroke="#FF6B6B" strokeWidth="8"
                  strokeDasharray={`${(attendancePct / 100) * 188.5} 188.5`}
                  strokeLinecap="round" transform="rotate(-90 40 40)"
                  style={{ transition: "stroke-dasharray 1.5s ease" }}
                />
                <text x="40" y="45" textAnchor="middle" fill="#FF6B6B" fontSize="13" fontWeight="700">
                  {attendancePct}%
                </text>
              </svg>
              <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, marginTop: 4 }}>Attendance</div>
            </div>
            {/* Bars */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {progressBars.map((b) => (
                <div key={b.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#4B5563" }}>{b.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: b.color }}>{b.pct}%</span>
                  </div>
                  <div style={{ height: 6, background: "#F3F4F6", borderRadius: 99 }}>
                    <div style={{ height: 6, width: `${b.pct}%`, background: b.color, borderRadius: 99, transition: "width 1s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Exam */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #F3F4F6" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#1A1A2E", marginBottom: 16 }}>Upcoming Exam</div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{
              background: "linear-gradient(135deg, #FF6B6B, #FFB347)",
              borderRadius: 14, padding: "12px 16px", textAlign: "center", flexShrink: 0,
              boxShadow: "0 4px 16px rgba(255,107,107,0.3)",
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.8)", letterSpacing: "0.1em" }}>FEB</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1 }}>08</div>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#1A1A2E" }}>Level 5 Mid-Term</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>10:00 AM · Room 2</div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6, lineHeight: 1.5 }}>
                Topics: Speed addition, 2×3 digit multiplication
              </div>
            </div>
          </div>
          <div style={{
            marginTop: 16, padding: "10px 14px", borderRadius: 10,
            background: "#FFF8EE", border: "1px solid #FFE4B0",
            fontSize: 13, color: "#D97706", fontWeight: 600,
          }}>
            🕐 19 days to prepare
          </div>
        </div>
      </div>

    </div>
  );
}