// "use client";

// import { useState, useEffect, useCallback, useMemo } from "react";
// import {
//   CalendarDays, Clock, BookOpen, User,
//   Search, X, Loader2, Layers, List,
//   ChevronRight, RefreshCw,
// } from "lucide-react";
// import { supabase } from "@/lib/helpers/supabaseClient";

// // ── Types ─────────────────────────────────────────────────────────────────────
// interface ProgramLevel { id: string; name: string; sortOrder: number }
// interface Program { id: string; name: string; hasLevels: boolean; levels: ProgramLevel[] }
// interface ScheduleSlot {
//   id: string;
//   dayOfWeek: string;
//   periodNumber: number;
//   startTime: string;
//   endTime: string;
//   subjectName: string;
//   teacherName: string;
//   notes?: string | null;
//   program: { id: string; name: string };
//   level: { id: string; name: string } | null;
// }
// interface StudentContext { programId: string | null; levelId: string | null }

// // ── Constants ─────────────────────────────────────────────────────────────────
// const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// const DAY_SHORT: Record<string, string> = {
//   Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed",
//   Thursday: "Thu", Friday: "Fri", Saturday: "Sat",
// };
// const PERIOD_COLORS = [
//   "#FF6B6B", "#FFB347", "#4ECDC4", "#A78BFA",
//   "#3B82F6", "#EC4899", "#10B981", "#F97316",
// ];

// // ── API helpers ───────────────────────────────────────────────────────────────
// async function getToken() {
//   const { data } = await supabase.auth.getSession();
//   return data.session?.access_token ?? "";
// }

// async function apiFetch<T>(url: string): Promise<T> {
//   const token = await getToken();
//   const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json();
// }

