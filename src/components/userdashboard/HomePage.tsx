"use client";

import { STUDENT, ANNOUNCEMENTS, NOTES, ATTENDANCE } from "./data";
import { NavPage } from "./data";

interface HomePageProps {
  greeting: string;
  attendancePct: number;
  onNavigate: (page: NavPage) => void;
  onToast: (msg: string) => void;
}

export default function HomePage({ greeting, attendancePct, onNavigate, onToast }: HomePageProps) {
  const quickStats = [
    { icon: "✅", label: "Attendance", value: `${attendancePct}%`, sub: "Last 30 days", color: "#4ECDC4", bg: "#F0FFFE" },
    { icon: "📝", label: "Next Exam",  value: "Feb 8",             sub: "Level 5 Mid-Term",    color: "#FFB347", bg: "#FFF8EE" },
    { icon: "📚", label: "New Notes",  value: `${NOTES.filter(n => n.new).length}`, sub: "Unread materials", color: "#A78BFA", bg: "#F5F0FF" },
    { icon: "💳", label: "Fee Due",    value: "₹1,800",            sub: "Due Feb 5",            color: "#FF6B6B", bg: "#FFF0F0" },
  ];

  const progressBars = [
    { label: "Speed",    pct: 72, color: "#FF6B6B" },
    { label: "Accuracy", pct: 88, color: "#4ECDC4" },
    { label: "Oral",     pct: 65, color: "#FFB347" },
    { label: "Mental",   pct: 55, color: "#A78BFA" },
  ];

  return (
    <div className="page-content">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-left">
          <div className="welcome-tag">🌟 Student Portal</div>
          <h1 className="welcome-title">
            {greeting}, <span>{STUDENT.name.split(" ")[0]}!</span> 👋
          </h1>
          <p className="welcome-sub">
            You have <strong>{ANNOUNCEMENTS.filter(a => a.urgent).length} new announcement</strong> and your next class is <strong>today at 4:00 PM</strong>.
          </p>
        </div>
        <div className="welcome-emoji">🧮</div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        {quickStats.map((s, i) => (
          <div
            key={i}
            className="quick-stat-card"
            style={{ "--accent": s.color, "--card-bg": s.bg } as React.CSSProperties}
          >
            <div className="qs-icon">{s.icon}</div>
            <div className="qs-body">
              <div className="qs-label">{s.label}</div>
              <div className="qs-value">{s.value}</div>
              <div className="qs-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mid: Today's class + Announcements */}
      <div className="home-mid">
        {/* Today's Class */}
        <div className="dash-card">
          <div className="card-head">
            <div>
              <div className="card-title">Today's Class</div>
              <div className="card-sub">Monday · Jan 20</div>
            </div>
            <button className="card-action" onClick={() => onNavigate("schedule")}>View all →</button>
          </div>
          <div className="today-class-box">
            <div className="today-dot" />
            <div className="today-info">
              <div className="today-subject">Abacus Speed Practice</div>
              <div className="today-meta">4:00–6:00 PM · Room 2 · Mrs. Bala Tomar</div>
            </div>
            <div className="today-live">LIVE TODAY</div>
          </div>
          <div className="today-tip">💡 Tip: Practice 5-minute speed drills before class for best results!</div>
        </div>

        {/* Announcements */}
        <div className="dash-card">
          <div className="card-head">
            <div>
              <div className="card-title">Announcements</div>
              <div className="card-sub">{ANNOUNCEMENTS.length} total</div>
            </div>
            <button className="card-action" onClick={() => onNavigate("announcements")}>View all →</button>
          </div>
          {ANNOUNCEMENTS.slice(0, 3).map((a) => (
            <div key={a.id} className="ann-item" style={{ "--ann-color": a.color } as React.CSSProperties}>
              <div className="ann-dot" />
              <div className="ann-body">
                <div className="ann-title">{a.title}</div>
                <div className="ann-date">{a.date}</div>
              </div>
              {a.urgent && <div className="ann-urgent">NEW</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Notes */}
      <div className="dash-card">
        <div className="card-head">
          <div>
            <div className="card-title">Recent Study Material</div>
            <div className="card-sub">Latest uploads from your teacher</div>
          </div>
          <button className="card-action" onClick={() => onNavigate("notes")}>View all →</button>
        </div>
        <div className="notes-row">
          {NOTES.slice(0, 3).map((n) => (
            <div
              key={n.id}
              className="note-mini"
              style={{ "--note-color": n.color } as React.CSSProperties}
              onClick={() => onToast(`Opening "${n.title}"…`)}
            >
              <div className="note-mini-emoji">{n.emoji}</div>
              <div className="note-mini-name">{n.title}</div>
              <div className="note-mini-meta">{n.type} · {n.size}</div>
              {n.new && <div className="note-new-dot" />}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: Progress + Upcoming Exam */}
      <div className="home-bottom">
        {/* Progress */}
        <div className="dash-card progress-card">
          <div className="card-title" style={{ marginBottom: 18 }}>My Progress</div>
          <div className="progress-row">
            <div className="progress-ring-wrap">
              <svg viewBox="0 0 80 80" className="progress-svg">
                <circle cx="40" cy="40" r="30" fill="none" stroke="#FFF0E8" strokeWidth="8" />
                <circle
                  cx="40" cy="40" r="30" fill="none" stroke="#FF6B6B" strokeWidth="8"
                  strokeDasharray={`${(attendancePct / 100) * 188} 188`}
                  strokeLinecap="round" transform="rotate(-90 40 40)"
                  style={{ transition: "stroke-dasharray 1.5s cubic-bezier(.4,0,.2,1)" }}
                />
                <text x="40" y="44" textAnchor="middle" fill="#FF6B6B" fontSize="13" fontWeight="700">
                  {attendancePct}%
                </text>
              </svg>
              <div className="ring-label">Attendance</div>
            </div>
            <div className="progress-bars">
              {progressBars.map((b) => (
                <div key={b.label} className="prog-bar-row">
                  <span className="prog-bar-label">{b.label}</span>
                  <div className="prog-bar-track">
                    <div className="prog-bar-fill" style={{ width: `${b.pct}%`, background: b.color }} />
                  </div>
                  <span className="prog-bar-pct">{b.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Exam */}
        <div className="dash-card">
          <div className="card-title" style={{ marginBottom: 16 }}>Upcoming Exam</div>
          <div className="exam-card-inner">
            <div className="exam-date-badge">
              <div className="exam-month">FEB</div>
              <div className="exam-day">08</div>
            </div>
            <div className="exam-info">
              <div className="exam-name">Level 5 Mid-Term</div>
              <div className="exam-meta">10:00 AM · Room 2</div>
              <div className="exam-topics">Topics: Speed addition, 2×3 digit multiplication</div>
            </div>
          </div>
          <div className="exam-days-left">
            <span>🕐</span> 19 days to prepare
          </div>
        </div>
      </div>
    </div>
  );
}