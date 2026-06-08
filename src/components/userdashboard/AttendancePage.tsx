// // src/components/userdashboard/AttendancePage.tsx
// "use client";

// import { ATTENDANCE } from "./data";

// interface Props { attendancePct?: number }

// export default function AttendancePage({ attendancePct = 82 }: Props) {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 800 }}>
//       <div style={{ fontSize: 20, fontWeight: 900, color: "#1A1A2E" }}>✅ Attendance</div>

//       {/* Summary */}
//       <div style={{
//         background: "linear-gradient(135deg, #4ECDC4, #44B89C)",
//         borderRadius: 16, padding: "24px 28px",
//         display: "flex", alignItems: "center", gap: 24,
//         boxShadow: "0 8px 24px rgba(78,205,196,0.3)",
//       }}>
//         <svg viewBox="0 0 80 80" width={80} height={80} style={{ flexShrink: 0 }}>
//           <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
//           <circle cx="40" cy="40" r="30" fill="none" stroke="#fff" strokeWidth="8"
//             strokeDasharray={`${(attendancePct / 100) * 188.5} 188.5`}
//             strokeLinecap="round" transform="rotate(-90 40 40)" />
//           <text x="40" y="45" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="800">
//             {attendancePct}%
//           </text>
//         </svg>
//         <div>
//           <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>Overall Attendance</div>
//           <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{attendancePct}%</div>
//           <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>Last 30 days</div>
//         </div>
//       </div>

//       {/* Log */}
//       <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #F3F4F6" }}>
//         <div style={{ fontSize: 15, fontWeight: 800, color: "#1A1A2E", marginBottom: 16 }}>Attendance Log</div>
//         <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//           {(ATTENDANCE ?? []).map((a: any, i: number) => (
//             <div key={i} style={{
//               display: "flex", alignItems: "center", justifyContent: "space-between",
//               padding: "12px 16px", borderRadius: 10, background: "#FAFAFA",
//               border: "1px solid #F3F4F6",
//             }}>
//               <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{a.date ?? `Session ${i + 1}`}</span>
//               <span style={{
//                 fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 20,
//                 background: a.present ? "#F0FDF4" : "#FFF0F0",
//                 color: a.present ? "#22C55E" : "#FF6B6B",
//                 border: `1px solid ${a.present ? "#BBF7D0" : "#FFD5D5"}`,
//               }}>
//                 {a.present ? "✓ Present" : "✗ Absent"}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }














"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  CheckCircle2, XCircle, Clock, Award, Percent,
  CalendarDays, ChevronLeft, ChevronRight,
  Loader2, AlertCircle, RefreshCw, TrendingUp,
} from "lucide-react";
import { supabase } from "@/lib/helpers/supabaseClient";

// ── Types ─────────────────────────────────────────────────────────────────────
type AttStatus = "present" | "absent" | "late" | "holiday";

interface AttRecord {
  id: string;
  date: string;
  status: AttStatus;
  note?: string | null;
}
interface Stats {
  total: number; present: number; absent: number;
  late: number; holiday: number; workingDays: number; percentage: number;
}
interface StudentInfo {
  id: string; studentId: string; fullName: string; photoUrl?: string | null;
  program?: { name: string } | null;
  programLevel?: { name: string } | null;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];
const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const STATUS_CFG: Record<AttStatus, { label: string; color: string; bg: string; Icon: any }> = {
  present: { label: "Present", color: "#4ECDC4", bg: "#F0FFFE", Icon: CheckCircle2 },
  absent:  { label: "Absent",  color: "#FF6B6B", bg: "#FFF0F0", Icon: XCircle      },
  late:    { label: "Late",    color: "#FFB347", bg: "#FFF8EE", Icon: Clock         },
  holiday: { label: "Holiday", color: "#A78BFA", bg: "#F5F0FF", Icon: Award         },
};

