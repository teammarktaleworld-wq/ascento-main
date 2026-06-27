
// // src\components\userdashboard\UserExamDashboard.tsx
// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";

// interface Category { id: string; name: string; }

// interface PaperRegistration {
//   id: string;
//   status: string;
//   score: number | null;
//   percentage: number | null;
//   attemptNumber: number;
//   submittedAt: string | null;
// }

// interface Paper {
//   id: string;
//   title: string;
//   description: string;
//   duration: number;
//   totalMarks: number;
//   passingMarks: number;
//   maxAttempts: number;
//   shuffleQuestions: boolean;
//   startDate: string | null;
//   endDate: string | null;
//   category: { id: string; name: string } | null;
//   _count: { portalQuestions: number };
//   portalRegistrations: PaperRegistration[];
// }

// interface MyRegistration {
//   id: string;
//   status: string;
//   score: number | null;
//   percentage: number | null;
//   passed: boolean | null;
//   attemptNumber: number;
//   submittedAt: string | null;
//   timeTaken: number | null;
//   paper: Paper & { category: Category | null };
// }

// type DashTab = "available" | "my";

// export default function UserExamDashboard() {
//   const { token } = useAuth();

//   const [tab,        setTab]        = useState<DashTab>("available");
//   const [papers,     setPapers]     = useState<Paper[]>([]);
//   const [myRegs,     setMyRegs]     = useState<MyRegistration[]>([]);
//   const [cats,       setCats]       = useState<Category[]>([]);
//   const [filterCat,  setFilterCat]  = useState("all");
//   const [loading,    setLoading]    = useState(true);
//   const [regLoading, setRegLoading] = useState<string | null>(null);
//   const [error,      setError]      = useState("");
//   const [success,    setSuccess]    = useState("");

//   const authHeaders = useCallback(
//     () => ({ Authorization: `Bearer ${token}` }),
//     [token],
//   );

//   const loadAll = useCallback(async () => {
//     if (!token) return;
//     setLoading(true);
//     setError("");
//     try {
//       const [pr, rr, cr] = await Promise.all([
//         fetch("/api/portal/papers",        { headers: authHeaders(), cache: "no-store" }),
//         fetch("/api/portal/registrations", { headers: authHeaders(), cache: "no-store" }),
//         fetch("/api/portal/categories",    { headers: authHeaders(), cache: "no-store" }),
//       ]);
//       setPapers((await pr.json()).papers ?? []);
//       setMyRegs((await rr.json()).registrations ?? []);
//       setCats((await cr.json()).categories ?? []);
//     } catch {
//       setError("Failed to load exams. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [token, authHeaders]);

//   useEffect(() => { loadAll(); }, [loadAll]);

//   const handleRegister = async (paperId: string) => {
//     setRegLoading(paperId);
//     setError(""); setSuccess("");
//     try {
//       const r = await fetch(`/api/portal/papers/${paperId}/register`, {
//         method: "POST",
//         headers: authHeaders(),
//       });
//       const data = await r.json();
//       if (!r.ok) throw new Error(data.error ?? "Registration failed");
//       setSuccess("Successfully registered! Find it in My Exams.");
//       loadAll();
//     } catch (e: any) {
//       setError(e.message);
//     } finally {
//       setRegLoading(null);
//     }
//   };

//   const filteredPapers = filterCat === "all"
//     ? papers
//     : papers.filter(p => p.category?.id === filterCat);

//   return (
//     <div style={{ fontFamily: "'Nunito',system-ui,sans-serif" }}>

//       {/* ── Header ── */}
//       <div style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 14 }}>
//         <div style={{
//           width: 52, height: 52, borderRadius: 16,
//           background: "linear-gradient(135deg,#FF6B6B,#FFB347)",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           fontSize: 24, boxShadow: "0 6px 20px rgba(255,107,107,.35)",
//         }}>🎯</div>
//         <div>
//           <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 26, color: "#1A1A2E", margin: 0 }}>
//             Exam Portal
//           </h1>
//           <p style={{ fontSize: 13, color: "#999", margin: 0, fontWeight: 700 }}>
//             Register for exams and track your results
//           </p>
//         </div>
//       </div>

//       {/* ── Tabs ── */}
//       <div style={{
//         display: "flex", gap: 8, marginBottom: 24,
//         background: "#F5F3EE", borderRadius: 16, padding: 6, width: "fit-content",
//       }}>
//         {([
//           { id: "available", label: "Available Exams", emoji: "📋" },
//           { id: "my",        label: "My Exams",        emoji: "📊" },
//         ] as { id: DashTab; label: string; emoji: string }[]).map(t => (
//           <button
//             key={t.id}
//             onClick={() => { setTab(t.id); setError(""); setSuccess(""); }}
//             style={{
//               border: "none", cursor: "pointer", padding: "9px 22px", borderRadius: 12,
//               fontFamily: "inherit", fontWeight: 800, fontSize: 14,
//               display: "flex", alignItems: "center", gap: 7, transition: "all .2s",
//               background: tab === t.id ? "white" : "transparent",
//               color:      tab === t.id ? "#FF6B6B" : "#888",
//               boxShadow:  tab === t.id ? "0 2px 12px rgba(0,0,0,.1)" : "none",
//             }}
//           >
//             {t.emoji} {t.label}
//             {t.id === "my" && myRegs.length > 0 && (
//               <span style={{
//                 background: "#FF6B6B", color: "white", borderRadius: 50,
//                 fontSize: 10, fontWeight: 900, padding: "1px 7px", marginLeft: 2,
//               }}>
//                 {myRegs.length}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* ── Alerts ── */}
//       {error && (
//         <div style={{ background: "#FFF0F0", border: "1.5px solid #FFD6D6", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#FF4444", fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
//           ⚠️ {error}
//         </div>
//       )}
//       {success && (
//         <div style={{ background: "#F0FFF8", border: "1.5px solid #22C55E33", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#22C55E", fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
//           ✅ {success}
//         </div>
//       )}

