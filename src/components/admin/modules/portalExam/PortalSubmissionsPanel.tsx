// "use client";

// import { useEffect, useState } from "react";

// interface Submission {
//   id: string;
//   userId: string;
//   paperId: string;
//   score: number | null;
//   totalMarks: number;
//   percentage: number | null;
//   passed: boolean | null;
//   status: "registered" | "in_progress" | "submitted" | "expired";
//   startedAt: string | null;
//   submittedAt: string | null;
//   timeTaken: number | null;
//   createdAt: string;
//   user: { name: string | null; email: string; phone: string | null };
//   paper: { title: string; passingMarks: number; category: { name: string } | null };
// }

// const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
//   registered:  { bg: "#FFF8EE", color: "#FFB347", label: "Registered" },
//   in_progress: { bg: "#EDE7FF", color: "#A78BFA", label: "In Progress" },
//   submitted:   { bg: "#E8FFF5", color: "#22C55E", label: "Submitted" },
//   expired:     { bg: "#F5F5F5", color: "#aaa",    label: "Expired" },
// };

// export default function PortalSubmissionsPanel() {
//   const [subs, setSubs] = useState<Submission[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState<"all" | "submitted" | "registered" | "expired">("all");
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState<Submission | null>(null);
//   const [page, setPage] = useState(1);
//   const PER_PAGE = 15;

//   const load = async () => {
//     setLoading(true);
//     try {
//       const r = await fetch("/api/portal/submissions");
//       const d = await r.json();
//       setSubs(d.submissions ?? []);
//     } catch {}
//     finally { setLoading(false); }
//   };

//   useEffect(() => { load(); }, []);

//   const filtered = subs
//     .filter(s => filter === "all" || s.status === filter)
//     .filter(s => {
//       if (!search.trim()) return true;
//       const q = search.toLowerCase();
//       return (
//         s.user.name?.toLowerCase().includes(q) ||
//         s.user.email.toLowerCase().includes(q) ||
//         s.paper.title.toLowerCase().includes(q)
//       );
//     });

//   const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
//   const totalPages = Math.ceil(filtered.length / PER_PAGE);

//   // ── Summary stats ─────────────────────────────────────────────────────────
//   const stats = {
//     total: subs.length,
//     submitted: subs.filter(s => s.status === "submitted").length,
//     passed: subs.filter(s => s.passed === true).length,
//     avgPct: (() => {
//       const done = subs.filter(s => s.percentage !== null);
//       if (!done.length) return 0;
//       return Math.round(done.reduce((a, s) => a + (s.percentage ?? 0), 0) / done.length);
//     })(),
//   };

//   return (
//     <div>
//       <div style={{ marginBottom: 24 }}>
//         <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", margin: 0 }}>Submissions & Results</h2>
//         <p style={{ fontSize: 13, color: "#aaa", margin: "3px 0 0", fontWeight: 700 }}>Track who registered, attempted, and how they scored</p>
//       </div>

//       {/* Stats */}
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 24 }}>
//         {[
//           { label: "Total Registrations", value: stats.total, color: "#FF6B6B", bg: "#FFF0F0", emoji: "📋" },
//           { label: "Submitted",          value: stats.submitted, color: "#4ECDC4", bg: "#F0FFFE", emoji: "✅" },
//           { label: "Passed",             value: stats.passed, color: "#22C55E", bg: "#E8FFF5", emoji: "🏆" },
//           { label: "Avg Score",          value: `${stats.avgPct}%`, color: "#A78BFA", bg: "#F5F0FF", emoji: "📊" },
//         ].map(s => (
//           <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: "16px 18px", border: `2px solid ${s.color}22` }}>
//             <div style={{ fontSize: 20, marginBottom: 6 }}>{s.emoji}</div>
//             <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 24, color: s.color }}>{s.value}</div>
//             <div style={{ fontSize: 11, fontWeight: 900, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</div>
//           </div>
//         ))}
//       </div>