// ── API ───────────────────────────────────────────────────────────────────────
async function fetchAttendance(month: string) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token ?? "";
  const res = await fetch(`/api/attendance?month=${month}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ student: StudentInfo; records: AttRecord[]; stats: Stats }>;
}

// ── Mini Calendar ─────────────────────────────────────────────────────────────
function MiniCalendar({
  year, month, records,
}: {
  year: number; month: number; records: AttRecord[];
}) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay();
  const today       = new Date().toISOString().split("T")[0];

  const statusMap = useMemo(() => {
    const m: Record<string, AttStatus> = {};
    records.forEach(r => { m[r.date] = r.status; });
    return m;
  }, [records]);

  const pad  = (n: number) => String(n).padStart(2, "0");
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{
      background: "#fff", borderRadius: 20,
      border: "1px solid #F0EEF8", overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    }}>
      {/* Day headers */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7,1fr)",
        borderBottom: "1px solid #F0EEF8",
        background: "#FFFDF7",
      }}>
        {DAY_LABELS.map(d => (
          <div key={d} style={{ textAlign: "center", padding: "8px 0", fontSize: 10, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, padding: 10 }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const iso    = `${year}-${pad(month + 1)}-${pad(day)}`;
          const status = statusMap[iso];
          const cfg    = status ? STATUS_CFG[status] : null;
          const isToday = iso === today;

          return (
            <div key={idx} style={{
              aspectRatio: "1",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              borderRadius: 10, position: "relative",
              background: cfg ? cfg.bg : isToday ? "#F0FFFE" : "transparent",
              border: isToday ? "2px solid #4ECDC4" : cfg ? `1px solid ${cfg.color}33` : "1px solid transparent",
              fontSize: 12, fontWeight: cfg ? 800 : 600,
              color: cfg ? cfg.color : isToday ? "#4ECDC4" : "#4B5563",
            }}>
              {day}
              {cfg && (
                <div style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: cfg.color, position: "absolute",
                  bottom: 3,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 10,
        padding: "8px 12px", borderTop: "1px solid #F0EEF8",
        background: "#FFFDF7",
      }}>
        {(Object.entries(STATUS_CFG) as [AttStatus, typeof STATUS_CFG[AttStatus]][]).map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: v.color }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF" }}>{v.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  attendancePct?: number;
  greeting?: string;
  onNavigate?: (page: string) => void;
  onToast?: (msg: string) => void;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AttendancePage({ onToast }: Props) {
  const now = new Date();
  const [viewYear,  setViewYear]  = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());      // 0-indexed
  const [data,      setData]      = useState<{ student: StudentInfo; records: AttRecord[]; stats: Stats } | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const monthStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAttendance(monthStr);
      setData(res);
    } catch (e: any) {
      setError(e.message);
      onToast?.("Failed to load attendance");
    }
    setLoading(false);
  }, [monthStr, onToast]);

  useEffect(() => { load(); }, [load]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    const now = new Date();
    if (viewYear > now.getFullYear() || (viewYear === now.getFullYear() && viewMonth >= now.getMonth())) return;
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };
  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();

  const stats   = data?.stats;
  const records = data?.records ?? [];
  const student = data?.student;

  // Streak: consecutive present/late days from today backwards
  const streak = useMemo(() => {
    const sorted = [...records]
      .filter(r => r.status === "present" || r.status === "late")
      .sort((a, b) => b.date.localeCompare(a.date));
    let count = 0;
    let prev: string | null = null;
    for (const r of sorted) {
      if (!prev) { count = 1; prev = r.date; continue; }
      const d1 = new Date(prev);
      const d2 = new Date(r.date);
      const diff = Math.round((d1.getTime() - d2.getTime()) / 86400000);
      if (diff === 1) { count++; prev = r.date; }
      else break;
    }
    return count;
  }, [records]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Banner ── */}
      <div style={{
        background: "linear-gradient(135deg, #4ECDC4 0%, #45B7AA 100%)",
        borderRadius: 20, padding: "24px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 8px 32px rgba(78,205,196,0.3)",
      }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.2)", borderRadius: 20,
            padding: "4px 12px", fontSize: 11, fontWeight: 700,
            color: "#fff", marginBottom: 10, letterSpacing: "0.05em",
          }}>✅ Attendance</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 4px" }}>
            My Attendance
          </h1>
          {student && (
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", margin: 0 }}>
              {student.fullName} · {student.program?.name ?? ""}
              {student.programLevel ? ` · ${student.programLevel.name}` : ""}
            </p>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          {stats && (
            <div style={{
              background: "rgba(255,255,255,0.2)", borderRadius: 14,
              padding: "10px 18px", textAlign: "center",
            }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                {stats.percentage}%
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
                Attendance
              </div>
            </div>
          )}
          <button onClick={load} style={{
            background: "rgba(255,255,255,0.2)", border: "none",
            borderRadius: 8, padding: "4px 10px", color: "#fff",
            fontSize: 11, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <RefreshCw size={11} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Attendance % bar + warning ── */}
      {stats && (
        <div style={{
          background: "#fff", borderRadius: 16, padding: "18px 20px",
          border: "1px solid #F3F4F6", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#1A1A2E" }}>Overall Attendance Rate</span>
            <span style={{
              fontSize: 16, fontWeight: 900,
              color: stats.percentage >= 75 ? "#4ECDC4" : "#FF6B6B",
            }}>{stats.percentage}%</span>
          </div>
          <div style={{ height: 10, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 99,
              width: `${stats.percentage}%`,
              background: stats.percentage >= 75
                ? "linear-gradient(90deg,#4ECDC4,#45B7AA)"
                : "linear-gradient(90deg,#FF6B6B,#FFB347)",
              transition: "width 1s ease",
            }} />
          </div>
          {stats.percentage < 75 && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              marginTop: 8, padding: "8px 12px", borderRadius: 10,
              background: "#FFF0F0", border: "1px solid #FF6B6B33",
            }}>
              <AlertCircle size={13} style={{ color: "#FF6B6B", flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#FF6B6B" }}>
                Below 75% — you need {Math.ceil((0.75 * stats.workingDays - (stats.present + stats.late)) / (1 - 0.75))} more present days to reach 75%
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {stats && [
          { label: "Working Days", value: stats.workingDays, color: "#1A1A2E", bg: "#F9FAFB", icon: "📋" },
          { label: "Present",      value: stats.present,     color: "#4ECDC4", bg: "#F0FFFE", icon: "✅" },
          { label: "Absent",       value: stats.absent,      color: "#FF6B6B", bg: "#FFF0F0", icon: "❌" },
          { label: "Late",         value: stats.late,        color: "#FFB347", bg: "#FFF8EE", icon: "⏰" },
          { label: "Holidays",     value: stats.holiday,     color: "#A78BFA", bg: "#F5F0FF", icon: "🎉" },
          { label: "Streak",       value: streak,            color: "#FF6B6B", bg: "#FFF0F0", icon: "🔥" },
        ].map(s => (
          <div key={s.label} style={{
            background: s.bg, borderRadius: 14,
            padding: "14px 16px", border: `1px solid ${s.color}22`,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{ fontSize: 22 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Month navigator + calendar ── */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1px solid #F3F4F6", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>

        {/* Month nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <button onClick={prevMonth} style={{
            width: 36, height: 36, borderRadius: 10, border: "1.5px solid #F0EEF8",
            background: "#FAFAFA", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280",
          }}><ChevronLeft size={16} /></button>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#1A1A2E" }}>
              {MONTHS[viewMonth]} {viewYear}
            </div>
            {isCurrentMonth && (
              <div style={{ fontSize: 11, fontWeight: 700, color: "#4ECDC4" }}>Current Month</div>
            )}
          </div>

          <button onClick={nextMonth} disabled={isCurrentMonth} style={{
            width: 36, height: 36, borderRadius: 10, border: "1.5px solid #F0EEF8",
            background: isCurrentMonth ? "#F9FAFB" : "#FAFAFA",
            cursor: isCurrentMonth ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: isCurrentMonth ? "#D1D5DB" : "#6B7280",
          }}><ChevronRight size={16} /></button>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
            <Loader2 size={28} style={{ color: "#4ECDC4", animation: "spin 1s linear infinite" }} />
          </div>
        ) : (
          <MiniCalendar year={viewYear} month={viewMonth} records={records} />
        )}
      </div>

      {/* ── Day-by-day list ── */}
      {!loading && records.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", background: "#FFFDF7" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#1A1A2E" }}>
              Daily Record — {MONTHS[viewMonth]} {viewYear}
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{records.length} entries</div>
          </div>
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            {records.map(r => {
              const cfg = STATUS_CFG[r.status];
              const Icon = cfg.Icon;
              return (
                <div key={r.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 20px", borderBottom: "1px solid #F9FAFB",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Icon size={16} style={{ color: cfg.color }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E" }}>
                        {new Date(r.date + "T00:00:00").toLocaleDateString("en-IN", {
                          weekday: "short", day: "2-digit", month: "short",
                        })}
                      </div>
                      {r.note && (
                        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1, fontStyle: "italic" }}>{r.note}</div>
                      )}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 800, textTransform: "uppercase",
                    letterSpacing: "0.06em", padding: "4px 12px", borderRadius: 20,
                    background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33`,
                  }}>{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && records.length === 0 && !error && (
        <div style={{
          background: "#fff", borderRadius: 16, padding: "48px 32px",
          textAlign: "center", border: "1px solid #F3F4F6",
        }}>
          <CalendarDays size={36} style={{ color: "#E5E7EB", margin: "0 auto 12px" }} />
          <p style={{ fontSize: 15, fontWeight: 800, color: "#1A1A2E" }}>No records this month</p>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>Your attendance for {MONTHS[viewMonth]} hasn't been recorded yet</p>
        </div>
      )}
    </div>
  );
}