//       {loading ? (
//         <LoadingState />
//       ) : tab === "available" ? (
//         <AvailableTab
//           papers={filteredPapers}
//           cats={cats}
//           filterCat={filterCat}
//           setFilterCat={setFilterCat}
//           regLoading={regLoading}
//           onRegister={handleRegister}
//         />
//       ) : (
//         <MyExamsTab registrations={myRegs} />
//       )}
//     </div>
//   );
// }

// // ── Available Exams Tab ────────────────────────────────────────────────────────
// function AvailableTab({
//   papers, cats, filterCat, setFilterCat, regLoading, onRegister,
// }: {
//   papers: Paper[];
//   cats: Category[];
//   filterCat: string;
//   setFilterCat: (v: string) => void;
//   regLoading: string | null;
//   onRegister: (id: string) => void;
// }) {
//   return (
//     <div>
//       {/* Category filter */}
//       <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
//         {[{ id: "all", name: "All" }, ...cats].map(c => (
//           <button
//             key={c.id}
//             onClick={() => setFilterCat(c.id)}
//             style={{
//               border: `2px solid ${filterCat === c.id ? "#FF6B6B" : "#EEE"}`,
//               borderRadius: 50, padding: "7px 18px",
//               fontFamily: "inherit", fontWeight: 800, fontSize: 13, cursor: "pointer",
//               background: filterCat === c.id ? "#FFF0F0" : "white",
//               color: filterCat === c.id ? "#FF6B6B" : "#777",
//               transition: "all .2s",
//             }}
//           >
//             {c.name}
//           </button>
//         ))}
//       </div>

//       {papers.length === 0 ? (
//         <EmptyState
//           emoji="📋"
//           title="No exams available"
//           subtitle="Check back later for new exams."
//         />
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//           {papers.map(p => (
//             <ExamCard
//               key={p.id}
//               paper={p}
//               regLoading={regLoading}
//               onRegister={onRegister}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Exam Card ─────────────────────────────────────────────────────────────────
// function ExamCard({ paper, regLoading, onRegister }: {
//   paper: Paper;
//   regLoading: string | null;
//   onRegister: (id: string) => void;
// }) {
//   const now            = new Date();
//   const isScheduled    = !!(paper.startDate || paper.endDate);
//   const hasStarted     = !paper.startDate || now >= new Date(paper.startDate);
//   const hasEnded       = paper.endDate ? now > new Date(paper.endDate) : false;
//   const attemptsUsed   = paper.portalRegistrations.length;
//   const attemptsLeft   = paper.maxAttempts - attemptsUsed;
//   const alreadyReg     = attemptsUsed > 0;
//   const canRegister    = !hasEnded && attemptsLeft > 0;

//   // Latest registration status
//   const latestReg = paper.portalRegistrations.sort(
//     (a, b) => b.attemptNumber - a.attemptNumber
//   )[0];

//   const formatDate = (d: string) =>
//     new Date(d).toLocaleString("en-IN", {
//       day: "numeric", month: "short", year: "numeric",
//       hour: "2-digit", minute: "2-digit",
//     });

//   const getStatusBadge = () => {
//     if (hasEnded)       return { label: "Closed",     bg: "#F5F5F5", color: "#999" };
//     if (!hasStarted)    return { label: "Upcoming",   bg: "#FFF8EE", color: "#FFB347" };
//     if (attemptsLeft === 0) return { label: "Completed", bg: "#F0FFF8", color: "#22C55E" };
//     if (alreadyReg)     return { label: "Registered", bg: "#F0F0FF", color: "#818CF8" };
//     return { label: "Open",       bg: "#F0FFFE", color: "#4ECDC4" };
//   };

//   const badge = getStatusBadge();

//   // Countdown for upcoming scheduled exams
//   const getCountdown = () => {
//     if (!paper.startDate || hasStarted) return null;
//     const diff = new Date(paper.startDate).getTime() - now.getTime();
//     const days  = Math.floor(diff / 86400000);
//     const hours = Math.floor((diff % 86400000) / 3600000);
//     const mins  = Math.floor((diff % 3600000) / 60000);
//     if (days > 0)  return `Starts in ${days}d ${hours}h`;
//     if (hours > 0) return `Starts in ${hours}h ${mins}m`;
//     return `Starts in ${mins}m`;
//   };

//   const countdown = getCountdown();

//   return (
//     <div style={{
//       background: "white", borderRadius: 20, overflow: "hidden",
//       border: `2px solid ${hasEnded ? "#EEE" : alreadyReg ? "#818CF833" : "#FF6B6B22"}`,
//       boxShadow: "0 2px 16px rgba(0,0,0,.06)",
//       opacity: hasEnded ? 0.7 : 1,
//       transition: "box-shadow .2s",
//     }}>
//       {/* Top strip for scheduled exams */}
//       {isScheduled && !hasEnded && (
//         <div style={{
//           background: hasStarted
//             ? "linear-gradient(90deg,#4ECDC422,#26C6DA11)"
//             : "linear-gradient(90deg,#FFB34722,#FF6B6B11)",
//           padding: "8px 22px",
//           display: "flex", alignItems: "center", justifyContent: "space-between",
//           borderBottom: `1.5px solid ${hasStarted ? "#4ECDC422" : "#FFB34722"}`,
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <span style={{ fontSize: 14 }}>{hasStarted ? "🟢" : "🟡"}</span>
//             <span style={{ fontSize: 12, fontWeight: 900, color: hasStarted ? "#4ECDC4" : "#FFB347" }}>
//               {hasStarted ? "Exam is live" : countdown}
//             </span>
//           </div>
//           <div style={{ display: "flex", gap: 14 }}>
//             {paper.startDate && (
//               <span style={{ fontSize: 11, fontWeight: 800, color: "#999" }}>
//                 From: {formatDate(paper.startDate)}
//               </span>
//             )}
//             {paper.endDate && (
//               <span style={{ fontSize: 11, fontWeight: 800, color: "#FF6B6B" }}>
//                 Until: {formatDate(paper.endDate)}
//               </span>
//             )}
//           </div>
//         </div>
//       )}