//       {/* Filters + Search */}
//       <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
//         <input
//           value={search}
//           onChange={e => { setSearch(e.target.value); setPage(1); }}
//           placeholder="🔍 Search by name, email, paper…"
//           style={{ flex: 1, minWidth: 200, padding: "10px 14px", borderRadius: 10, border: "2px solid #EEE", fontFamily: "inherit", fontSize: 13, outline: "none" }}
//         />
//         <div style={{ display: "flex", background: "#F5F3EE", borderRadius: 12, padding: 4, gap: 4 }}>
//           {(["all", "submitted", "registered", "expired"] as const).map(f => (
//             <button
//               key={f}
//               onClick={() => { setFilter(f); setPage(1); }}
//               style={{
//                 border: "none", cursor: "pointer", padding: "7px 14px", borderRadius: 9,
//                 fontFamily: "inherit", fontWeight: 800, fontSize: 12,
//                 background: filter === f ? "white" : "transparent",
//                 color: filter === f ? "#FF6B6B" : "#888",
//                 boxShadow: filter === f ? "0 2px 8px rgba(0,0,0,.08)" : "none",
//                 textTransform: "capitalize",
//               }}
//             >
//               {f}
//             </button>
//           ))}
//         </div>
//         <button onClick={load} style={{ background: "#F5F3EE", border: "none", borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 800, fontSize: 13, color: "#555" }}>
//           🔄 Refresh
//         </button>
//       </div>

//       {/* Table */}
//       <div style={{ background: "white", borderRadius: 18, border: "2px solid #EEE", overflow: "hidden" }}>
//         {/* Table head */}
//         <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr", background: "#F9F8F5", padding: "12px 20px", borderBottom: "2px solid #EEE" }}>
//           {["Student", "Paper", "Status", "Score", "Time", "Date"].map(h => (
//             <div key={h} style={{ fontSize: 11, fontWeight: 900, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</div>
//           ))}
//         </div>

//         {loading ? (
//           <div style={{ padding: 40, textAlign: "center", color: "#aaa", fontWeight: 800 }}>Loading submissions…</div>
//         ) : paginated.length === 0 ? (
//           <div style={{ padding: "50px 24px", textAlign: "center" }}>
//             <div style={{ fontSize: 44, marginBottom: 12 }}>📊</div>
//             <p style={{ fontWeight: 800, color: "#aaa" }}>No submissions match your filter.</p>
//           </div>
//         ) : (
//           paginated.map((s, i) => {
//             const st = STATUS_STYLE[s.status] ?? STATUS_STYLE.registered;
//             return (
//               <div
//                 key={s.id}
//                 onClick={() => setSelected(s)}
//                 style={{
//                   display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr",
//                   padding: "14px 20px", borderBottom: i < paginated.length - 1 ? "1px solid #F5F5F5" : "none",
//                   cursor: "pointer", transition: "background .15s",
//                   background: selected?.id === s.id ? "#FFF8F5" : "white",
//                 }}
//                 onMouseEnter={e => (e.currentTarget.style.background = "#FAFAFA")}
//                 onMouseLeave={e => (e.currentTarget.style.background = selected?.id === s.id ? "#FFF8F5" : "white")}
//               >
//                 <div>
//                   <div style={{ fontWeight: 800, fontSize: 14, color: "#1A1A2E" }}>{s.user.name ?? "—"}</div>
//                   <div style={{ fontSize: 12, color: "#aaa", fontWeight: 700 }}>{s.user.email}</div>
//                 </div>
//                 <div>
//                   <div style={{ fontWeight: 800, fontSize: 13, color: "#1A1A2E" }}>{s.paper.title}</div>
//                   {s.paper.category && <div style={{ fontSize: 11, color: "#FF6B6B", fontWeight: 700 }}>{s.paper.category.name}</div>}
//                 </div>
//                 <div>
//                   <span style={{ background: st.bg, color: st.color, fontSize: 11, fontWeight: 900, padding: "4px 10px", borderRadius: 50 }}>
//                     {st.label}
//                   </span>
//                 </div>
//                 <div style={{ fontWeight: 900, fontSize: 14, color: s.passed === true ? "#22C55E" : s.passed === false ? "#FF6B6B" : "#aaa" }}>
//                   {s.percentage !== null ? `${s.percentage}%` : "—"}
//                   {s.passed !== null && (
//                     <div style={{ fontSize: 10, fontWeight: 800, marginTop: 2 }}>{s.passed ? "PASS" : "FAIL"}</div>
//                   )}
//                 </div>
//                 <div style={{ fontSize: 13, color: "#777", fontWeight: 700 }}>
//                   {s.timeTaken ? `${Math.floor(s.timeTaken / 60)}m ${s.timeTaken % 60}s` : "—"}
//                 </div>
//                 <div style={{ fontSize: 12, color: "#aaa", fontWeight: 700 }}>
//                   {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : new Date(s.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
//             <button
//               key={p}
//               onClick={() => setPage(p)}
//               style={{
//                 width: 36, height: 36, borderRadius: 8, border: "2px solid",
//                 cursor: "pointer", fontWeight: 800, fontSize: 13,
//                 background: page === p ? "#FF6B6B" : "white",
//                 color: page === p ? "white" : "#555",
//                 borderColor: page === p ? "#FF6B6B" : "#EEE",
//               }}
//             >{p}</button>
//           ))}
//         </div>
//       )}