// // ── Props ─────────────────────────────────────────────────────────────────────
// interface Props {
//   greeting?: string;
//   attendancePct?: number;
//   onNavigate?: (page: string) => void;
//   onToast?: (msg: string) => void;
// }

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function SchedulePage({ onToast }: Props) {
//   const [slots, setSlots] = useState<ScheduleSlot[]>([]);
//   const [programs, setPrograms] = useState<Program[]>([]);
//   const [studentCtx, setStudentCtx] = useState<StudentContext>({ programId: null, levelId: null });
//   const [loading, setLoading] = useState(true);
//   const [view, setView] = useState<"list" | "grid">("list");
//   const [search, setSearch] = useState("");
//   const [dayFilter, setDayFilter] = useState("All");
//   const [progFilter, setProgFilter] = useState("");
//   const [levelFilter, setLevelFilter] = useState("");
//   const [myClassOnly, setMyClassOnly] = useState(true);

//   // ── Load programs ─────────────────────────────────────────────────────────
//   useEffect(() => {
//     apiFetch<{ programs: Program[] }>("/api/schedule/programs")
//       .then(d => setPrograms(d.programs))
//       .catch(() => { });
//   }, []);

//   // ── Load slots ────────────────────────────────────────────────────────────
//   const loadSlots = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (!myClassOnly) {
//         if (progFilter) params.set("programId", progFilter);
//         if (levelFilter) params.set("levelId", levelFilter);
//       }
//       if (dayFilter !== "All") params.set("dayOfWeek", dayFilter);
//       if (search) params.set("search", search);

//       const qs = params.toString();
//       const data = await apiFetch<{ slots: ScheduleSlot[]; studentContext: StudentContext }>(
//         `/api/schedule${qs ? `?${qs}` : ""}`
//       );
//       setSlots(data.slots);
//       setStudentCtx(data.studentContext);

//       // Default filters to student's own class on first load
//       if (!progFilter && !levelFilter && data.studentContext.programId) {
//         setProgFilter(data.studentContext.programId);
//         setLevelFilter(data.studentContext.levelId ?? "");
//       }
//     } catch (e: any) {
//       onToast?.("Failed to load schedule");
//     }
//     setLoading(false);
//   }, [myClassOnly, progFilter, levelFilter, dayFilter, search, onToast]);

//   useEffect(() => { loadSlots(); }, [loadSlots]);

//   // ── Derived ───────────────────────────────────────────────────────────────
//   const activeProg = programs.find(p => p.id === progFilter);
//   const levelOpts = activeProg?.levels ?? [];

//   const filtered = useMemo(() => {
//     const q = search.toLowerCase();
//     return slots.filter(s =>
//       !q ||
//       s.subjectName.toLowerCase().includes(q) ||
//       s.teacherName.toLowerCase().includes(q)
//     );
//   }, [slots, search]);

//   const byDay = useMemo(() => {
//     const map: Record<string, ScheduleSlot[]> = {};
//     DAYS.forEach(d => { map[d] = []; });
//     filtered.forEach(s => {
//       if (!map[s.dayOfWeek]) map[s.dayOfWeek] = [];
//       map[s.dayOfWeek].push(s);
//     });
//     Object.values(map).forEach(arr => arr.sort((a, b) => a.periodNumber - b.periodNumber));
//     return map;
//   }, [filtered]);

//   const activeDays = DAYS.filter(d => byDay[d]?.length > 0);

//   const maxPeriod = Math.max(filtered.reduce((m, s) => Math.max(m, s.periodNumber), 0), 6);
//   const gridPeriods = Array.from({ length: maxPeriod }, (_, i) => i + 1);
//   const gridDays = dayFilter === "All" ? DAYS : [dayFilter];
//   const slotAt = (day: string, p: number) =>
//     filtered.find(s => s.dayOfWeek === day && s.periodNumber === p);

//   const isMyClass = (s: ScheduleSlot) =>
//     s.program.id === studentCtx.programId &&
//     (!studentCtx.levelId || s.level?.id === studentCtx.levelId);

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

//       {/* ── Banner ── */}
//       <div style={{
//         background: "linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)",
//         borderRadius: 20, padding: "24px 28px",
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//         boxShadow: "0 8px 32px rgba(124,58,237,0.25)",
//       }}>
//         <div>
//           <div style={{
//             display: "inline-flex", alignItems: "center", gap: 6,
//             background: "rgba(255,255,255,0.2)", borderRadius: 20,
//             padding: "4px 12px", fontSize: 11, fontWeight: 700,
//             color: "#fff", marginBottom: 10, letterSpacing: "0.05em",
//           }}>📅 Class Schedule</div>
//           <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 6px" }}>
//             Your Timetable
//           </h1>
//           <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", margin: 0 }}>
//             {loading ? "Loading…" : `${filtered.length} class slot${filtered.length !== 1 ? "s" : ""} scheduled`}
//           </p>
//         </div>
//         <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
//           <div style={{ fontSize: 48, opacity: 0.85 }}>📅</div>
//           <button onClick={loadSlots} style={{
//             background: "rgba(255,255,255,0.2)", border: "none",
//             borderRadius: 8, padding: "4px 10px", color: "#fff",
//             fontSize: 11, fontWeight: 700, cursor: "pointer",
//             display: "flex", alignItems: "center", gap: 4,
//           }}>
//             <RefreshCw size={11} /> Refresh
//           </button>
//         </div>
//       </div>

//       {/* ── Stats ── */}
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
//         {[
//           { label: "Total Classes", value: filtered.length, color: "#A78BFA", icon: "📋" },
//           { label: "Subjects", value: new Set(filtered.map(s => s.subjectName)).size, color: "#FF6B6B", icon: "📚" },
//           { label: "Teachers", value: new Set(filtered.map(s => s.teacherName)).size, color: "#4ECDC4", icon: "👩‍🏫" },
//         ].map(s => (
//           <div key={s.label} style={{
//             background: "#fff", borderRadius: 16, padding: "16px 20px",
//             border: `1px solid ${s.color}22`,
//             display: "flex", alignItems: "center", gap: 12,
//             boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//           }}>
//             <div style={{ fontSize: 24 }}>{s.icon}</div>
//             <div>
//               <div style={{ fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
//               <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{s.label}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ── Controls ── */}
//       <div style={{
//         background: "#fff", borderRadius: 16, padding: 16,
//         display: "flex", flexDirection: "column", gap: 12,
//         border: "1px solid #F3F4F6", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//       }}>

//         {/* Row 1: My class toggle + view switcher */}
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
//           {/* My class toggle */}
//           <button
//             onClick={() => setMyClassOnly(v => !v)}
//             style={{
//               display: "flex", alignItems: "center", gap: 8,
//               padding: "8px 16px", borderRadius: 12, border: "none", cursor: "pointer",
//               background: myClassOnly ? "linear-gradient(135deg,#A78BFA,#7C3AED)" : "#F3F4F6",
//               color: myClassOnly ? "#fff" : "#6B7280",
//               fontWeight: 700, fontSize: 13, transition: "all 0.2s",
//             }}
//           >
//             <span style={{ fontSize: 16 }}>🎓</span>
//             My Class Only
//           </button>

//           {/* View switcher */}
//           <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 10, padding: 3, gap: 3 }}>
//             {(["list", "grid"] as const).map(v => (
//               <button key={v} onClick={() => setView(v)} style={{
//                 padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer",
//                 background: view === v ? "#fff" : "transparent",
//                 color: view === v ? "#7C3AED" : "#9CA3AF",
//                 fontWeight: 700, fontSize: 12,
//                 boxShadow: view === v ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
//                 display: "flex", alignItems: "center", gap: 5,
//               }}>
//                 {v === "list" ? <List size={13} /> : <Layers size={13} />}
//                 {v === "list" ? "List" : "Grid"}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Row 2: Filters (only when not "my class only") */}
//         {!myClassOnly && (
//           <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//             <select
//               value={progFilter}
//               onChange={e => { setProgFilter(e.target.value); setLevelFilter(""); }}
//               style={{
//                 border: "1.5px solid #F0EEF8", borderRadius: 10, padding: "9px 14px",
//                 fontSize: 13, fontWeight: 600, color: "#4B5563",
//                 background: "#FFFDF7", outline: "none", cursor: "pointer",
//               }}
//             >
//               <option value="">All Programs</option>
//               {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
//             </select>

//             {levelOpts.length > 0 && (
//               <select
//                 value={levelFilter}
//                 onChange={e => setLevelFilter(e.target.value)}
//                 style={{
//                   border: "1.5px solid #F0EEF8", borderRadius: 10, padding: "9px 14px",
//                   fontSize: 13, fontWeight: 600, color: "#4B5563",
//                   background: "#FFFDF7", outline: "none", cursor: "pointer",
//                 }}
//               >
//                 <option value="">All Levels</option>
//                 {levelOpts.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
//               </select>
//             )}
//           </div>
//         )}

//         {/* Row 3: Search + day pills */}
//         <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
//           <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
//             <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
//             <input
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               placeholder="Search subject or teacher…"
//               style={{
//                 width: "100%", paddingLeft: 36, paddingRight: search ? 32 : 12,
//                 paddingTop: 9, paddingBottom: 9,
//                 border: "1.5px solid #F0EEF8", borderRadius: 10,
//                 fontSize: 13, fontWeight: 600, color: "#1A1A2E",
//                 outline: "none", background: "#FFFDF7", boxSizing: "border-box",
//               }}
//             />
//             {search && (
//               <button onClick={() => setSearch("")} style={{
//                 position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
//                 background: "none", border: "none", cursor: "pointer", color: "#9CA3AF",
//                 display: "flex", alignItems: "center",
//               }}><X size={13} /></button>
//             )}
//           </div>
//         </div>

//         {/* Day pills */}
//         <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//           {["All", ...DAYS].map(d => (
//             <button key={d} onClick={() => setDayFilter(d)} style={{
//               padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer",
//               background: dayFilter === d ? "#7C3AED" : "#F3F4F6",
//               color: dayFilter === d ? "#fff" : "#6B7280",
//               fontSize: 11, fontWeight: 700,
//               boxShadow: dayFilter === d ? "0 4px 12px rgba(124,58,237,0.3)" : "none",
//               transition: "all 0.15s",
//             }}>
//               {d === "All" ? "All Days" : DAY_SHORT[d]}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ── Content ── */}
//       {loading ? (
//         <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 240, gap: 12 }}>
//           <Loader2 size={32} style={{ color: "#A78BFA", animation: "spin 1s linear infinite" }} />
//           <p style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF" }}>Loading schedule…</p>
//         </div>
//       ) : filtered.length === 0 ? (
//         <div style={{
//           background: "#fff", borderRadius: 16, padding: "56px 32px",
//           textAlign: "center", border: "1px solid #F3F4F6",
//         }}>
//           <CalendarDays size={36} style={{ color: "#E5E7EB", margin: "0 auto 12px" }} />
//           <p style={{ fontSize: 15, fontWeight: 800, color: "#1A1A2E" }}>No classes found</p>
//           <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>Try a different day or clear your filters</p>
//         </div>

//       ) : view === "list" ? (

//         /* ── LIST VIEW ── */
//         <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//           {(dayFilter === "All" ? activeDays : [dayFilter]).map(day => {
//             const daySlots = byDay[day];
//             if (!daySlots?.length) return null;
//             return (
//               <div key={day}>
//                 {/* Day header */}
//                 <div style={{
//                   display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
//                 }}>
//                   <div style={{
//                     background: "linear-gradient(135deg,#A78BFA,#7C3AED)",
//                     borderRadius: 10, padding: "4px 14px",
//                     fontSize: 12, fontWeight: 900, color: "#fff",
//                   }}>{day}</div>
//                   <div style={{ flex: 1, height: 1, background: "#F3F4F6" }} />
//                   <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF" }}>
//                     {daySlots.length} class{daySlots.length !== 1 ? "es" : ""}
//                   </span>
//                 </div>

//                 <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                   {daySlots.map(slot => {
//                     const color = PERIOD_COLORS[(slot.periodNumber - 1) % PERIOD_COLORS.length];
//                     const mine = isMyClass(slot);
//                     return (
//                       <div key={slot.id} style={{
//                         background: "#fff",
//                         borderRadius: 14,
//                         border: `1.5px solid ${mine ? color + "44" : "#F3F4F6"}`,
//                         display: "flex", overflow: "hidden",
//                         boxShadow: mine ? `0 4px 16px ${color}18` : "0 2px 8px rgba(0,0,0,0.04)",
//                       }}>
//                         {/* Color strip */}
//                         <div style={{ width: 5, background: color, flexShrink: 0 }} />

//                         {/* Period number */}
//                         <div style={{
//                           width: 52, display: "flex", flexDirection: "column",
//                           alignItems: "center", justifyContent: "center",
//                           padding: "14px 8px", background: `${color}10`, flexShrink: 0,
//                         }}>
//                           <div style={{ fontSize: 11, fontWeight: 900, color, lineHeight: 1 }}>P</div>
//                           <div style={{ fontSize: 20, fontWeight: 900, color, lineHeight: 1 }}>{slot.periodNumber}</div>
//                         </div>

//                         {/* Content */}
//                         <div style={{ flex: 1, padding: "14px 16px", minWidth: 0 }}>
//                           <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
//                             <div style={{ flex: 1 }}>
//                               <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
//                                 <span style={{ fontSize: 14, fontWeight: 800, color: "#1A1A2E" }}>{slot.subjectName}</span>
//                                 {mine && (
//                                   <span style={{
//                                     fontSize: 9, fontWeight: 800, padding: "2px 8px",
//                                     borderRadius: 20, background: `${color}20`,
//                                     color, border: `1px solid ${color}44`,
//                                     textTransform: "uppercase", letterSpacing: "0.05em",
//                                   }}>My Class</span>
//                                 )}
//                               </div>
//                               <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
//                                 <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6B7280", fontWeight: 600 }}>
//                                   <User size={11} style={{ color: "#9CA3AF" }} /> {slot.teacherName}
//                                 </span>
//                                 <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6B7280", fontWeight: 600 }}>
//                                   <Clock size={11} style={{ color: "#9CA3AF" }} /> {slot.startTime}–{slot.endTime}
//                                 </span>
//                                 {slot.level && (
//                                   <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF" }}>
//                                     {slot.program.name} · {slot.level.name}
//                                   </span>
//                                 )}
//                               </div>
//                               {slot.notes && (
//                                 <p style={{
//                                   fontSize: 11, color: "#9CA3AF", marginTop: 6,
//                                   paddingLeft: 8, borderLeft: `2px solid ${color}50`,
//                                   fontStyle: "italic",
//                                 }}>{slot.notes}</p>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//       ) : (

//         /* ── GRID VIEW ── */
//         <div style={{
//           background: "#fff", borderRadius: 16, overflow: "hidden",
//           border: "1px solid #F3F4F6", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//         }}>
//           <div style={{ overflowX: "auto" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
//               <thead>
//                 <tr>
//                   <th style={{ background: "#7C3AED", color: "#fff", padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", minWidth: 60 }}>
//                     Period
//                   </th>
//                   {gridDays.map(d => (
//                     <th key={d} style={{ background: "#7C3AED", color: "#fff", padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", minWidth: 140 }}>
//                       {d}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {gridPeriods.map(p => (
//                   <tr key={p} style={{ borderBottom: "1px solid #F3F4F6" }}>
//                     <td style={{ padding: "10px 16px", fontWeight: 900, color: "#A78BFA", fontSize: 13, background: "#FAFAFA" }}>
//                       P{p}
//                     </td>
//                    {gridDays.map(d => {
//                       const s = slotAt(d, p);
//                       const color = s ? PERIOD_COLORS[(s.periodNumber - 1) % PERIOD_COLORS.length] : null;
//                       const mine = s ? isMyClass(s) : false;
//                       return (
//                         <td key={d} style={{ padding: "8px 10px" }}>
//                           {s ? (
//                             <div
//                               style={{
//                                 borderRadius: 10,
//                                 padding: "10px 12px",
//                                 background: `${color}12`,
//                                 border: `1.5px solid ${mine ? color + "55" : color + "22"}`,
//                               }}
//                             >
//                               <p style={{ fontWeight: 800, fontSize: 12, color: color ?? undefined, marginBottom: 2 }}>
//                                 {s.subjectName}
//                               </p>
//                               <p style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>
//                                 {s.teacherName}
//                               </p>
//                               <p style={{ fontSize: 10, color: "#9CA3AF" }}>
//                                 {s.startTime}–{s.endTime}
//                               </p>
//                               {mine && (
//                                 <div style={{
//                                   marginTop: 4, fontSize: 9, fontWeight: 800,
//                                   color: color ?? undefined,
//                                   textTransform: "uppercase", letterSpacing: "0.05em",
//                                 }}>
//                                   ● My Class
//                                 </div>
//                               )}
//                             </div>
//                           ) : (
//                             <div style={{
//                               borderRadius: 10, padding: "10px 12px",
//                               border: "1.5px dashed #F0EEF8",
//                               display: "flex", alignItems: "center",
//                               justifyContent: "center", minHeight: 52,
//                             }}>
//                               <span style={{ fontSize: 10, color: "#D1D5DB", fontWeight: 700 }}>
//                                 Free
//                               </span>
//                             </div>
//                           )}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//       )}
//     </div>
//   );
// }












"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  CalendarDays, Clock, BookOpen, User,
  Search, X, Loader2, Layers, List,
  RefreshCw, Download, FileText, Image as ImageIcon, Eye,
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
interface TimetableUploadItem {
  id: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
  program?: { id: string; name: string } | null;
  level?: { id: string; name: string } | null;
}

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

// ── PDF download helper (client-side print) ─────────────────────────────────
function downloadTimetablePDF(slots: ScheduleSlot[], progName?: string, levelName?: string) {
  const rows = [...slots].sort((a, b) => {
    const d = DAYS.indexOf(a.dayOfWeek) - DAYS.indexOf(b.dayOfWeek);
    return d !== 0 ? d : a.periodNumber - b.periodNumber;
  });

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>Timetable — ${progName ?? "My Schedule"}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1A1A2E; background: #fff; }
  .header { border-bottom: 3px solid #7C3AED; padding-bottom: 16px; margin-bottom: 24px; }
  h1 { font-size: 24px; font-weight: 900; color: #7C3AED; }
  .sub { color: #888; font-size: 13px; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { background: #7C3AED; color: #fff; padding: 11px 16px; text-align: left; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; }
  td { padding: 10px 16px; border-bottom: 1px solid #F0EEF8; vertical-align: middle; }
  tr:nth-child(even) td { background: #FFFDF7; }
  .period { background: #7C3AED22; color: #7C3AED; font-weight: 900; border-radius: 6px; padding: 2px 7px; font-size: 11px; }
  .subject { font-weight: 800; color: #1A1A2E; }
  .teacher { color: #888; font-size: 12px; }
  @media print { body { padding: 20px; } }
</style></head>
<body>
  <div class="header">
    <h1>📅 My Class Timetable</h1>
    <p class="sub">${progName ?? "All"}${levelName ? ` · ${levelName}` : ""} · Generated ${new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
  </div>
  <table>
    <thead>
      <tr><th>Day</th><th>Period</th><th>Time</th><th>Subject</th><th>Teacher</th><th>Notes</th></tr>
    </thead>
    <tbody>
      ${rows.map(s => `
      <tr>
        <td><strong>${s.dayOfWeek}</strong></td>
        <td><span class="period">P${s.periodNumber}</span></td>
        <td>${s.startTime}–${s.endTime}</td>
        <td><span class="subject">${s.subjectName}</span></td>
        <td class="teacher">${s.teacherName}</td>
        <td class="teacher">${s.notes ?? "—"}</td>
      </tr>`).join("")}
    </tbody>
  </table>
</body></html>`;

  const win = window.open(
    URL.createObjectURL(new Blob([html], { type: "text/html" })),
    "_blank"
  );
  if (win) setTimeout(() => win.print(), 700);
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
  const [uploads, setUploads] = useState<TimetableUploadItem[]>([]);
  const [uploadsLoading, setUploadsLoading] = useState(true);
  const [studentCtx, setStudentCtx] = useState<StudentContext>({ programId: null, levelId: null });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "grid" | "files">("list");
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

  // ── Load uploaded timetable files ────────────────────────────────────────
  const loadUploads = useCallback(async () => {
    setUploadsLoading(true);
    try {
      const params = new URLSearchParams();
      if (progFilter) params.set("programId", progFilter);
      if (levelFilter) params.set("levelId", levelFilter);
      const qs = params.toString();
      const data = await apiFetch<{ uploads: TimetableUploadItem[] }>(
        `/api/schedule/uploads${qs ? `?${qs}` : ""}`
      );
      setUploads(data.uploads);
    } catch {
      onToast?.("Failed to load uploaded files");
    }
    setUploadsLoading(false);
  }, [progFilter, levelFilter, onToast]);

  useEffect(() => { loadUploads(); }, [loadUploads]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const activeProg = programs.find(p => p.id === progFilter);
  const levelOpts = activeProg?.levels ?? [];
  const activeLevelName = levelOpts.find(l => l.id === levelFilter)?.name;

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
        flexWrap: "wrap", gap: 16,
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
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => downloadTimetablePDF(filtered, activeProg?.name, activeLevelName)}
            disabled={!filtered.length}
            style={{
              background: "rgba(255,255,255,0.2)", border: "none",
              borderRadius: 10, padding: "9px 16px", color: "#fff",
              fontSize: 12, fontWeight: 800, cursor: filtered.length ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", gap: 6,
              opacity: filtered.length ? 1 : 0.5,
            }}
          >
            <Download size={14} /> Download PDF
          </button>
          <button onClick={() => { loadSlots(); loadUploads(); }} style={{
            background: "rgba(255,255,255,0.2)", border: "none",
            borderRadius: 10, padding: "9px 12px", color: "#fff",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 12,
      }}>
        {[
          { label: "Total Classes", value: filtered.length, color: "#A78BFA", icon: "📋" },
          { label: "Subjects", value: new Set(filtered.map(s => s.subjectName)).size, color: "#FF6B6B", icon: "📚" },
          { label: "Teachers", value: new Set(filtered.map(s => s.teacherName)).size, color: "#4ECDC4", icon: "👩‍🏫" },
          { label: "Files", value: uploads.length, color: "#F59E0B", icon: "🗂️" },
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
          <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 10, padding: 3, gap: 3, flexWrap: "wrap" }}>
            {(["list", "grid", "files"] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                background: view === v ? "#fff" : "transparent",
                color: view === v ? "#7C3AED" : "#9CA3AF",
                fontWeight: 700, fontSize: 12,
                boxShadow: view === v ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                display: "flex", alignItems: "center", gap: 5,
                whiteSpace: "nowrap",
              }}>
                {v === "list" ? <List size={13} /> : v === "grid" ? <Layers size={13} /> : <FileText size={13} />}
                {v === "list" ? "List" : v === "grid" ? "Grid" : `Files (${uploads.length})`}
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
                flex: "1 1 160px", minWidth: 0,
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
                  flex: "1 1 140px", minWidth: 0,
                }}
              >
                <option value="">All Levels</option>
                {levelOpts.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            )}
          </div>
        )}

        {/* Row 3: Search + day pills (hide for files view) */}
        {view !== "files" && (
          <>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ position: "relative", flex: "1 1 180px", minWidth: 0 }}>
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
          </>
        )}
      </div>

      {/* ── Content ── */}
      {view === "files" ? (

        /* ── FILES VIEW (admin uploaded timetable images/PDFs) ── */
        uploadsLoading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 240, gap: 12 }}>
            <Loader2 size={32} style={{ color: "#A78BFA", animation: "spin 1s linear infinite" }} />
            <p style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF" }}>Loading files…</p>
          </div>
        ) : uploads.length === 0 ? (
          <div style={{
            background: "#fff", borderRadius: 16, padding: "56px 32px",
            textAlign: "center", border: "1px solid #F3F4F6",
          }}>
            <FileText size={36} style={{ color: "#E5E7EB", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 15, fontWeight: 800, color: "#1A1A2E" }}>No timetable files uploaded</p>
            <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>Your school hasn't uploaded any timetable images or PDFs yet</p>
          </div>
        ) : (
          <div style={{
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 16,
}}>
  {uploads.map((u) => {
    const isImage = u.mimeType.startsWith("image/");
    const isPdf = u.mimeType === "application/pdf";
    return (
      <div
        key={u.id}
        style={{
          borderRadius: 16,
          border: "1px solid #F3F4F6",
          overflow: "hidden",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {isImage && (
          <img
            src={u.url}
            alt={u.originalName}
            style={{
              width: "100%",
              objectFit: "contain",
              maxHeight: "50vh",
              display: "block",
              background: "#FAFAFA",
            }}
          />
        )}
        {isPdf && (
          <iframe
            src={u.url}
            title={u.originalName}
            style={{ width: "100%", height: "50vh", border: 0 }}
          />
        )}
        <div
          style={{
            padding: "12px 14px",
            background: "#FFFDF7",
            borderTop: "1px solid #F0EEF8",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {isImage ? (
            <ImageIcon size={14} style={{ color: "#A78BFA", flexShrink: 0 }} />
          ) : (
            <FileText size={14} style={{ color: "#A78BFA", flexShrink: 0 }} />
          )}
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#4B5563",
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {u.originalName}
          </span>
          <span style={{ fontSize: 10, color: "#9CA3AF", flexShrink: 0 }}>
            {Math.round(u.size / 1024)} KB
          </span>
          {(u.program || u.level) && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#A78BFA",
                background: "#A78BFA15",
                padding: "2px 8px",
                borderRadius: 10,
                flexShrink: 0,
              }}
            >
              {u.program?.name}
              {u.level ? ` · ${u.level.name}` : ""}
            </span>
          )}
          <a
            href={u.url}
            target="_blank"
            rel="noreferrer"
            title="Open"
            style={{ color: "#7C3AED", display: "flex", alignItems: "center", flexShrink: 0 }}
          >
            <Eye size={14} />
          </a>
          <a
            href={u.url}
            download={u.originalName}
            title="Download"
            style={{ color: "#7C3AED", display: "flex", alignItems: "center", flexShrink: 0 }}
          >
            <Download size={14} />
          </a>
        </div>
      </div>
    );
  })}
</div>
        )

      ) : loading ? (
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
                        flexWrap: "wrap",
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
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
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