//       <div style={{ padding: "20px 22px" }}>
//         <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
//           {/* Icon */}
//           <div style={{
//             width: 52, height: 52, borderRadius: 14, flexShrink: 0,
//             background: hasEnded
//               ? "linear-gradient(135deg,#DDD,#CCC)"
//               : "linear-gradient(135deg,#FF6B6B,#FFB347)",
//             display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
//             boxShadow: hasEnded ? "none" : "0 4px 16px rgba(255,107,107,.3)",
//           }}>📝</div>

//           {/* Content */}
//           <div style={{ flex: 1, minWidth: 0 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
//               <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "#1A1A2E" }}>
//                 {paper.title}
//               </span>
//               <span style={{
//                 fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 50,
//                 background: badge.bg, color: badge.color,
//                 border: `1.5px solid ${badge.color}33`,
//               }}>
//                 {badge.label}
//               </span>
//               {paper.category && (
//                 <span style={{
//                   fontSize: 11, fontWeight: 800, color: "#FF6B6B",
//                   background: "#FFF0F0", padding: "3px 10px", borderRadius: 50,
//                 }}>
//                   {paper.category.name}
//                 </span>
//               )}
//               {isScheduled && (
//                 <span style={{
//                   fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 50,
//                   background: "#FFF0F0", color: "#FF6B6B", border: "1.5px solid #FF6B6B22",
//                 }}>
//                   📅 Scheduled
//                 </span>
//               )}
//             </div>

//             {paper.description && (
//               <p style={{ fontSize: 13, color: "#777", margin: "0 0 10px", lineHeight: 1.5, fontWeight: 700 }}>
//                 {paper.description}
//               </p>
//             )}

//             {/* Stats row */}
//             <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
//               {[
//                 ["⏱", `${paper.duration} min`],
//                 ["🏆", `${paper.totalMarks} marks`],
//                 ["✅", `Pass: ${paper.passingMarks}`],
//                 ["📝", `${paper._count.portalQuestions} questions`],
//                 ["🔁", `${attemptsLeft}/${paper.maxAttempts} attempts left`],
//               ].map(([icon, text]) => (
//                 <span key={text as string} style={{ fontSize: 12, color: "#999", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
//                   {icon} {text}
//                 </span>
//               ))}
//             </div>

//             {/* Latest result if submitted */}
//             {latestReg?.status === "submitted" && latestReg.percentage != null && (
//               <div style={{
//                 display: "inline-flex", alignItems: "center", gap: 10,
//                 background: latestReg.percentage >= (paper.passingMarks / paper.totalMarks * 100) ? "#F0FFF8" : "#FFF0F0",
//                 border: `1.5px solid ${latestReg.percentage >= (paper.passingMarks / paper.totalMarks * 100) ? "#22C55E33" : "#FF6B6B33"}`,
//                 borderRadius: 10, padding: "8px 14px", marginBottom: 12,
//               }}>
//                 <span style={{ fontSize: 18 }}>
//                   {latestReg.percentage >= (paper.passingMarks / paper.totalMarks * 100) ? "🏆" : "📉"}
//                 </span>
//                 <div>
//                   <div style={{
//                     fontSize: 13, fontWeight: 900,
//                     color: latestReg.percentage >= (paper.passingMarks / paper.totalMarks * 100) ? "#22C55E" : "#FF6B6B",
//                   }}>
//                     Score: {latestReg.score}/{paper.totalMarks} ({latestReg.percentage.toFixed(1)}%)
//                   </div>
//                   <div style={{ fontSize: 11, color: "#999", fontWeight: 700 }}>
//                     Attempt #{latestReg.attemptNumber} ·{" "}
//                     {latestReg.submittedAt && new Date(latestReg.submittedAt).toLocaleDateString("en-IN")}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Action button */}
//             <div>
//               {hasEnded ? (
//                 <span style={{ fontSize: 13, fontWeight: 800, color: "#BBB" }}>
//                   This exam has ended
//                 </span>
//               ) : !hasStarted ? (
//                 <button
//                   onClick={() => onRegister(paper.id)}
//                   disabled={regLoading === paper.id || alreadyReg}
//                   style={{
//                     ...actionBtnStyle,
//                     background: alreadyReg
//                       ? "linear-gradient(135deg,#818CF8,#6366F1)"
//                       : "linear-gradient(135deg,#FFB347,#FF8E53)",
//                     boxShadow: alreadyReg
//                       ? "0 4px 16px rgba(129,140,248,.3)"
//                       : "0 4px 16px rgba(255,179,71,.3)",
//                     opacity: regLoading === paper.id ? 0.7 : 1,
//                     cursor: alreadyReg ? "default" : "pointer",
//                   }}
//                 >
//                   {regLoading === paper.id
//                     ? "Registering…"
//                     : alreadyReg
//                     ? "✅ Registered — Waiting to start"
//                     : "🔔 Register for this Exam"}
//                 </button>
//               ) : canRegister ? (
//                 <button
//                   onClick={() => onRegister(paper.id)}
//                   disabled={regLoading === paper.id}
//                   style={{
//                     ...actionBtnStyle,
//                     background: "linear-gradient(135deg,#FF6B6B,#FFB347)",
//                     boxShadow: "0 4px 16px rgba(255,107,107,.35)",
//                     opacity: regLoading === paper.id ? 0.7 : 1,
//                   }}
//                 >
//                   {regLoading === paper.id ? "Registering…" : "📋 Register & Attempt"}
//                 </button>
//               ) : (
//                 <span style={{ fontSize: 13, fontWeight: 800, color: "#22C55E" }}>
//                   ✅ All attempts used
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── My Exams Tab ──────────────────────────────────────────────────────────────
// function MyExamsTab({ registrations }: { registrations: MyRegistration[] }) {
//   if (registrations.length === 0) {
//     return (
//       <EmptyState
//         emoji="📊"
//         title="No registrations yet"
//         subtitle="Go to Available Exams and register for one."
//       />
//     );
//   }

