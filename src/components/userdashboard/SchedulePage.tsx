"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  CalendarDays, Clock, BookOpen, User,
  Search, X, Loader2, Layers, List,
  ChevronRight, RefreshCw,
} from "lucide-react";
import { supabase } from "@/lib/helpers/supabaseClient";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ProgramLevel { id: string; name: string; sortOrder: number }
interface Program { id: string; name: string; hasLevels: boolean; levels: ProgramLevel[] }
interface ScheduleSlot {
  id: string;
  dayOfWeek: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectName: string;
  teacherName: string;
  notes?: string | null;
  program: { id: string; name: string };
  level: { id: string; name: string } | null;
}
interface StudentContext { programId: string | null; levelId: string | null }

// ── Constants ─────────────────────────────────────────────────────────────────
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT: Record<string, string> = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed",
  Thursday: "Thu", Friday: "Fri", Saturday: "Sat",
};
const PERIOD_COLORS = [
  "#FF6B6B", "#FFB347", "#4ECDC4", "#A78BFA",
  "#3B82F6", "#EC4899", "#10B981", "#F97316",
];

// ── API helpers ───────────────────────────────────────────────────────────────
async function getToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? "";
}

async function apiFetch<T>(url: string): Promise<T> {
  const token = await getToken();
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  greeting?: string;
  attendancePct?: number;
  onNavigate?: (page: string) => void;
  onToast?: (msg: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SchedulePage({ onToast }: Props) {
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [studentCtx, setStudentCtx] = useState<StudentContext>({ programId: null, levelId: null });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");
  const [dayFilter, setDayFilter] = useState("All");
  const [progFilter, setProgFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [myClassOnly, setMyClassOnly] = useState(true);

  // ── Load programs ─────────────────────────────────────────────────────────
  useEffect(() => {
    apiFetch<{ programs: Program[] }>("/api/schedule/programs")
      .then(d => setPrograms(d.programs))
      .catch(() => { });
  }, []);

  // ── Load slots ────────────────────────────────────────────────────────────
  const loadSlots = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (!myClassOnly) {
        if (progFilter) params.set("programId", progFilter);
        if (levelFilter) params.set("levelId", levelFilter);
      }
      if (dayFilter !== "All") params.set("dayOfWeek", dayFilter);
      if (search) params.set("search", search);

      const qs = params.toString();
      const data = await apiFetch<{ slots: ScheduleSlot[]; studentContext: StudentContext }>(
        `/api/schedule${qs ? `?${qs}` : ""}`
      );
      setSlots(data.slots);
      setStudentCtx(data.studentContext);

      // Default filters to student's own class on first load
      if (!progFilter && !levelFilter && data.studentContext.programId) {
        setProgFilter(data.studentContext.programId);
        setLevelFilter(data.studentContext.levelId ?? "");
      }
    } catch (e: any) {
      onToast?.("Failed to load schedule");
    }
    setLoading(false);
  }, [myClassOnly, progFilter, levelFilter, dayFilter, search, onToast]);

  useEffect(() => { loadSlots(); }, [loadSlots]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const activeProg = programs.find(p => p.id === progFilter);
  const levelOpts = activeProg?.levels ?? [];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return slots.filter(s =>
      !q ||
      s.subjectName.toLowerCase().includes(q) ||
      s.teacherName.toLowerCase().includes(q)
    );
  }, [slots, search]);

  const byDay = useMemo(() => {
    const map: Record<string, ScheduleSlot[]> = {};
    DAYS.forEach(d => { map[d] = []; });
    filtered.forEach(s => {
      if (!map[s.dayOfWeek]) map[s.dayOfWeek] = [];
      map[s.dayOfWeek].push(s);
    });
    Object.values(map).forEach(arr => arr.sort((a, b) => a.periodNumber - b.periodNumber));
    return map;
  }, [filtered]);

  const activeDays = DAYS.filter(d => byDay[d]?.length > 0);

  const maxPeriod = Math.max(filtered.reduce((m, s) => Math.max(m, s.periodNumber), 0), 6);
  const gridPeriods = Array.from({ length: maxPeriod }, (_, i) => i + 1);
  const gridDays = dayFilter === "All" ? DAYS : [dayFilter];
  const slotAt = (day: string, p: number) =>
    filtered.find(s => s.dayOfWeek === day && s.periodNumber === p);

  const isMyClass = (s: ScheduleSlot) =>
    s.program.id === studentCtx.programId &&
    (!studentCtx.levelId || s.level?.id === studentCtx.levelId);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Banner ── */}
      <div style={{
        background: "linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)",
        borderRadius: 20, padding: "24px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 8px 32px rgba(124,58,237,0.25)",
      }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.2)", borderRadius: 20,
            padding: "4px 12px", fontSize: 11, fontWeight: 700,
            color: "#fff", marginBottom: 10, letterSpacing: "0.05em",
          }}>📅 Class Schedule</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 6px" }}>
            Your Timetable
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", margin: 0 }}>
            {loading ? "Loading…" : `${filtered.length} class slot${filtered.length !== 1 ? "s" : ""} scheduled`}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ fontSize: 48, opacity: 0.85 }}>📅</div>
          <button onClick={loadSlots} style={{
            background: "rgba(255,255,255,0.2)", border: "none",
            borderRadius: 8, padding: "4px 10px", color: "#fff",
            fontSize: 11, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <RefreshCw size={11} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Total Classes", value: filtered.length, color: "#A78BFA", icon: "📋" },
          { label: "Subjects", value: new Set(filtered.map(s => s.subjectName)).size, color: "#FF6B6B", icon: "📚" },
          { label: "Teachers", value: new Set(filtered.map(s => s.teacherName)).size, color: "#4ECDC4", icon: "👩‍🏫" },
        ].map(s => (
          <div key={s.label} style={{
            background: "#fff", borderRadius: 16, padding: "16px 20px",
            border: `1px solid ${s.color}22`,
            display: "flex", alignItems: "center", gap: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontSize: 24 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Controls ── */}
      <div style={{
        background: "#fff", borderRadius: 16, padding: 16,
        display: "flex", flexDirection: "column", gap: 12,
        border: "1px solid #F3F4F6", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>

        {/* Row 1: My class toggle + view switcher */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          {/* My class toggle */}
          <button
            onClick={() => setMyClassOnly(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 12, border: "none", cursor: "pointer",
              background: myClassOnly ? "linear-gradient(135deg,#A78BFA,#7C3AED)" : "#F3F4F6",
              color: myClassOnly ? "#fff" : "#6B7280",
              fontWeight: 700, fontSize: 13, transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 16 }}>🎓</span>
            My Class Only
          </button>

          {/* View switcher */}
          <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 10, padding: 3, gap: 3 }}>
            {(["list", "grid"] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                background: view === v ? "#fff" : "transparent",
                color: view === v ? "#7C3AED" : "#9CA3AF",
                fontWeight: 700, fontSize: 12,
                boxShadow: view === v ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                {v === "list" ? <List size={13} /> : <Layers size={13} />}
                {v === "list" ? "List" : "Grid"}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Filters (only when not "my class only") */}
        {!myClassOnly && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select
              value={progFilter}
              onChange={e => { setProgFilter(e.target.value); setLevelFilter(""); }}
              style={{
                border: "1.5px solid #F0EEF8", borderRadius: 10, padding: "9px 14px",
                fontSize: 13, fontWeight: 600, color: "#4B5563",
                background: "#FFFDF7", outline: "none", cursor: "pointer",
              }}
            >
              <option value="">All Programs</option>
              {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>

            {levelOpts.length > 0 && (
              <select
                value={levelFilter}
                onChange={e => setLevelFilter(e.target.value)}
                style={{
                  border: "1.5px solid #F0EEF8", borderRadius: 10, padding: "9px 14px",
                  fontSize: 13, fontWeight: 600, color: "#4B5563",
                  background: "#FFFDF7", outline: "none", cursor: "pointer",
                }}
              >
                <option value="">All Levels</option>
                {levelOpts.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            )}
          </div>
        )}

        {/* Row 3: Search + day pills */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search subject or teacher…"
              style={{
                width: "100%", paddingLeft: 36, paddingRight: search ? 32 : 12,
                paddingTop: 9, paddingBottom: 9,
                border: "1.5px solid #F0EEF8", borderRadius: 10,
                fontSize: 13, fontWeight: 600, color: "#1A1A2E",
                outline: "none", background: "#FFFDF7", boxSizing: "border-box",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "#9CA3AF",
                display: "flex", alignItems: "center",
              }}><X size={13} /></button>
            )}
          </div>
        </div>

        {/* Day pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["All", ...DAYS].map(d => (
            <button key={d} onClick={() => setDayFilter(d)} style={{
              padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer",
              background: dayFilter === d ? "#7C3AED" : "#F3F4F6",
              color: dayFilter === d ? "#fff" : "#6B7280",
              fontSize: 11, fontWeight: 700,
              boxShadow: dayFilter === d ? "0 4px 12px rgba(124,58,237,0.3)" : "none",
              transition: "all 0.15s",
            }}>
              {d === "All" ? "All Days" : DAY_SHORT[d]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 240, gap: 12 }}>
          <Loader2 size={32} style={{ color: "#A78BFA", animation: "spin 1s linear infinite" }} />
          <p style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF" }}>Loading schedule…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          background: "#fff", borderRadius: 16, padding: "56px 32px",
          textAlign: "center", border: "1px solid #F3F4F6",
        }}>
          <CalendarDays size={36} style={{ color: "#E5E7EB", margin: "0 auto 12px" }} />
          <p style={{ fontSize: 15, fontWeight: 800, color: "#1A1A2E" }}>No classes found</p>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>Try a different day or clear your filters</p>
        </div>

      ) : view === "list" ? (

        /* ── LIST VIEW ── */
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {(dayFilter === "All" ? activeDays : [dayFilter]).map(day => {
            const daySlots = byDay[day];
            if (!daySlots?.length) return null;
            return (
              <div key={day}>
                {/* Day header */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
                }}>
                  <div style={{
                    background: "linear-gradient(135deg,#A78BFA,#7C3AED)",
                    borderRadius: 10, padding: "4px 14px",
                    fontSize: 12, fontWeight: 900, color: "#fff",
                  }}>{day}</div>
                  <div style={{ flex: 1, height: 1, background: "#F3F4F6" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF" }}>
                    {daySlots.length} class{daySlots.length !== 1 ? "es" : ""}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {daySlots.map(slot => {
                    const color = PERIOD_COLORS[(slot.periodNumber - 1) % PERIOD_COLORS.length];
                    const mine = isMyClass(slot);
                    return (
                      <div key={slot.id} style={{
                        background: "#fff",
                        borderRadius: 14,
                        border: `1.5px solid ${mine ? color + "44" : "#F3F4F6"}`,
                        display: "flex", overflow: "hidden",
                        boxShadow: mine ? `0 4px 16px ${color}18` : "0 2px 8px rgba(0,0,0,0.04)",
                      }}>
                        {/* Color strip */}
                        <div style={{ width: 5, background: color, flexShrink: 0 }} />

                        {/* Period number */}
                        <div style={{
                          width: 52, display: "flex", flexDirection: "column",
                          alignItems: "center", justifyContent: "center",
                          padding: "14px 8px", background: `${color}10`, flexShrink: 0,
                        }}>
                          <div style={{ fontSize: 11, fontWeight: 900, color, lineHeight: 1 }}>P</div>
                          <div style={{ fontSize: 20, fontWeight: 900, color, lineHeight: 1 }}>{slot.periodNumber}</div>
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, padding: "14px 16px", minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 14, fontWeight: 800, color: "#1A1A2E" }}>{slot.subjectName}</span>
                                {mine && (
                                  <span style={{
                                    fontSize: 9, fontWeight: 800, padding: "2px 8px",
                                    borderRadius: 20, background: `${color}20`,
                                    color, border: `1px solid ${color}44`,
                                    textTransform: "uppercase", letterSpacing: "0.05em",
                                  }}>My Class</span>
                                )}
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6B7280", fontWeight: 600 }}>
                                  <User size={11} style={{ color: "#9CA3AF" }} /> {slot.teacherName}
                                </span>
                                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6B7280", fontWeight: 600 }}>
                                  <Clock size={11} style={{ color: "#9CA3AF" }} /> {slot.startTime}–{slot.endTime}
                                </span>
                                {slot.level && (
                                  <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF" }}>
                                    {slot.program.name} · {slot.level.name}
                                  </span>
                                )}
                              </div>
                              {slot.notes && (
                                <p style={{
                                  fontSize: 11, color: "#9CA3AF", marginTop: 6,
                                  paddingLeft: 8, borderLeft: `2px solid ${color}50`,
                                  fontStyle: "italic",
                                }}>{slot.notes}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      ) : (

        /* ── GRID VIEW ── */
        <div style={{
          background: "#fff", borderRadius: 16, overflow: "hidden",
          border: "1px solid #F3F4F6", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{ background: "#7C3AED", color: "#fff", padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", minWidth: 60 }}>
                    Period
                  </th>
                  {gridDays.map(d => (
                    <th key={d} style={{ background: "#7C3AED", color: "#fff", padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", minWidth: 140 }}>
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gridPeriods.map(p => (
                  <tr key={p} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "10px 16px", fontWeight: 900, color: "#A78BFA", fontSize: 13, background: "#FAFAFA" }}>
                      P{p}
                    </td>
                   {gridDays.map(d => {
                      const s = slotAt(d, p);
                      const color = s ? PERIOD_COLORS[(s.periodNumber - 1) % PERIOD_COLORS.length] : null;
                      const mine = s ? isMyClass(s) : false;
                      return (
                        <td key={d} style={{ padding: "8px 10px" }}>
                          {s ? (
                            <div
                              style={{
                                borderRadius: 10,
                                padding: "10px 12px",
                                background: `${color}12`,
                                border: `1.5px solid ${mine ? color + "55" : color + "22"}`,
                              }}
                            >
                              <p style={{ fontWeight: 800, fontSize: 12, color: color ?? undefined, marginBottom: 2 }}>
                                {s.subjectName}
                              </p>
                              <p style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>
                                {s.teacherName}
                              </p>
                              <p style={{ fontSize: 10, color: "#9CA3AF" }}>
                                {s.startTime}–{s.endTime}
                              </p>
                              {mine && (
                                <div style={{
                                  marginTop: 4, fontSize: 9, fontWeight: 800,
                                  color: color ?? undefined,
                                  textTransform: "uppercase", letterSpacing: "0.05em",
                                }}>
                                  ● My Class
                                </div>
                              )}
                            </div>
                          ) : (
                            <div style={{
                              borderRadius: 10, padding: "10px 12px",
                              border: "1.5px dashed #F0EEF8",
                              display: "flex", alignItems: "center",
                              justifyContent: "center", minHeight: 52,
                            }}>
                              <span style={{ fontSize: 10, color: "#D1D5DB", fontWeight: 700 }}>
                                Free
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      )}
    </div>
  );
}