//       {/* Detail Drawer */}
//       {selected && (
//         <div
//           style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 100, display: "flex", justifyContent: "flex-end" }}
//           onClick={() => setSelected(null)}
//         >
//           <div
//             style={{ width: 420, maxWidth: "100%", background: "white", height: "100%", overflowY: "auto", padding: 28, boxShadow: "-8px 0 40px rgba(0,0,0,.15)" }}
//             onClick={e => e.stopPropagation()}
//           >
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
//               <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "#1A1A2E", margin: 0 }}>Submission Detail</h3>
//               <button onClick={() => setSelected(null)} style={{ background: "#F5F3EE", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
//             </div>

//             <Section label="Student">
//               <Row label="Name" value={selected.user.name ?? "—"} />
//               <Row label="Email" value={selected.user.email} />
//               <Row label="Phone" value={selected.user.phone ?? "—"} />
//             </Section>
//             <Section label="Paper">
//               <Row label="Title" value={selected.paper.title} />
//               <Row label="Category" value={selected.paper.category?.name ?? "—"} />
//               <Row label="Total Marks" value={String(selected.totalMarks)} />
//               <Row label="Passing Marks" value={String(selected.paper.passingMarks)} />
//             </Section>
//             <Section label="Result">
//               <Row label="Status" value={STATUS_STYLE[selected.status]?.label ?? selected.status} />
//               <Row label="Score" value={selected.score !== null ? `${selected.score}/${selected.totalMarks}` : "Not submitted"} />
//               <Row label="Percentage" value={selected.percentage !== null ? `${selected.percentage}%` : "—"} />
//               <Row label="Result" value={selected.passed === true ? "✅ PASS" : selected.passed === false ? "❌ FAIL" : "—"} />
//               <Row label="Time Taken" value={selected.timeTaken ? `${Math.floor(selected.timeTaken / 60)}m ${selected.timeTaken % 60}s` : "—"} />
//               <Row label="Started" value={selected.startedAt ? new Date(selected.startedAt).toLocaleString("en-IN") : "—"} />
//               <Row label="Submitted" value={selected.submittedAt ? new Date(selected.submittedAt).toLocaleString("en-IN") : "—"} />
//             </Section>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function Section({ label, children }: { label: string; children: React.ReactNode }) {
//   return (
//     <div style={{ marginBottom: 20 }}>
//       <div style={{ fontSize: 11, fontWeight: 900, color: "#FF6B6B", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{label}</div>
//       <div style={{ background: "#FAFAFA", borderRadius: 12, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
//     </div>
//   );
// }
// function Row({ label, value }: { label: string; value: string }) {
//   return (
//     <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
//       <span style={{ color: "#aaa", fontWeight: 700 }}>{label}</span>
//       <span style={{ fontWeight: 800, color: "#1A1A2E" }}>{value}</span>
//     </div>
//   );
// }






















"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Submission {
  id: string;
  userId: string;
  paperId: string;
  score: number | null;
  totalMarks: number;
  percentage: number | null;
  passed: boolean | null;
  status: "registered" | "in_progress" | "submitted" | "expired";
  startedAt: string | null;
  submittedAt: string | null;
  timeTaken: number | null;
  createdAt: string;
  user: { name: string | null; email: string; phone: string | null };
  paper: { title: string; passingMarks: number; category: { name: string } | null };
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  registered:  { bg: "#FFF8EE", color: "#FFB347", label: "Registered" },
  in_progress: { bg: "#EDE7FF", color: "#A78BFA", label: "In Progress" },
  submitted:   { bg: "#E8FFF5", color: "#22C55E", label: "Submitted" },
  expired:     { bg: "#F5F5F5", color: "#aaa",    label: "Expired" },
};