//   const submitted  = registrations.filter(r => r.status === "submitted");
//   const inProgress = registrations.filter(r => r.status !== "submitted");

//   return (
//     <div>
//       {/* Summary cards */}
//       <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
//         {[
//           { label: "Registered",  value: registrations.length, color: "#FF6B6B", bg: "#FFF0F0", emoji: "📋" },
//           { label: "Completed",   value: submitted.length,     color: "#22C55E", bg: "#F0FFF8", emoji: "✅" },
//           { label: "Avg Score",
//             value: submitted.length > 0
//               ? `${(submitted.reduce((a, r) => a + (r.percentage ?? 0), 0) / submitted.length).toFixed(1)}%`
//               : "—",
//             color: "#FFB347", bg: "#FFF8EE", emoji: "🏆" },
//         ].map(s => (
//           <div key={s.label} style={{
//             background: s.bg, borderRadius: 14, padding: "14px 22px",
//             border: `2px solid ${s.color}22`, display: "flex", alignItems: "center", gap: 12,
//           }}>
//             <span style={{ fontSize: 24 }}>{s.emoji}</span>
//             <div>
//               <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: s.color, lineHeight: 1 }}>
//                 {s.value}
//               </div>
//               <div style={{ fontSize: 11, fontWeight: 900, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>
//                 {s.label}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* In progress */}
//       {inProgress.length > 0 && (
//         <div style={{ marginBottom: 24 }}>
//           <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#1A1A2E", margin: "0 0 12px" }}>
//             ⏳ Pending / In Progress
//           </h3>
//           <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//             {inProgress.map(r => <RegistrationRow key={r.id} reg={r} />)}
//           </div>
//         </div>
//       )}

//       {/* Completed */}
//       {submitted.length > 0 && (
//         <div>
//           <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#1A1A2E", margin: "0 0 12px" }}>
//             ✅ Completed
//           </h3>
//           <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//             {submitted.map(r => <RegistrationRow key={r.id} reg={r} />)}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function RegistrationRow({ reg }: { reg: MyRegistration }) {
//   const passed      = reg.passed;
//   const isSubmitted = reg.status === "submitted";

//   const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
//     registered:  { label: "Registered",  color: "#818CF8", bg: "#F0F0FF" },
//     in_progress: { label: "In Progress", color: "#FFB347", bg: "#FFF8EE" },
//     submitted:   { label: "Submitted",   color: "#22C55E", bg: "#F0FFF8" },
//     expired:     { label: "Expired",     color: "#999",    bg: "#F5F5F5" },
//   };

//   const sc = statusConfig[reg.status] ?? statusConfig.registered;

//   const formatTime = (s: number) => {
//     const m = Math.floor(s / 60);
//     const sec = s % 60;
//     return `${m}m ${sec}s`;
//   };

//   return (
//     <div style={{
//       background: "white", borderRadius: 16, padding: "16px 20px",
//       border: `2px solid ${isSubmitted && passed ? "#22C55E22" : isSubmitted ? "#FF6B6B22" : "#EEE"}`,
//       display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
//     }}>
//       <div style={{
//         width: 44, height: 44, borderRadius: 12, flexShrink: 0,
//         background: isSubmitted
//           ? passed
//             ? "linear-gradient(135deg,#22C55E,#16A34A)"
//             : "linear-gradient(135deg,#FF6B6B,#EF4444)"
//           : "linear-gradient(135deg,#FFB347,#FF8E53)",
//         display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
//       }}>
//         {isSubmitted ? (passed ? "🏆" : "📉") : "📋"}
//       </div>

//       <div style={{ flex: 1, minWidth: 180 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
//           <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 15, color: "#1A1A2E" }}>
//             {reg.paper.title}
//           </span>
//           <span style={{
//             fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 50,
//             background: sc.bg, color: sc.color, border: `1.5px solid ${sc.color}33`,
//           }}>
//             {sc.label}
//           </span>
//           {reg.paper.category && (
//             <span style={{
//               fontSize: 11, fontWeight: 800, color: "#FF6B6B",
//               background: "#FFF0F0", padding: "3px 10px", borderRadius: 50,
//             }}>
//               {reg.paper.category.name}
//             </span>
//           )}
//         </div>

//         <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
//           <span style={{ fontSize: 12, color: "#999", fontWeight: 700 }}>
//             Attempt #{reg.attemptNumber}
//           </span>
//           {isSubmitted && reg.percentage != null && (
//             <span style={{ fontSize: 12, fontWeight: 900, color: passed ? "#22C55E" : "#FF6B6B" }}>
//               {reg.score}/{reg.paper.totalMarks} ({reg.percentage.toFixed(1)}%) — {passed ? "Passed ✅" : "Failed ❌"}
//             </span>
//           )}
//           {isSubmitted && reg.timeTaken && (
//             <span style={{ fontSize: 12, color: "#999", fontWeight: 700 }}>
//               ⏱ {formatTime(reg.timeTaken)}
//             </span>
//           )}
//           {isSubmitted && reg.submittedAt && (
//             <span style={{ fontSize: 12, color: "#999", fontWeight: 700 }}>
//               {new Date(reg.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Helpers ───────────────────────────────────────────────────────────────────
// function LoadingState() {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//       {[1, 2, 3].map(i => (
//         <div key={i} style={{
//           background: "white", borderRadius: 20, padding: "20px 22px",
//           border: "2px solid #EEE", display: "flex", gap: 16, alignItems: "center",
//         }}>
//           <div style={{ width: 52, height: 52, borderRadius: 14, background: "#F5F5F5" }} />
//           <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
//             <div style={{ width: "40%", height: 16, borderRadius: 8, background: "#F5F5F5" }} />
//             <div style={{ width: "60%", height: 12, borderRadius: 8, background: "#F5F5F5" }} />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// function EmptyState({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
//   return (
//     <div style={{ textAlign: "center", padding: "60px 24px" }}>
//       <div style={{ fontSize: 52, marginBottom: 12 }}>{emoji}</div>
//       <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", marginBottom: 8 }}>
//         {title}
//       </h3>
//       <p style={{ fontSize: 14, color: "#aaa", fontWeight: 700 }}>{subtitle}</p>
//     </div>
//   );
// }

