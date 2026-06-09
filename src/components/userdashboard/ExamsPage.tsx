"use client";

// src/components/userdashboard/ExamsPage.tsx
// Renders INSIDE the dashboard layout's <main> — no full-page wrapper, no vh heights

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, BookOpen, Calendar, Clock, AlertCircle, Download } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Exam = {
  id: string;
  examName: string;
  description?: string | null;
  examStartDate?: string | null;
  examEndDate?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  program?: { name: string } | null;
  level?: { name: string } | null;
};

type ExamStatus = "upcoming" | "ongoing" | "completed" | "unknown";
type FilterType = "all" | ExamStatus;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatus(exam: Exam): ExamStatus {
  if (!exam.examStartDate) return "unknown";
  const now   = new Date();
  const start = new Date(exam.examStartDate);
  const end   = exam.examEndDate ? new Date(exam.examEndDate) : null;
  if (now < start) return "upcoming";
  if (end && now <= end) return "ongoing";
  return "completed";
}

function fmt(iso: string) {
  const d = new Date(iso);
  return {
    day:   d.getDate(),
    month: d.toLocaleString("en-IN", { month: "short" }).toUpperCase(),
    full:  d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    time:  d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  };
}

const S: Record<ExamStatus, { label: string; color: string; icon: string }> = {
  upcoming:  { label: "Upcoming",  color: "#FFB347", icon: "📅" },
  ongoing:   { label: "Live Now",  color: "#4ECDC4", icon: "🟢" },
  completed: { label: "Completed", color: "#A78BFA", icon: "✅" },
  unknown:   { label: "TBD",       color: "#BBBBBB", icon: "❓" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusPill({ status }: { status: ExamStatus }) {
  const c = S[status];
  return (
    <span style={{
      padding: "3px 11px", borderRadius: 50,
      background: c.color + "1A", color: c.color,
      fontSize: 11, fontWeight: 800, letterSpacing: "0.04em",
      display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0,
    }}>
      {c.icon} {c.label}
    </span>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 18, padding: "16px 20px",
      border: "1px solid #FFF0E8", boxShadow: "0 4px 16px rgba(255,107,107,0.05)",
      display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 13,
        background: color + "1A", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: 20, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#1A1A2E", fontFamily: "'Poppins', sans-serif" }}>{value}</div>
        <div style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  );
}

function FilterTab({ label, active, count, color, onClick }: {
  label: string; active: boolean; count: number; color: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 16px", borderRadius: 50,
      background: active ? `linear-gradient(135deg,${color},${color}BB)` : "#fff",
      color: active ? "#fff" : "#888",
      border: `1.5px solid ${active ? "transparent" : "#EEE"}`,
      fontWeight: 800, fontSize: 12, cursor: "pointer",
      fontFamily: "inherit", transition: "all 0.18s",
      display: "inline-flex", alignItems: "center", gap: 6,
      boxShadow: active ? `0 4px 12px ${color}44` : "none",
    }}>
      {label}
      <span style={{
        background: active ? "rgba(255,255,255,0.25)" : color + "1A",
        color: active ? "#fff" : color,
        borderRadius: 50, padding: "1px 7px", fontSize: 10, fontWeight: 900,
      }}>{count}</span>
    </button>
  );
}