export default function PortalSubmissionsPanel() {
  const { token } = useAuth();

  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "submitted" | "registered" | "expired">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Submission | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  const authFetch = useCallback((url: string, init: RequestInit = {}) =>
    fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }), [token]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await authFetch("/api/admin/portal/submissions");
      const d = await r.json();
      setSubs(d.submissions ?? []);
    } catch {}
    finally { setLoading(false); }
  }, [authFetch]);

  useEffect(() => { load(); }, [load]);

  const filtered = subs
    .filter(s => filter === "all" || s.status === filter)
    .filter(s => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        s.user.name?.toLowerCase().includes(q) ||
        s.user.email.toLowerCase().includes(q) ||
        s.paper.title.toLowerCase().includes(q)
      );
    });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  // ── Summary stats ─────────────────────────────────────────────────────────
  const stats = {
    total: subs.length,
    submitted: subs.filter(s => s.status === "submitted").length,
    passed: subs.filter(s => s.passed === true).length,
    avgPct: (() => {
      const done = subs.filter(s => s.percentage !== null);
      if (!done.length) return 0;
      return Math.round(done.reduce((a, s) => a + (s.percentage ?? 0), 0) / done.length);
    })(),
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", margin: 0 }}>Submissions & Results</h2>
        <p style={{ fontSize: 13, color: "#aaa", margin: "3px 0 0", fontWeight: 700 }}>Track who registered, attempted, and how they scored</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Registrations", value: stats.total, color: "#FF6B6B", bg: "#FFF0F0", emoji: "📋" },
          { label: "Submitted",          value: stats.submitted, color: "#4ECDC4", bg: "#F0FFFE", emoji: "✅" },
          { label: "Passed",             value: stats.passed, color: "#22C55E", bg: "#E8FFF5", emoji: "🏆" },
          { label: "Avg Score",          value: `${stats.avgPct}%`, color: "#A78BFA", bg: "#F5F0FF", emoji: "📊" },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: "16px 18px", border: `2px solid ${s.color}22` }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.emoji}</div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 24, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, fontWeight: 900, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="🔍 Search by name, email, paper…"
          style={{ flex: 1, minWidth: 200, padding: "10px 14px", borderRadius: 10, border: "2px solid #EEE", fontFamily: "inherit", fontSize: 13, outline: "none" }}
        />
        <div style={{ display: "flex", background: "#F5F3EE", borderRadius: 12, padding: 4, gap: 4 }}>
          {(["all", "submitted", "registered", "expired"] as const).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              style={{
                border: "none", cursor: "pointer", padding: "7px 14px", borderRadius: 9,
                fontFamily: "inherit", fontWeight: 800, fontSize: 12,
                background: filter === f ? "white" : "transparent",
                color: filter === f ? "#FF6B6B" : "#888",
                boxShadow: filter === f ? "0 2px 8px rgba(0,0,0,.08)" : "none",
                textTransform: "capitalize",
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <button onClick={load} style={{ background: "#F5F3EE", border: "none", borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 800, fontSize: 13, color: "#555" }}>
          🔄 Refresh
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 18, border: "2px solid #EEE", overflow: "hidden" }}>
        {/* Table head */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr", background: "#F9F8F5", padding: "12px 20px", borderBottom: "2px solid #EEE" }}>
          {["Student", "Paper", "Status", "Score", "Time", "Date"].map(h => (
            <div key={h} style={{ fontSize: 11, fontWeight: 900, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#aaa", fontWeight: 800 }}>Loading submissions…</div>
        ) : paginated.length === 0 ? (
          <div style={{ padding: "50px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>📊</div>
            <p style={{ fontWeight: 800, color: "#aaa" }}>No submissions match your filter.</p>
          </div>
        ) : (
          paginated.map((s, i) => {
            const st = STATUS_STYLE[s.status] ?? STATUS_STYLE.registered;
            return (
              <div
                key={s.id}
                onClick={() => setSelected(s)}
                style={{
                  display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr",
                  padding: "14px 20px", borderBottom: i < paginated.length - 1 ? "1px solid #F5F5F5" : "none",
                  cursor: "pointer", transition: "background .15s",
                  background: selected?.id === s.id ? "#FFF8F5" : "white",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#FAFAFA")}
                onMouseLeave={e => (e.currentTarget.style.background = selected?.id === s.id ? "#FFF8F5" : "white")}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "#1A1A2E" }}>{s.user.name ?? "—"}</div>
                  <div style={{ fontSize: 12, color: "#aaa", fontWeight: 700 }}>{s.user.email}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: "#1A1A2E" }}>{s.paper.title}</div>
                  {s.paper.category && <div style={{ fontSize: 11, color: "#FF6B6B", fontWeight: 700 }}>{s.paper.category.name}</div>}
                </div>
                <div>
                  <span style={{ background: st.bg, color: st.color, fontSize: 11, fontWeight: 900, padding: "4px 10px", borderRadius: 50 }}>
                    {st.label}
                  </span>
                </div>
                <div style={{ fontWeight: 900, fontSize: 14, color: s.passed === true ? "#22C55E" : s.passed === false ? "#FF6B6B" : "#aaa" }}>
                  {s.percentage !== null ? `${s.percentage}%` : "—"}
                  {s.passed !== null && (
                    <div style={{ fontSize: 10, fontWeight: 800, marginTop: 2 }}>{s.passed ? "PASS" : "FAIL"}</div>
                  )}
                </div>
                <div style={{ fontSize: 13, color: "#777", fontWeight: 700 }}>
                  {s.timeTaken ? `${Math.floor(s.timeTaken / 60)}m ${s.timeTaken % 60}s` : "—"}
                </div>
                <div style={{ fontSize: 12, color: "#aaa", fontWeight: 700 }}>
                  {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : new Date(s.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                width: 36, height: 36, borderRadius: 8, border: "2px solid",
                cursor: "pointer", fontWeight: 800, fontSize: 13,
                background: page === p ? "#FF6B6B" : "white",
                color: page === p ? "white" : "#555",
                borderColor: page === p ? "#FF6B6B" : "#EEE",
              }}
            >{p}</button>
          ))}
        </div>
      )}

      {/* Detail Drawer */}
      {selected && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 100, display: "flex", justifyContent: "flex-end" }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{ width: 420, maxWidth: "100%", background: "white", height: "100%", overflowY: "auto", padding: 28, boxShadow: "-8px 0 40px rgba(0,0,0,.15)" }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "#1A1A2E", margin: 0 }}>Submission Detail</h3>
              <button onClick={() => setSelected(null)} style={{ background: "#F5F3EE", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>

            <Section label="Student">
              <Row label="Name" value={selected.user.name ?? "—"} />
              <Row label="Email" value={selected.user.email} />
              <Row label="Phone" value={selected.user.phone ?? "—"} />
            </Section>
            <Section label="Paper">
              <Row label="Title" value={selected.paper.title} />
              <Row label="Category" value={selected.paper.category?.name ?? "—"} />
              <Row label="Total Marks" value={String(selected.totalMarks)} />
              <Row label="Passing Marks" value={String(selected.paper.passingMarks)} />
            </Section>
            <Section label="Result">
              <Row label="Status" value={STATUS_STYLE[selected.status]?.label ?? selected.status} />
              <Row label="Score" value={selected.score !== null ? `${selected.score}/${selected.totalMarks}` : "Not submitted"} />
              <Row label="Percentage" value={selected.percentage !== null ? `${selected.percentage}%` : "—"} />
              <Row label="Result" value={selected.passed === true ? "✅ PASS" : selected.passed === false ? "❌ FAIL" : "—"} />
              <Row label="Time Taken" value={selected.timeTaken ? `${Math.floor(selected.timeTaken / 60)}m ${selected.timeTaken % 60}s` : "—"} />
              <Row label="Started" value={selected.startedAt ? new Date(selected.startedAt).toLocaleString("en-IN") : "—"} />
              <Row label="Submitted" value={selected.submittedAt ? new Date(selected.submittedAt).toLocaleString("en-IN") : "—"} />
            </Section>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 900, color: "#FF6B6B", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{label}</div>
      <div style={{ background: "#FAFAFA", borderRadius: 12, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
      <span style={{ color: "#aaa", fontWeight: 700 }}>{label}</span>
      <span style={{ fontWeight: 800, color: "#1A1A2E" }}>{value}</span>
    </div>
  );
}