// const actionBtnStyle: React.CSSProperties = {
//   color: "white", border: "none", borderRadius: 50,
//   padding: "11px 28px", fontFamily: "inherit", fontWeight: 900,
//   fontSize: 14, cursor: "pointer", display: "inline-flex",
//   alignItems: "center", gap: 8, transition: "all .2s",
// };























// src\components\userdashboard\UserExamDashboard.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Category { id: string; name: string; }

interface PaperRegistration {
  id: string;
  status: string;
  score: number | null;
  percentage: number | null;
  attemptNumber: number;
  submittedAt: string | null;
}

interface Paper {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  startDate: string | null;
  endDate: string | null;
  category: { id: string; name: string } | null;
  _count: { portalQuestions: number };
  portalRegistrations: PaperRegistration[];
}

interface MyRegistration {
  id: string;
  status: string;
  score: number | null;
  percentage: number | null;
  passed: boolean | null;
  attemptNumber: number;
  submittedAt: string | null;
  timeTaken: number | null;
  paper: Paper & { category: Category | null };
}

type DashTab = "available" | "my";

export default function UserExamDashboard() {
  const { token } = useAuth();
  const router = useRouter();

  const [tab,        setTab]        = useState<DashTab>("available");
  const [papers,     setPapers]     = useState<Paper[]>([]);
  const [myRegs,     setMyRegs]     = useState<MyRegistration[]>([]);
  const [cats,       setCats]       = useState<Category[]>([]);
  const [filterCat,  setFilterCat]  = useState("all");
  const [loading,    setLoading]    = useState(true);
  const [regLoading, setRegLoading] = useState<string | null>(null);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");

  const authHeaders = useCallback(
    () => ({ Authorization: `Bearer ${token}` }),
    [token],
  );

  const loadAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const [pr, rr, cr] = await Promise.all([
        fetch("/api/portal/papers",        { headers: authHeaders(), cache: "no-store" }),
        fetch("/api/portal/registrations", { headers: authHeaders(), cache: "no-store" }),
        fetch("/api/portal/categories",    { headers: authHeaders(), cache: "no-store" }),
      ]);
      setPapers((await pr.json()).papers ?? []);
      setMyRegs((await rr.json()).registrations ?? []);
      setCats((await cr.json()).categories ?? []);
    } catch {
      setError("Failed to load exams. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token, authHeaders]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Register, then jump straight into the exam for unscheduled papers ──
  const handleRegister = async (paperId: string) => {
    setRegLoading(paperId);
    setError(""); setSuccess("");
    try {
      const r = await fetch(`/api/portal/papers/${paperId}/register`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error ?? "Registration failed");

      const regId = data.registration?.id;
      if (regId) {
        router.push(`/userexam/${regId}`);
        return;
      }
      // Fallback (shouldn't normally happen)
      setSuccess("Successfully registered! Find it in My Exams.");
      loadAll();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRegLoading(null);
    }
  };

  // ── Resume / continue an existing (unfinished) registration ──
  const handleResume = (regId: string) => {
    router.push(`/userexam/${regId}`);
  };

  // ── View the result of a finished registration ──
  const handleViewResult = (regId: string) => {
    router.push(`/userexam/${regId}`);
  };

  const filteredPapers = filterCat === "all"
    ? papers
    : papers.filter(p => p.category?.id === filterCat);

  return (
    <div style={{ fontFamily: "'Nunito',system-ui,sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 16,
          background: "linear-gradient(135deg,#FF6B6B,#FFB347)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, boxShadow: "0 6px 20px rgba(255,107,107,.35)",
        }}>🎯</div>
        <div>
          <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 26, color: "#1A1A2E", margin: 0 }}>
            Exam Portal
          </h1>
          <p style={{ fontSize: 13, color: "#999", margin: 0, fontWeight: 700 }}>
            Register for exams and track your results
          </p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 24,
        background: "#F5F3EE", borderRadius: 16, padding: 6, width: "fit-content",
      }}>
        {([
          { id: "available", label: "Available Exams", emoji: "📋" },
          { id: "my",        label: "My Exams",        emoji: "📊" },
        ] as { id: DashTab; label: string; emoji: string }[]).map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setError(""); setSuccess(""); }}
            style={{
              border: "none", cursor: "pointer", padding: "9px 22px", borderRadius: 12,
              fontFamily: "inherit", fontWeight: 800, fontSize: 14,
              display: "flex", alignItems: "center", gap: 7, transition: "all .2s",
              background: tab === t.id ? "white" : "transparent",
              color:      tab === t.id ? "#FF6B6B" : "#888",
              boxShadow:  tab === t.id ? "0 2px 12px rgba(0,0,0,.1)" : "none",
            }}
          >
            {t.emoji} {t.label}
            {t.id === "my" && myRegs.length > 0 && (
              <span style={{
                background: "#FF6B6B", color: "white", borderRadius: 50,
                fontSize: 10, fontWeight: 900, padding: "1px 7px", marginLeft: 2,
              }}>
                {myRegs.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Alerts ── */}
      {error && (
        <div style={{ background: "#FFF0F0", border: "1.5px solid #FFD6D6", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#FF4444", fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ background: "#F0FFF8", border: "1.5px solid #22C55E33", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#22C55E", fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
          ✅ {success}
        </div>
      )}

      {loading ? (
        <LoadingState />
      ) : tab === "available" ? (
        <AvailableTab
          papers={filteredPapers}
          cats={cats}
          filterCat={filterCat}
          setFilterCat={setFilterCat}
          regLoading={regLoading}
          onRegister={handleRegister}
          onResume={handleResume}
        />
      ) : (
        <MyExamsTab registrations={myRegs} onResume={handleResume} onViewResult={handleViewResult} />
      )}
    </div>
  );
}

// ── Available Exams Tab ────────────────────────────────────────────────────────
function AvailableTab({
  papers, cats, filterCat, setFilterCat, regLoading, onRegister, onResume,
}: {
  papers: Paper[];
  cats: Category[];
  filterCat: string;
  setFilterCat: (v: string) => void;
  regLoading: string | null;
  onRegister: (id: string) => void;
  onResume: (regId: string) => void;
}) {
  return (
    <div>
      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[{ id: "all", name: "All" }, ...cats].map(c => (
          <button
            key={c.id}
            onClick={() => setFilterCat(c.id)}
            style={{
              border: `2px solid ${filterCat === c.id ? "#FF6B6B" : "#EEE"}`,
              borderRadius: 50, padding: "7px 18px",
              fontFamily: "inherit", fontWeight: 800, fontSize: 13, cursor: "pointer",
              background: filterCat === c.id ? "#FFF0F0" : "white",
              color: filterCat === c.id ? "#FF6B6B" : "#777",
              transition: "all .2s",
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {papers.length === 0 ? (
        <EmptyState
          emoji="📋"
          title="No exams available"
          subtitle="Check back later for new exams."
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {papers.map(p => (
            <ExamCard
              key={p.id}
              paper={p}
              regLoading={regLoading}
              onRegister={onRegister}
              onResume={onResume}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Exam Card ─────────────────────────────────────────────────────────────────
function ExamCard({ paper, regLoading, onRegister, onResume }: {
  paper: Paper;
  regLoading: string | null;
  onRegister: (id: string) => void;
  onResume: (regId: string) => void;
}) {
  const now            = new Date();
  const isScheduled    = !!(paper.startDate || paper.endDate);
  const hasStarted     = !paper.startDate || now >= new Date(paper.startDate);
  const hasEnded       = paper.endDate ? now > new Date(paper.endDate) : false;
  const attemptsUsed   = paper.portalRegistrations.length;
  const attemptsLeft   = paper.maxAttempts - attemptsUsed;
  const alreadyReg     = attemptsUsed > 0;
  const canRegister    = !hasEnded && attemptsLeft > 0;

  // Latest registration status
  const latestReg = [...paper.portalRegistrations].sort(
    (a, b) => b.attemptNumber - a.attemptNumber
  )[0];

  const isUnfinished = latestReg && (latestReg.status === "registered" || latestReg.status === "in_progress");
  const isFinished   = latestReg && (latestReg.status === "submitted" || latestReg.status === "expired");

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const getStatusBadge = () => {
    if (hasEnded)       return { label: "Closed",     bg: "#F5F5F5", color: "#999" };
    if (!hasStarted)    return { label: "Upcoming",   bg: "#FFF8EE", color: "#FFB347" };
    if (attemptsLeft === 0) return { label: "Completed", bg: "#F0FFF8", color: "#22C55E" };
    if (alreadyReg)     return { label: "Registered", bg: "#F0F0FF", color: "#818CF8" };
    return { label: "Open",       bg: "#F0FFFE", color: "#4ECDC4" };
  };

  const badge = getStatusBadge();

  // Countdown for upcoming scheduled exams
  const getCountdown = () => {
    if (!paper.startDate || hasStarted) return null;
    const diff = new Date(paper.startDate).getTime() - now.getTime();
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    if (days > 0)  return `Starts in ${days}d ${hours}h`;
    if (hours > 0) return `Starts in ${hours}h ${mins}m`;
    return `Starts in ${mins}m`;
  };

  const countdown = getCountdown();

  return (
    <div style={{
      background: "white", borderRadius: 20, overflow: "hidden",
      border: `2px solid ${hasEnded ? "#EEE" : alreadyReg ? "#818CF833" : "#FF6B6B22"}`,
      boxShadow: "0 2px 16px rgba(0,0,0,.06)",
      opacity: hasEnded ? 0.7 : 1,
      transition: "box-shadow .2s",
    }}>
      {/* Top strip for scheduled exams */}
      {isScheduled && !hasEnded && (
        <div style={{
          background: hasStarted
            ? "linear-gradient(90deg,#4ECDC422,#26C6DA11)"
            : "linear-gradient(90deg,#FFB34722,#FF6B6B11)",
          padding: "8px 22px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1.5px solid ${hasStarted ? "#4ECDC422" : "#FFB34722"}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>{hasStarted ? "🟢" : "🟡"}</span>
            <span style={{ fontSize: 12, fontWeight: 900, color: hasStarted ? "#4ECDC4" : "#FFB347" }}>
              {hasStarted ? "Exam is live" : countdown}
            </span>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {paper.startDate && (
              <span style={{ fontSize: 11, fontWeight: 800, color: "#999" }}>
                From: {formatDate(paper.startDate)}
              </span>
            )}
            {paper.endDate && (
              <span style={{ fontSize: 11, fontWeight: 800, color: "#FF6B6B" }}>
                Until: {formatDate(paper.endDate)}
              </span>
            )}
          </div>
        </div>
      )}

      <div style={{ padding: "20px 22px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          {/* Icon */}
          <div style={{
            width: 52, height: 52, borderRadius: 14, flexShrink: 0,
            background: hasEnded
              ? "linear-gradient(135deg,#DDD,#CCC)"
              : "linear-gradient(135deg,#FF6B6B,#FFB347)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            boxShadow: hasEnded ? "none" : "0 4px 16px rgba(255,107,107,.3)",
          }}>📝</div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
              <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "#1A1A2E" }}>
                {paper.title}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 50,
                background: badge.bg, color: badge.color,
                border: `1.5px solid ${badge.color}33`,
              }}>
                {badge.label}
              </span>
              {paper.category && (
                <span style={{
                  fontSize: 11, fontWeight: 800, color: "#FF6B6B",
                  background: "#FFF0F0", padding: "3px 10px", borderRadius: 50,
                }}>
                  {paper.category.name}
                </span>
              )}
              {isScheduled && (
                <span style={{
                  fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 50,
                  background: "#FFF0F0", color: "#FF6B6B", border: "1.5px solid #FF6B6B22",
                }}>
                  📅 Scheduled
                </span>
              )}
            </div>

            {paper.description && (
              <p style={{ fontSize: 13, color: "#777", margin: "0 0 10px", lineHeight: 1.5, fontWeight: 700 }}>
                {paper.description}
              </p>
            )}

            {/* Stats row */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
              {[
                ["⏱", `${paper.duration} min`],
                ["🏆", `${paper.totalMarks} marks`],
                ["✅", `Pass: ${paper.passingMarks}`],
                ["📝", `${paper._count.portalQuestions} questions`],
                ["🔁", `${attemptsLeft}/${paper.maxAttempts} attempts left`],
              ].map(([icon, text]) => (
                <span key={text as string} style={{ fontSize: 12, color: "#999", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                  {icon} {text}
                </span>
              ))}
            </div>

            {/* Latest result if submitted */}
            {latestReg?.status === "submitted" && latestReg.percentage != null && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: latestReg.percentage >= (paper.passingMarks / paper.totalMarks * 100) ? "#F0FFF8" : "#FFF0F0",
                border: `1.5px solid ${latestReg.percentage >= (paper.passingMarks / paper.totalMarks * 100) ? "#22C55E33" : "#FF6B6B33"}`,
                borderRadius: 10, padding: "8px 14px", marginBottom: 12,
              }}>
                <span style={{ fontSize: 18 }}>
                  {latestReg.percentage >= (paper.passingMarks / paper.totalMarks * 100) ? "🏆" : "📉"}
                </span>
                <div>
                  <div style={{
                    fontSize: 13, fontWeight: 900,
                    color: latestReg.percentage >= (paper.passingMarks / paper.totalMarks * 100) ? "#22C55E" : "#FF6B6B",
                  }}>
                    Score: {latestReg.score}/{paper.totalMarks} ({latestReg.percentage.toFixed(1)}%)
                  </div>
                  <div style={{ fontSize: 11, color: "#999", fontWeight: 700 }}>
                    Attempt #{latestReg.attemptNumber} ·{" "}
                    {latestReg.submittedAt && new Date(latestReg.submittedAt).toLocaleDateString("en-IN")}
                  </div>
                </div>
              </div>
            )}

            {/* Action button */}
            <div>
              {hasEnded ? (
                <span style={{ fontSize: 13, fontWeight: 800, color: "#BBB" }}>
                  This exam has ended
                </span>
              ) : !hasStarted ? (
                // Scheduled exam, not started yet
                <button
                  onClick={() => onRegister(paper.id)}
                  disabled={regLoading === paper.id || alreadyReg}
                  style={{
                    ...actionBtnStyle,
                    background: alreadyReg
                      ? "linear-gradient(135deg,#818CF8,#6366F1)"
                      : "linear-gradient(135deg,#FFB347,#FF8E53)",
                    boxShadow: alreadyReg
                      ? "0 4px 16px rgba(129,140,248,.3)"
                      : "0 4px 16px rgba(255,179,71,.3)",
                    opacity: regLoading === paper.id ? 0.7 : 1,
                    cursor: alreadyReg ? "default" : "pointer",
                  }}
                >
                  {regLoading === paper.id
                    ? "Registering…"
                    : alreadyReg
                    ? "✅ Registered — Waiting to start"
                    : "🔔 Register for this Exam"}
                </button>
              ) : isUnfinished ? (
                // Unscheduled (or live) exam, already has an open attempt → resume it
                <button
                  onClick={() => onResume(latestReg.id)}
                  style={{
                    ...actionBtnStyle,
                    background: "linear-gradient(135deg,#FFB347,#FF8E53)",
                    boxShadow: "0 4px 16px rgba(255,179,71,.3)",
                  }}
                >
                  ▶️ {latestReg.status === "in_progress" ? "Resume Exam" : "Start Exam"}
                </button>
              ) : canRegister ? (
                <button
                  onClick={() => onRegister(paper.id)}
                  disabled={regLoading === paper.id}
                  style={{
                    ...actionBtnStyle,
                    background: "linear-gradient(135deg,#FF6B6B,#FFB347)",
                    boxShadow: "0 4px 16px rgba(255,107,107,.35)",
                    opacity: regLoading === paper.id ? 0.7 : 1,
                  }}
                >
                  {regLoading === paper.id ? "Registering…" : "📋 Register & Attempt"}
                </button>
              ) : isFinished ? (
                <button
                  onClick={() => onResume(latestReg.id)}
                  style={{
                    ...actionBtnStyle,
                    background: "linear-gradient(135deg,#22C55E,#16A34A)",
                    boxShadow: "0 4px 16px rgba(34,197,94,.3)",
                  }}
                >
                  📄 View Result
                </button>
              ) : (
                <span style={{ fontSize: 13, fontWeight: 800, color: "#22C55E" }}>
                  ✅ All attempts used
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── My Exams Tab ──────────────────────────────────────────────────────────────
function MyExamsTab({ registrations, onResume, onViewResult }: {
  registrations: MyRegistration[];
  onResume: (regId: string) => void;
  onViewResult: (regId: string) => void;
}) {
  if (registrations.length === 0) {
    return (
      <EmptyState
        emoji="📊"
        title="No registrations yet"
        subtitle="Go to Available Exams and register for one."
      />
    );
  }

  const submitted  = registrations.filter(r => r.status === "submitted" || r.status === "expired");
  const inProgress = registrations.filter(r => r.status === "registered" || r.status === "in_progress");

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { label: "Registered",  value: registrations.length, color: "#FF6B6B", bg: "#FFF0F0", emoji: "📋" },
          { label: "Completed",   value: submitted.length,     color: "#22C55E", bg: "#F0FFF8", emoji: "✅" },
          { label: "Avg Score",
            value: submitted.filter(r => r.percentage != null).length > 0
              ? `${(submitted.reduce((a, r) => a + (r.percentage ?? 0), 0) / submitted.filter(r => r.percentage != null).length).toFixed(1)}%`
              : "—",
            color: "#FFB347", bg: "#FFF8EE", emoji: "🏆" },
        ].map(s => (
          <div key={s.label} style={{
            background: s.bg, borderRadius: 14, padding: "14px 22px",
            border: `2px solid ${s.color}22`, display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{ fontSize: 24 }}>{s.emoji}</span>
            <div>
              <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: s.color, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, fontWeight: 900, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* In progress */}
      {inProgress.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#1A1A2E", margin: "0 0 12px" }}>
            ⏳ Pending / In Progress
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {inProgress.map(r => (
              <RegistrationRow key={r.id} reg={r} onResume={onResume} onViewResult={onViewResult} />
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {submitted.length > 0 && (
        <div>
          <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#1A1A2E", margin: "0 0 12px" }}>
            ✅ Completed
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {submitted.map(r => (
              <RegistrationRow key={r.id} reg={r} onResume={onResume} onViewResult={onViewResult} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RegistrationRow({ reg, onResume, onViewResult }: {
  reg: MyRegistration;
  onResume: (regId: string) => void;
  onViewResult: (regId: string) => void;
}) {
  const passed      = reg.passed;
  const isSubmitted = reg.status === "submitted" || reg.status === "expired";
  const isPending   = reg.status === "registered" || reg.status === "in_progress";

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    registered:  { label: "Registered",  color: "#818CF8", bg: "#F0F0FF" },
    in_progress: { label: "In Progress", color: "#FFB347", bg: "#FFF8EE" },
    submitted:   { label: "Submitted",   color: "#22C55E", bg: "#F0FFF8" },
    expired:     { label: "Expired",     color: "#999",    bg: "#F5F5F5" },
  };

  const sc = statusConfig[reg.status] ?? statusConfig.registered;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  return (
    <div style={{
      background: "white", borderRadius: 16, padding: "16px 20px",
      border: `2px solid ${isSubmitted && passed ? "#22C55E22" : isSubmitted ? "#FF6B6B22" : "#EEE"}`,
      display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: isSubmitted
          ? passed
            ? "linear-gradient(135deg,#22C55E,#16A34A)"
            : "linear-gradient(135deg,#FF6B6B,#EF4444)"
          : "linear-gradient(135deg,#FFB347,#FF8E53)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
      }}>
        {isSubmitted ? (passed ? "🏆" : "📉") : "📋"}
      </div>

      <div style={{ flex: 1, minWidth: 180 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
          <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 15, color: "#1A1A2E" }}>
            {reg.paper.title}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 50,
            background: sc.bg, color: sc.color, border: `1.5px solid ${sc.color}33`,
          }}>
            {sc.label}
          </span>
          {reg.paper.category && (
            <span style={{
              fontSize: 11, fontWeight: 800, color: "#FF6B6B",
              background: "#FFF0F0", padding: "3px 10px", borderRadius: 50,
            }}>
              {reg.paper.category.name}
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#999", fontWeight: 700 }}>
            Attempt #{reg.attemptNumber}
          </span>
          {isSubmitted && reg.percentage != null && (
            <span style={{ fontSize: 12, fontWeight: 900, color: passed ? "#22C55E" : "#FF6B6B" }}>
              {reg.score}/{reg.paper.totalMarks} ({reg.percentage.toFixed(1)}%) — {passed ? "Passed ✅" : "Failed ❌"}
            </span>
          )}
          {isSubmitted && reg.timeTaken && (
            <span style={{ fontSize: 12, color: "#999", fontWeight: 700 }}>
              ⏱ {formatTime(reg.timeTaken)}
            </span>
          )}
          {isSubmitted && reg.submittedAt && (
            <span style={{ fontSize: 12, color: "#999", fontWeight: 700 }}>
              {new Date(reg.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          )}
        </div>
      </div>

      {/* Action button */}
      {isPending && (
        <button
          onClick={() => onResume(reg.id)}
          style={{
            border: "none", borderRadius: 50, padding: "9px 20px",
            fontFamily: "inherit", fontWeight: 900, fontSize: 12, cursor: "pointer",
            background: "linear-gradient(135deg,#FFB347,#FF8E53)", color: "white",
            boxShadow: "0 3px 12px rgba(255,179,71,.3)",
            display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0,
          }}
        >
          ▶️ {reg.status === "in_progress" ? "Resume" : "Start"}
        </button>
      )}
      {isSubmitted && (
        <button
          onClick={() => onViewResult(reg.id)}
          style={{
            border: "2px solid #EEE", borderRadius: 50, padding: "9px 20px",
            fontFamily: "inherit", fontWeight: 900, fontSize: 12, cursor: "pointer",
            background: "white", color: "#777",
            display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0,
          }}
        >
          📄 View Result
        </button>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          background: "white", borderRadius: 20, padding: "20px 22px",
          border: "2px solid #EEE", display: "flex", gap: 16, alignItems: "center",
        }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "#F5F5F5" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ width: "40%", height: 16, borderRadius: 8, background: "#F5F5F5" }} />
            <div style={{ width: "60%", height: 12, borderRadius: 8, background: "#F5F5F5" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 24px" }}>
      <div style={{ fontSize: 52, marginBottom: 12 }}>{emoji}</div>
      <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", marginBottom: 8 }}>
        {title}
      </h3>
      <p style={{ fontSize: 14, color: "#aaa", fontWeight: 700 }}>{subtitle}</p>
    </div>
  );
}

const actionBtnStyle: React.CSSProperties = {
  color: "white", border: "none", borderRadius: 50,
  padding: "11px 28px", fontFamily: "inherit", fontWeight: 900,
  fontSize: 14, cursor: "pointer", display: "inline-flex",
  alignItems: "center", gap: 8, transition: "all .2s",
};