function ExamCard({ exam }: { exam: Exam }) {
  const status = getStatus(exam);
  const c      = S[status];
  const start  = exam.examStartDate ? fmt(exam.examStartDate) : null;
  const end    = exam.examEndDate   ? fmt(exam.examEndDate)   : null;

  return (
    <div
      style={{
        background: "#fff", borderRadius: 20, padding: "20px 22px",
        border: `1.5px solid ${status === "ongoing" ? "#4ECDC444" : "#F0F0F0"}`,
        boxShadow: status === "ongoing"
          ? "0 6px 28px rgba(78,205,196,0.12)"
          : "0 2px 12px rgba(0,0,0,0.04)",
        display: "flex", alignItems: "flex-start", gap: 16,
        position: "relative", overflow: "hidden",
        transition: "transform 0.18s, box-shadow 0.18s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform  = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(255,107,107,0.10)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform  = "";
        (e.currentTarget as HTMLElement).style.boxShadow = status === "ongoing"
          ? "0 6px 28px rgba(78,205,196,0.12)"
          : "0 2px 12px rgba(0,0,0,0.04)";
      }}
    >
      {/* blob */}
      <div style={{
        position: "absolute", top: -24, right: -24, width: 90, height: 90,
        borderRadius: "50%", background: c.color, opacity: 0.06, pointerEvents: "none",
      }} />

      {/* date box */}
      {start ? (
        <div style={{
          flexShrink: 0, width: 56, minHeight: 62, borderRadius: 14,
          background: c.color + "1A",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ fontSize: 9, fontWeight: 900, color: c.color, letterSpacing: "0.1em" }}>{start.month}</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: c.color, fontFamily: "'Poppins', sans-serif", lineHeight: 1 }}>{start.day}</div>
        </div>
      ) : (
        <div style={{
          flexShrink: 0, width: 56, height: 62, borderRadius: 14,
          background: "#F5F5F5", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 22,
        }}>📋</div>
      )}

      {/* body */}
      <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
        <div style={{
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 6,
        }}>
          <div style={{
            fontSize: 15, fontWeight: 800, color: "#1A1A2E",
            fontFamily: "'Poppins', sans-serif", lineHeight: 1.3,
          }}>{exam.examName}</div>
          <StatusPill status={status} />
        </div>

        {exam.description && (
          <div style={{ fontSize: 12, color: "#888", fontWeight: 600, marginBottom: 8, lineHeight: 1.5 }}>
            {exam.description}
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
          {start && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#999", fontWeight: 700 }}>
              <Calendar size={12} color={c.color} />{start.full}
            </span>
          )}
          {start && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#999", fontWeight: 700 }}>
              <Clock size={12} color={c.color} />
              {start.time}{end ? ` – ${end.time}` : ""}
            </span>
          )}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {exam.program?.name && (
            <span style={{ padding: "2px 9px", borderRadius: 50, background: "#FF6B6B12", color: "#FF6B6B", fontSize: 10, fontWeight: 800 }}>
              📚 {exam.program.name}
            </span>
          )}
          {exam.level?.name && (
            <span style={{ padding: "2px 9px", borderRadius: 50, background: "#4ECDC412", color: "#4ECDC4", fontSize: 10, fontWeight: 800 }}>
              🎯 {exam.level.name}
            </span>
          )}
        </div>
      </div>

      {/* download */}
      {exam.fileUrl && (
        <a
          href={exam.fileUrl} target="_blank" rel="noopener noreferrer"
          title={exam.fileName || "Download"}
          style={{
            flexShrink: 0, alignSelf: "center",
            width: 36, height: 36, borderRadius: 10,
            background: "#FF6B6B12",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#FF6B6B", textDecoration: "none", transition: "background 0.18s",
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#FF6B6B22")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "#FF6B6B12")}
        >
          <Download size={15} />
        </a>
      )}
    </div>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div style={{
      textAlign: "center", padding: "48px 24px",
      background: "#fff", borderRadius: 20, border: "1px solid #F0F0F0",
    }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>📋</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: "#1A1A2E", fontFamily: "'Poppins', sans-serif", marginBottom: 6 }}>
        {filtered ? "No Exams Match This Filter" : "No Exams Scheduled"}
      </div>
      <div style={{ fontSize: 13, color: "#999", fontWeight: 600 }}>
        {filtered ? "Try a different tab." : "Your exam schedule will appear here once published."}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExamsPage() {
  const { user, token, ready } = useAuth();
  const router = useRouter();

  const [exams,   setExams]   = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [filter,  setFilter]  = useState<FilterType>("all");

  // Auth guard — layout already handles this but kept as safety net
  useEffect(() => {
    if (ready && !user) router.push("/login");
  }, [ready, user, router]);

  // Fetch
  useEffect(() => {
    if (!ready || !token) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/exams", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        setExams(await res.json());
      } catch (e: any) {
        setError(e.message ?? "Failed to load exams");
      } finally {
        setLoading(false);
      }
    })();
  }, [ready, token]);

  // ── Loading — inline spinner, NOT a full-page takeover ──
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 12 }}>
        <Loader2 size={28} style={{ animation: "spin 1s linear infinite", color: "#FF6B6B" }} />
        <span style={{ fontWeight: 700, color: "#BBB", fontSize: 14 }}>Loading exams…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Counts ──
  const counts = exams.reduce((acc, ex) => {
    const s = getStatus(ex);
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {} as Partial<Record<ExamStatus, number>>);

  const upcoming  = counts.upcoming  ?? 0;
  const ongoing   = counts.ongoing   ?? 0;
  const completed = counts.completed ?? 0;

  const visible = filter === "all"
    ? exams
    : exams.filter(ex => getStatus(ex) === filter);

  return (
    // ⚠️  No minHeight, no background, no top padding — the layout shell owns all that
    <div style={{ display: "flex", flexDirection: "column", gap: 18, fontFamily: "'Nunito', sans-serif" }}>

      {/* ── Header ── */}
      <div style={{
        background: "#fff", borderRadius: 22, padding: "24px 28px",
        border: "1px solid #FFF0E8",
        boxShadow: "0 4px 24px rgba(255,107,107,0.07)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 16,
        flexWrap: "wrap", position: "relative", overflow: "hidden",
      }}>
        {/* decorative blob */}
        <div style={{ position: "absolute", top: -32, right: -32, width: 140, height: 140, borderRadius: "50%", background: "linear-gradient(135deg,#A78BFA,#7C3AED)", opacity: 0.07, pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16, flexShrink: 0,
            background: "linear-gradient(135deg,#A78BFA,#7C3AED)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 20px rgba(167,139,250,0.3)",
          }}>
            <BookOpen size={24} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 900, color: "#1A1A2E" }}>
              Exams & Schedule
            </div>
            <div style={{ fontSize: 12, color: "#999", fontWeight: 600, marginTop: 2 }}>
              Hi {user?.name?.split(" ")[0] ?? "there"} 👋 — your complete exam timeline
            </div>
          </div>
        </div>

        {ongoing > 0 && (
          <div style={{
            padding: "8px 16px", borderRadius: 12,
            background: "linear-gradient(135deg,#4ECDC4,#45B7AA)",
            color: "#fff", fontWeight: 800, fontSize: 12,
            boxShadow: "0 4px 12px rgba(78,205,196,0.3)",
            display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
            position: "relative", zIndex: 1,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%", background: "#fff",
              display: "inline-block", animation: "livePulse 1.4s ease infinite",
            }} />
            {ongoing} Live Now
            <style>{`@keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
          </div>
        )}
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        <StatCard icon="📅" label="Upcoming"  value={upcoming}  color="#FFB347" />
        <StatCard icon="🟢" label="Ongoing"   value={ongoing}   color="#4ECDC4" />
        <StatCard icon="✅" label="Completed" value={completed} color="#A78BFA" />
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          padding: "12px 16px", borderRadius: 12,
          display: "flex", alignItems: "center", gap: 10,
          fontWeight: 700, fontSize: 13,
          background: "#FF6B6B11", border: "1.5px solid #FF6B6B44", color: "#FF6B6B",
        }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* ── Filter tabs ── */}
      {exams.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <FilterTab label="All"       active={filter === "all"}       count={exams.length} color="#FF6B6B" onClick={() => setFilter("all")}       />
          <FilterTab label="Upcoming"  active={filter === "upcoming"}  count={upcoming}     color="#FFB347" onClick={() => setFilter("upcoming")}  />
          <FilterTab label="Ongoing"   active={filter === "ongoing"}   count={ongoing}      color="#4ECDC4" onClick={() => setFilter("ongoing")}   />
          <FilterTab label="Completed" active={filter === "completed"} count={completed}    color="#A78BFA" onClick={() => setFilter("completed")} />
        </div>
      )}

      {/* ── List ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {visible.length === 0
          ? <EmptyState filtered={filter !== "all"} />
          : visible.map(ex => <ExamCard key={ex.id} exam={ex} />)
        }
      </div>
    </div>
  );
}