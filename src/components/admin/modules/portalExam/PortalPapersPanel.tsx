// "use client";

// import { useEffect, useState } from "react";

// export interface PortalPaper {
//   id: string;
//   title: string;
//   description: string;
//   categoryId: string;
//   duration: number;      // minutes
//   totalMarks: number;
//   passingMarks: number;
//   isActive: boolean;
//   isPublished: boolean;
//   shuffleQuestions: boolean;
//   allowReview: boolean;
//   showResultImmediately: boolean;
//   startDate: string | null;
//   endDate: string | null;
//   maxAttempts: number;
//   category?: { id: string; name: string };
//   _count?: { portalQuestions: number; portalRegistrations: number };
//   createdAt: string;
// }

// interface PortalCategory { id: string; name: string; }

// const blank = (): Partial<PortalPaper> => ({
//   title: "", description: "", categoryId: "",
//   duration: 60, totalMarks: 100, passingMarks: 40,
//   isActive: true, isPublished: false, shuffleQuestions: false,
//   allowReview: true, showResultImmediately: true,
//   startDate: null, endDate: null, maxAttempts: 1,
// });

// export default function PortalPapersPanel({ onEditQuestions }: { onEditQuestions: (id: string) => void }) {
//   const [papers, setPapers] = useState<PortalPaper[]>([]);
//   const [cats, setCats] = useState<PortalCategory[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filterCat, setFilterCat] = useState("all");
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [form, setForm] = useState<Partial<PortalPaper>>(blank());
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const load = async () => {
//     setLoading(true);
//     try {
//       const [pr, cr] = await Promise.all([
//         fetch("/api/portal/papers"),
//         fetch("/api/admin/portal/categories"),
//       ]);
//       const pd = await pr.json();
//       const cd = await cr.json();
//       setPapers(pd.papers ?? []);
//       setCats(cd.categories ?? []);
//     } catch { setError("Failed to load."); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { load(); }, []);

//   const filtered = filterCat === "all" ? papers : papers.filter(p => p.categoryId === filterCat);

//   const handleSubmit = async () => {
//     if (!form.title?.trim()) return setError("Paper title is required.");
//     if (!form.categoryId) return setError("Please select a category.");
//     setSaving(true); setError("");
//     try {
//       const url = editId ? `/api/portal/papers/${editId}` : "/api/portal/papers";
//       const method = editId ? "PATCH" : "POST";
//       const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
//       if (!r.ok) throw new Error((await r.json()).error ?? "Failed");
//       setShowForm(false); setEditId(null); setForm(blank()); load();
//     } catch (e: any) { setError(e.message); }
//     finally { setSaving(false); }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this paper? All questions and submissions will be removed.")) return;
//     await fetch(`/api/portal/papers/${id}`, { method: "DELETE" });
//     load();
//   };

//   const handleTogglePublish = async (id: string, current: boolean) => {
//     await fetch(`/api/portal/papers/${id}`, {
//       method: "PATCH", headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ isPublished: !current }),
//     });
//     load();
//   };

//   const startEdit = (p: PortalPaper) => {
//     setForm({ ...p }); setEditId(p.id); setShowForm(true); setError("");
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
//         <div>
//           <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", margin: 0 }}>Exam Papers</h2>
//           <p style={{ fontSize: 13, color: "#aaa", margin: "3px 0 0", fontWeight: 700 }}>Create papers, set duration, marks, and manage questions</p>
//         </div>
//         <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//           {/* Category filter */}
//           <select
//             value={filterCat}
//             onChange={e => setFilterCat(e.target.value)}
//             style={{ ...inputStyle, width: "auto", padding: "9px 14px", fontSize: 13 }}
//           >
//             <option value="all">All Categories</option>
//             {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//           </select>
//           <button
//             onClick={() => { setShowForm(true); setEditId(null); setForm(blank()); setError(""); }}
//             style={primaryBtnStyle}
//           >
//             ➕ New Paper
//           </button>
//         </div>
//       </div>

//       {/* Form */}
//       {showForm && (
//         <div style={{
//           background: "white", borderRadius: 20, padding: 28, marginBottom: 24,
//           border: "2.5px solid #4ECDC433", boxShadow: "0 8px 32px rgba(78,205,196,.1)",
//         }}>
//           <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 17, color: "#1A1A2E", margin: "0 0 20px" }}>
//             {editId ? "✏️ Edit Paper" : "📄 New Exam Paper"}
//           </h3>
//           {error && <ErrorBanner msg={error} />}

//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
//             <div style={{ gridColumn: "1/-1" }}>
//               <label style={labelStyle}>Paper Title *</label>
//               <input value={form.title ?? ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
//                 placeholder="e.g. Maths Olympiad 2025 – Level 1" style={inputStyle} />
//             </div>
//             <div>
//               <label style={labelStyle}>Category *</label>
//               <select value={form.categoryId ?? ""} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} style={inputStyle}>
//                 <option value="">Select category…</option>
//                 {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//               </select>
//             </div>
//             <div>
//               <label style={labelStyle}>Duration (minutes)</label>
//               <input type="number" min={5} value={form.duration ?? 60}
//                 onChange={e => setForm(f => ({ ...f, duration: +e.target.value }))} style={inputStyle} />
//             </div>
//             <div>
//               <label style={labelStyle}>Total Marks</label>
//               <input type="number" min={1} value={form.totalMarks ?? 100}
//                 onChange={e => setForm(f => ({ ...f, totalMarks: +e.target.value }))} style={inputStyle} />
//             </div>
//             <div>
//               <label style={labelStyle}>Passing Marks</label>
//               <input type="number" min={0} value={form.passingMarks ?? 40}
//                 onChange={e => setForm(f => ({ ...f, passingMarks: +e.target.value }))} style={inputStyle} />
//             </div>
//             <div>
//               <label style={labelStyle}>Max Attempts</label>
//               <input type="number" min={1} value={form.maxAttempts ?? 1}
//                 onChange={e => setForm(f => ({ ...f, maxAttempts: +e.target.value }))} style={inputStyle} />
//             </div>
//             <div>
//               <label style={labelStyle}>Available From</label>
//               <input type="datetime-local" value={form.startDate?.slice(0, 16) ?? ""}
//                 onChange={e => setForm(f => ({ ...f, startDate: e.target.value || null }))} style={inputStyle} />
//             </div>
//             <div>
//               <label style={labelStyle}>Available Until</label>
//               <input type="datetime-local" value={form.endDate?.slice(0, 16) ?? ""}
//                 onChange={e => setForm(f => ({ ...f, endDate: e.target.value || null }))} style={inputStyle} />
//             </div>
//             <div style={{ gridColumn: "1/-1" }}>
//               <label style={labelStyle}>Description</label>
//               <textarea value={form.description ?? ""} rows={2}
//                 onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
//                 placeholder="Instructions or notes for students…" style={{ ...inputStyle, resize: "vertical" }} />
//             </div>
//           </div>

//           {/* Toggles */}
//           <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
//             {[
//               { key: "shuffleQuestions", label: "Shuffle Questions" },
//               { key: "allowReview",       label: "Allow Review" },
//               { key: "showResultImmediately", label: "Instant Results" },
//             ].map(({ key, label }) => (
//               <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, fontWeight: 800, color: "#555" }}>
//                 <input type="checkbox"
//                   checked={!!(form as any)[key]}
//                   onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
//                   style={{ width: 16, height: 16, accentColor: "#FF6B6B" }}
//                 />
//                 {label}
//               </label>
//             ))}
//           </div>

//           <div style={{ display: "flex", gap: 10 }}>
//             <button onClick={handleSubmit} disabled={saving} style={primaryBtnStyle}>
//               {saving ? "Saving…" : editId ? "✅ Save Changes" : "✅ Create Paper"}
//             </button>
//             <button onClick={() => { setShowForm(false); setEditId(null); setError(""); }} style={cancelBtnStyle}>Cancel</button>
//           </div>
//         </div>
//       )}

//       {/* Papers list */}
//       {loading ? (
//         <div style={{ textAlign: "center", padding: 60, color: "#aaa", fontWeight: 800 }}>Loading papers…</div>
//       ) : filtered.length === 0 ? (
//         <div style={{ textAlign: "center", padding: "60px 24px" }}>
//           <div style={{ fontSize: 52, marginBottom: 12 }}>📄</div>
//           <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>No papers found</h3>
//           <p style={{ fontSize: 13, color: "#aaa" }}>
//             {filterCat !== "all" ? "No papers in this category yet." : "Create your first exam paper to get started."}
//           </p>
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//           {filtered.map(p => (
//             <PaperRow key={p.id} paper={p} onEdit={startEdit} onDelete={handleDelete}
//               onTogglePublish={handleTogglePublish} onEditQuestions={onEditQuestions} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function PaperRow({ paper, onEdit, onDelete, onTogglePublish, onEditQuestions }: {
//   paper: PortalPaper;
//   onEdit: (p: PortalPaper) => void;
//   onDelete: (id: string) => void;
//   onTogglePublish: (id: string, current: boolean) => void;
//   onEditQuestions: (id: string) => void;
// }) {
//   const qCount = paper._count?.portalQuestions ?? 0;
//   const regCount = paper._count?.portalRegistrations ?? 0;

//   return (
//     <div style={{
//       background: "white", borderRadius: 18, padding: "18px 22px",
//       border: `2px solid ${paper.isPublished ? "#4ECDC433" : "#EEE"}`,
//       boxShadow: "0 2px 12px rgba(0,0,0,.05)",
//       display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap",
//     }}>
//       {/* Icon */}
//       <div style={{
//         width: 48, height: 48, borderRadius: 12, flexShrink: 0,
//         background: paper.isPublished ? "linear-gradient(135deg,#4ECDC4,#26C6DA)" : "linear-gradient(135deg,#DDD,#CCC)",
//         display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
//       }}>📝</div>

//       {/* Info */}
//       <div style={{ flex: 1, minWidth: 200 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
//           <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#1A1A2E" }}>{paper.title}</span>
//           <span style={{
//             fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 50, letterSpacing: "0.08em",
//             background: paper.isPublished ? "#E8FFF5" : "#FFF8EE",
//             color: paper.isPublished ? "#22C55E" : "#FFB347",
//             border: `1.5px solid ${paper.isPublished ? "#22C55E33" : "#FFB34733"}`,
//           }}>
//             {paper.isPublished ? "● LIVE" : "○ DRAFT"}
//           </span>
//           {paper.category && (
//             <span style={{ fontSize: 11, fontWeight: 800, color: "#FF6B6B", background: "#FFF0F0", padding: "3px 10px", borderRadius: 50 }}>
//               {paper.category.name}
//             </span>
//           )}
//         </div>
//         <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
//           {[
//             ["⏱", `${paper.duration} min`],
//             ["🏆", `${paper.totalMarks} marks`],
//             ["📝", `${qCount} questions`],
//             ["👥", `${regCount} registered`],
//           ].map(([icon, text]) => (
//             <span key={text as string} style={{ fontSize: 12, color: "#999", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
//               {icon} {text}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Actions */}
//       <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//         <button onClick={() => onEditQuestions(paper.id)} style={{
//           ...iconTextBtnStyle, background: "#FFF0F0", color: "#FF6B6B", borderColor: "#FF6B6B33",
//         }}>
//           ❓ Questions
//         </button>
//         <button
//           onClick={() => onTogglePublish(paper.id, paper.isPublished)}
//           style={{
//             ...iconTextBtnStyle,
//             background: paper.isPublished ? "#FFF8EE" : "#E8FFF5",
//             color: paper.isPublished ? "#FFB347" : "#22C55E",
//             borderColor: paper.isPublished ? "#FFB34733" : "#22C55E33",
//           }}
//         >
//           {paper.isPublished ? "📥 Unpublish" : "🚀 Publish"}
//         </button>
//         <button onClick={() => onEdit(paper)} style={{ ...iconTextBtnStyle, background: "#F0FFFE", color: "#4ECDC4", borderColor: "#4ECDC433" }}>✏️</button>
//         <button onClick={() => onDelete(paper.id)} style={{ ...iconTextBtnStyle, background: "#FFF0F0", color: "#FF6B6B", borderColor: "#FF6B6B33" }}>🗑️</button>
//       </div>
//     </div>
//   );
// }

// function ErrorBanner({ msg }: { msg: string }) {
//   return (
//     <div style={{ background: "#FFF0F0", border: "1.5px solid #FFD6D6", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#FF6B6B", fontWeight: 700 }}>
//       ⚠️ {msg}
//     </div>
//   );
// }

// const labelStyle: React.CSSProperties = {
//   display: "block", fontSize: 12, fontWeight: 900, color: "#555",
//   letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6,
// };
// const inputStyle: React.CSSProperties = {
//   width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14,
//   border: "2px solid #EEE", outline: "none", fontFamily: "inherit",
//   boxSizing: "border-box",
// };
// const primaryBtnStyle: React.CSSProperties = {
//   background: "linear-gradient(135deg,#FF6B6B,#FFB347)", color: "white",
//   border: "none", borderRadius: 10, padding: "11px 24px",
//   fontFamily: "inherit", fontWeight: 900, fontSize: 14, cursor: "pointer",
//   boxShadow: "0 4px 16px rgba(255,107,107,.3)",
// };
// const cancelBtnStyle: React.CSSProperties = {
//   background: "#F5F3EE", color: "#777", border: "none", borderRadius: 10,
//   padding: "11px 22px", fontFamily: "inherit", fontWeight: 800, fontSize: 14, cursor: "pointer",
// };
// const iconTextBtnStyle: React.CSSProperties = {
//   border: "1.5px solid", borderRadius: 8, padding: "7px 14px",
//   fontFamily: "inherit", fontWeight: 800, fontSize: 12, cursor: "pointer",
//   display: "flex", alignItems: "center", gap: 5,
// };















// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useAuth } from "@/context/AuthContext";

// export interface PortalPaper {
//   id: string;
//   title: string;
//   description: string;
//   categoryId: string;
//   duration: number;
//   totalMarks: number;
//   passingMarks: number;
//   isActive: boolean;
//   isPublished: boolean;
//   shuffleQuestions: boolean;
//   allowReview: boolean;
//   showResultImmediately: boolean;
//   startDate: string | null;
//   endDate: string | null;
//   maxAttempts: number;
//   category?: { id: string; name: string };
//   _count?: { portalQuestions: number; portalRegistrations: number };
//   createdAt: string;
// }

// interface PortalCategory { id: string; name: string; }

// const blank = (): Partial<PortalPaper> => ({
//   title: "", description: "", categoryId: "",
//   duration: 60, totalMarks: 100, passingMarks: 40,
//   isActive: true, isPublished: false, shuffleQuestions: false,
//   allowReview: true, showResultImmediately: true,
//   startDate: null, endDate: null, maxAttempts: 1,
// });

// export default function PortalPapersPanel({ onEditQuestions }: { onEditQuestions: (id: string) => void }) {
//   const { token } = useAuth();

//   const [papers, setPapers] = useState<PortalPaper[]>([]);
//   const [cats, setCats] = useState<PortalCategory[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filterCat, setFilterCat] = useState("all");
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [form, setForm] = useState<Partial<PortalPaper>>(blank());
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   // ── Auth headers helper ───────────────────────────────────────────────────
//   const authHeaders = useCallback(
//     (extra: Record<string, string> = {}) => ({
//       Authorization: `Bearer ${token}`,
//       ...extra,
//     }),
//     [token],
//   );

//   // ── Load papers + categories ──────────────────────────────────────────────
//   const load = useCallback(async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const [pr, cr] = await Promise.all([
//         fetch("/api/admin/portal/papers", { headers: authHeaders(), cache: "no-store" }),
//         fetch("/api/admin/portal/categories", { headers: authHeaders(), cache: "no-store" }),
//       ]);
//       const pd = await pr.json();
//       const cd = await cr.json();
//       setPapers(pd.papers ?? []);
//       setCats(cd.categories ?? []);
//     } catch {
//       setError("Failed to load.");
//     } finally {
//       setLoading(false);
//     }
//   }, [token, authHeaders]);

//   useEffect(() => { load(); }, [load]);

//   const filtered = filterCat === "all" ? papers : papers.filter(p => p.categoryId === filterCat);

//   // ── Create / Edit submit ──────────────────────────────────────────────────
//   const handleSubmit = async () => {
//     if (!form.title?.trim()) return setError("Paper title is required.");
//     if (!form.categoryId) return setError("Please select a category.");
//     setSaving(true); setError("");
//     try {
//       const url    = editId ? `/api/admin/portal/papers/${editId}` : "/api/admin/portal/papers";
//       const method = editId ? "PATCH" : "POST";
//       const r = await fetch(url, {
//         method,
//         headers: authHeaders({ "Content-Type": "application/json" }),
//         body: JSON.stringify(form),
//       });
//       if (!r.ok) throw new Error((await r.json()).error ?? "Failed");
//       setShowForm(false); setEditId(null); setForm(blank()); load();
//     } catch (e: any) {
//       setError(e.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Delete ────────────────────────────────────────────────────────────────
//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this paper? All questions and submissions will be removed.")) return;
//     await fetch(`/api/admin/portal/papers/${id}`, {
//       method: "DELETE",
//       headers: authHeaders(),
//     });
//     load();
//   };

//   // ── Toggle publish ────────────────────────────────────────────────────────
//   const handleTogglePublish = async (id: string, current: boolean) => {
//     await fetch(`/api/admin/portal/papers/${id}`, {
//       method: "PATCH",
//       headers: authHeaders({ "Content-Type": "application/json" }),
//       body: JSON.stringify({ isPublished: !current }),
//     });
//     load();
//   };

//   const startEdit = (p: PortalPaper) => {
//     setForm({ ...p }); setEditId(p.id); setShowForm(true); setError("");
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
//         <div>
//           <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", margin: 0 }}>Exam Papers</h2>
//           <p style={{ fontSize: 13, color: "#aaa", margin: "3px 0 0", fontWeight: 700 }}>Create papers, set duration, marks, and manage questions</p>
//         </div>
//         <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//           <select
//             value={filterCat}
//             onChange={e => setFilterCat(e.target.value)}
//             style={{ ...inputStyle, width: "auto", padding: "9px 14px", fontSize: 13 }}
//           >
//             <option value="all">All Categories</option>
//             {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//           </select>
//           <button
//             onClick={() => { setShowForm(true); setEditId(null); setForm(blank()); setError(""); }}
//             style={primaryBtnStyle}
//           >
//             ➕ New Paper
//           </button>
//         </div>
//       </div>

//       {/* Form */}
//       {showForm && (
//         <div style={{
//           background: "white", borderRadius: 20, padding: 28, marginBottom: 24,
//           border: "2.5px solid #4ECDC433", boxShadow: "0 8px 32px rgba(78,205,196,.1)",
//         }}>
//           <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 17, color: "#1A1A2E", margin: "0 0 20px" }}>
//             {editId ? "✏️ Edit Paper" : "📄 New Exam Paper"}
//           </h3>
//           {error && <ErrorBanner msg={error} />}

//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
//             <div style={{ gridColumn: "1/-1" }}>
//               <label style={labelStyle}>Paper Title *</label>
//               <input value={form.title ?? ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
//                 placeholder="e.g. Maths Olympiad 2025 – Level 1" style={inputStyle} />
//             </div>
//             <div>
//               <label style={labelStyle}>Category *</label>
//               <select value={form.categoryId ?? ""} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} style={inputStyle}>
//                 <option value="">Select category…</option>
//                 {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//               </select>
//             </div>
//             <div>
//               <label style={labelStyle}>Duration (minutes)</label>
//               <input type="number" min={5} value={form.duration ?? 60}
//                 onChange={e => setForm(f => ({ ...f, duration: +e.target.value }))} style={inputStyle} />
//             </div>
//             <div>
//               <label style={labelStyle}>Total Marks</label>
//               <input type="number" min={1} value={form.totalMarks ?? 100}
//                 onChange={e => setForm(f => ({ ...f, totalMarks: +e.target.value }))} style={inputStyle} />
//             </div>
//             <div>
//               <label style={labelStyle}>Passing Marks</label>
//               <input type="number" min={0} value={form.passingMarks ?? 40}
//                 onChange={e => setForm(f => ({ ...f, passingMarks: +e.target.value }))} style={inputStyle} />
//             </div>
//             <div>
//               <label style={labelStyle}>Max Attempts</label>
//               <input type="number" min={1} value={form.maxAttempts ?? 1}
//                 onChange={e => setForm(f => ({ ...f, maxAttempts: +e.target.value }))} style={inputStyle} />
//             </div>
//             <div>
//               <label style={labelStyle}>Available From</label>
//               <input type="datetime-local" value={form.startDate?.slice(0, 16) ?? ""}
//                 onChange={e => setForm(f => ({ ...f, startDate: e.target.value || null }))} style={inputStyle} />
//             </div>
//             <div>
//               <label style={labelStyle}>Available Until</label>
//               <input type="datetime-local" value={form.endDate?.slice(0, 16) ?? ""}
//                 onChange={e => setForm(f => ({ ...f, endDate: e.target.value || null }))} style={inputStyle} />
//             </div>
//             <div style={{ gridColumn: "1/-1" }}>
//               <label style={labelStyle}>Description</label>
//               <textarea value={form.description ?? ""} rows={2}
//                 onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
//                 placeholder="Instructions or notes for students…" style={{ ...inputStyle, resize: "vertical" }} />
//             </div>
//           </div>

//           {/* Toggles */}
//           <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
//             {[
//               { key: "shuffleQuestions",      label: "Shuffle Questions" },
//               { key: "allowReview",            label: "Allow Review" },
//               { key: "showResultImmediately",  label: "Instant Results" },
//             ].map(({ key, label }) => (
//               <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, fontWeight: 800, color: "#555" }}>
//                 <input type="checkbox"
//                   checked={!!(form as any)[key]}
//                   onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
//                   style={{ width: 16, height: 16, accentColor: "#FF6B6B" }}
//                 />
//                 {label}
//               </label>
//             ))}
//           </div>

//           <div style={{ display: "flex", gap: 10 }}>
//             <button onClick={handleSubmit} disabled={saving} style={primaryBtnStyle}>
//               {saving ? "Saving…" : editId ? "✅ Save Changes" : "✅ Create Paper"}
//             </button>
//             <button onClick={() => { setShowForm(false); setEditId(null); setError(""); }} style={cancelBtnStyle}>Cancel</button>
//           </div>
//         </div>
//       )}

//       {/* Papers list */}
//       {loading ? (
//         <div style={{ textAlign: "center", padding: 60, color: "#aaa", fontWeight: 800 }}>Loading papers…</div>
//       ) : filtered.length === 0 ? (
//         <div style={{ textAlign: "center", padding: "60px 24px" }}>
//           <div style={{ fontSize: 52, marginBottom: 12 }}>📄</div>
//           <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>No papers found</h3>
//           <p style={{ fontSize: 13, color: "#aaa" }}>
//             {filterCat !== "all" ? "No papers in this category yet." : "Create your first exam paper to get started."}
//           </p>
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//           {filtered.map(p => (
//             <PaperRow
//               key={p.id} paper={p}
//               onEdit={startEdit}
//               onDelete={handleDelete}
//               onTogglePublish={handleTogglePublish}
//               onEditQuestions={onEditQuestions}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function PaperRow({ paper, onEdit, onDelete, onTogglePublish, onEditQuestions }: {
//   paper: PortalPaper;
//   onEdit: (p: PortalPaper) => void;
//   onDelete: (id: string) => void;
//   onTogglePublish: (id: string, current: boolean) => void;
//   onEditQuestions: (id: string) => void;
// }) {
//   const qCount   = paper._count?.portalQuestions ?? 0;
//   const regCount = paper._count?.portalRegistrations ?? 0;

//   return (
//     <div style={{
//       background: "white", borderRadius: 18, padding: "18px 22px",
//       border: `2px solid ${paper.isPublished ? "#4ECDC433" : "#EEE"}`,
//       boxShadow: "0 2px 12px rgba(0,0,0,.05)",
//       display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap",
//     }}>
//       <div style={{
//         width: 48, height: 48, borderRadius: 12, flexShrink: 0,
//         background: paper.isPublished ? "linear-gradient(135deg,#4ECDC4,#26C6DA)" : "linear-gradient(135deg,#DDD,#CCC)",
//         display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
//       }}>📝</div>

//       <div style={{ flex: 1, minWidth: 200 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
//           <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#1A1A2E" }}>{paper.title}</span>
//           <span style={{
//             fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 50, letterSpacing: "0.08em",
//             background: paper.isPublished ? "#E8FFF5" : "#FFF8EE",
//             color: paper.isPublished ? "#22C55E" : "#FFB347",
//             border: `1.5px solid ${paper.isPublished ? "#22C55E33" : "#FFB34733"}`,
//           }}>
//             {paper.isPublished ? "● LIVE" : "○ DRAFT"}
//           </span>
//           {paper.category && (
//             <span style={{ fontSize: 11, fontWeight: 800, color: "#FF6B6B", background: "#FFF0F0", padding: "3px 10px", borderRadius: 50 }}>
//               {paper.category.name}
//             </span>
//           )}
//         </div>
//         <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
//           {[
//             ["⏱", `${paper.duration} min`],
//             ["🏆", `${paper.totalMarks} marks`],
//             ["📝", `${qCount} questions`],
//             ["👥", `${regCount} registered`],
//           ].map(([icon, text]) => (
//             <span key={text as string} style={{ fontSize: 12, color: "#999", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
//               {icon} {text}
//             </span>
//           ))}
//         </div>
//       </div>

//       <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//         <button onClick={() => onEditQuestions(paper.id)} style={{ ...iconTextBtnStyle, background: "#FFF0F0", color: "#FF6B6B", borderColor: "#FF6B6B33" }}>
//           ❓ Questions
//         </button>
//         <button
//           onClick={() => onTogglePublish(paper.id, paper.isPublished)}
//           style={{
//             ...iconTextBtnStyle,
//             background: paper.isPublished ? "#FFF8EE" : "#E8FFF5",
//             color: paper.isPublished ? "#FFB347" : "#22C55E",
//             borderColor: paper.isPublished ? "#FFB34733" : "#22C55E33",
//           }}
//         >
//           {paper.isPublished ? "📥 Unpublish" : "🚀 Publish"}
//         </button>
//         <button onClick={() => onEdit(paper)} style={{ ...iconTextBtnStyle, background: "#F0FFFE", color: "#4ECDC4", borderColor: "#4ECDC433" }}>✏️</button>
//         <button onClick={() => onDelete(paper.id)} style={{ ...iconTextBtnStyle, background: "#FFF0F0", color: "#FF6B6B", borderColor: "#FF6B6B33" }}>🗑️</button>
//       </div>
//     </div>
//   );
// }

// function ErrorBanner({ msg }: { msg: string }) {
//   return (
//     <div style={{ background: "#FFF0F0", border: "1.5px solid #FFD6D6", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#FF6B6B", fontWeight: 700 }}>
//       ⚠️ {msg}
//     </div>
//   );
// }

// const labelStyle: React.CSSProperties = {
//   display: "block", fontSize: 12, fontWeight: 900, color: "#555",
//   letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6,
// };
// const inputStyle: React.CSSProperties = {
//   width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14,
//   border: "2px solid #EEE", outline: "none", fontFamily: "inherit",
//   boxSizing: "border-box",
// };
// const primaryBtnStyle: React.CSSProperties = {
//   background: "linear-gradient(135deg,#FF6B6B,#FFB347)", color: "white",
//   border: "none", borderRadius: 10, padding: "11px 24px",
//   fontFamily: "inherit", fontWeight: 900, fontSize: 14, cursor: "pointer",
//   boxShadow: "0 4px 16px rgba(255,107,107,.3)",
// };
// const cancelBtnStyle: React.CSSProperties = {
//   background: "#F5F3EE", color: "#777", border: "none", borderRadius: 10,
//   padding: "11px 22px", fontFamily: "inherit", fontWeight: 800, fontSize: 14, cursor: "pointer",
// };
// const iconTextBtnStyle: React.CSSProperties = {
//   border: "1.5px solid", borderRadius: 8, padding: "7px 14px",
//   fontFamily: "inherit", fontWeight: 800, fontSize: 12, cursor: "pointer",
//   display: "flex", alignItems: "center", gap: 5,
// };















// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useAuth } from "@/context/AuthContext";

// export interface PortalPaper {
//   id: string;
//   title: string;
//   description: string;
//   categoryId: string;
//   duration: number;
//   totalMarks: number;
//   passingMarks: number;
//   isActive: boolean;
//   isPublished: boolean;
//   shuffleQuestions: boolean;
//   allowReview: boolean;
//   showResultImmediately: boolean;
//   startDate: string | null;
//   endDate: string | null;
//   maxAttempts: number;
//   category?: { id: string; name: string };
//   _count?: { portalQuestions: number; portalRegistrations: number };
//   createdAt: string;
// }

// interface PortalCategory { id: string; name: string; }

// const blank = (): Partial<PortalPaper> => ({
//   title: "", description: "", categoryId: "",
//   duration: 60, totalMarks: 100, passingMarks: 40,
//   isActive: true, isPublished: false, shuffleQuestions: false,
//   allowReview: true, showResultImmediately: true,
//   startDate: null, endDate: null, maxAttempts: 1,
// });

// export default function PortalPapersPanel({ onEditQuestions }: { onEditQuestions: (id: string) => void }) {
//   const { token } = useAuth();

//   const [papers, setPapers] = useState<PortalPaper[]>([]);
//   const [cats, setCats] = useState<PortalCategory[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filterCat, setFilterCat] = useState("all");
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [form, setForm] = useState<Partial<PortalPaper>>(blank());
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   // ── Auth headers helper ───────────────────────────────────────────────────
//   const authHeaders = useCallback(
//     (extra: Record<string, string> = {}) => ({
//       Authorization: `Bearer ${token}`,
//       ...extra,
//     }),
//     [token],
//   );

//   // ── Load papers + categories ──────────────────────────────────────────────
//   const load = useCallback(async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const [pr, cr] = await Promise.all([
//         fetch("/api/admin/portal/papers", { headers: authHeaders(), cache: "no-store" }),
//         fetch("/api/admin/portal/categories", { headers: authHeaders(), cache: "no-store" }),
//       ]);
//       const pd = await pr.json();
//       const cd = await cr.json();
//       setPapers(pd.papers ?? []);
//       setCats(cd.categories ?? []);
//     } catch {
//       setError("Failed to load.");
//     } finally {
//       setLoading(false);
//     }
//   }, [token, authHeaders]);

//   useEffect(() => { load(); }, [load]);

//   const filtered = filterCat === "all" ? papers : papers.filter(p => p.categoryId === filterCat);

//   // ── Create / Edit submit ──────────────────────────────────────────────────
//   const handleSubmit = async () => {
//     if (!form.title?.trim()) return setError("Paper title is required.");
//     if (!form.categoryId) return setError("Please select a category.");
//     setSaving(true); setError("");
//     try {
//       const url    = editId ? `/api/admin/portal/papers/${editId}` : "/api/admin/portal/papers";
//       const method = editId ? "PATCH" : "POST";
//       const r = await fetch(url, {
//         method,
//         headers: authHeaders({ "Content-Type": "application/json" }),
//         body: JSON.stringify(form),
//       });
//       if (!r.ok) throw new Error((await r.json()).error ?? "Failed");
//       setShowForm(false); setEditId(null); setForm(blank()); load();
//     } catch (e: any) {
//       setError(e.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Delete ────────────────────────────────────────────────────────────────
//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this paper? All questions and submissions will be removed.")) return;
//     try {
//       const r = await fetch(`/api/admin/portal/papers/${id}`, {
//         method: "DELETE",
//         headers: authHeaders(),
//       });
//       if (!r.ok) throw new Error((await r.json()).error ?? "Delete failed");
//       load();
//     } catch (e: any) {
//       setError(e.message);
//     }
//   };

//   // ── Toggle publish ────────────────────────────────────────────────────────
//   const handleTogglePublish = async (id: string, current: boolean) => {
//     try {
//       const r = await fetch(`/api/admin/portal/papers/${id}`, {
//         method: "PATCH",
//         headers: authHeaders({ "Content-Type": "application/json" }),
//         body: JSON.stringify({ isPublished: !current }),
//       });
//       if (!r.ok) throw new Error((await r.json()).error ?? "Update failed");
//       load();
//     } catch (e: any) {
//       setError(e.message);
//     }
//   };

//   const startEdit = (p: PortalPaper) => {
//     setForm({ ...p }); setEditId(p.id); setShowForm(true); setError("");
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
//         <div>
//           <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", margin: 0 }}>Exam Papers</h2>
//           <p style={{ fontSize: 13, color: "#aaa", margin: "3px 0 0", fontWeight: 700 }}>Create papers, set duration, marks, and manage questions</p>
//         </div>
//         <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//           <select
//             value={filterCat}
//             onChange={e => setFilterCat(e.target.value)}
//             style={{ ...inputStyle, width: "auto", padding: "9px 14px", fontSize: 13 }}
//           >
//             <option value="all">All Categories</option>
//             {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//           </select>
//           <button
//             onClick={() => { setShowForm(true); setEditId(null); setForm(blank()); setError(""); }}
//             style={primaryBtnStyle}
//           >
//             ➕ New Paper
//           </button>
//         </div>
//       </div>

//       {/* Standalone error (e.g. from delete/toggle) */}
//       {error && !showForm && <ErrorBanner msg={error} />}

//       {/* Form */}
//       {showForm && (
//         <div style={{
//           background: "white", borderRadius: 20, padding: 28, marginBottom: 24,
//           border: "2.5px solid #4ECDC433", boxShadow: "0 8px 32px rgba(78,205,196,.1)",
//         }}>
//           <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 17, color: "#1A1A2E", margin: "0 0 20px" }}>
//             {editId ? "✏️ Edit Paper" : "📄 New Exam Paper"}
//           </h3>
//           {error && <ErrorBanner msg={error} />}

//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
//             <div style={{ gridColumn: "1/-1" }}>
//               <label style={labelStyle}>Paper Title *</label>
//               <input value={form.title ?? ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
//                 placeholder="e.g. Maths Olympiad 2025 – Level 1" style={inputStyle} />
//             </div>
//             <div>
//               <label style={labelStyle}>Category *</label>
//               <select value={form.categoryId ?? ""} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} style={inputStyle}>
//                 <option value="">Select category…</option>
//                 {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//               </select>
//             </div>
//             <div>
//               <label style={labelStyle}>Duration (minutes)</label>
//               <input type="number" min={5} value={form.duration ?? 60}
//                 onChange={e => setForm(f => ({ ...f, duration: +e.target.value }))} style={inputStyle} />
//             </div>
//             <div>
//               <label style={labelStyle}>Total Marks</label>
//               <input type="number" min={1} value={form.totalMarks ?? 100}
//                 onChange={e => setForm(f => ({ ...f, totalMarks: +e.target.value }))} style={inputStyle} />
//             </div>
//             <div>
//               <label style={labelStyle}>Passing Marks</label>
//               <input type="number" min={0} value={form.passingMarks ?? 40}
//                 onChange={e => setForm(f => ({ ...f, passingMarks: +e.target.value }))} style={inputStyle} />
//             </div>
//             <div>
//               <label style={labelStyle}>Max Attempts</label>
//               <input type="number" min={1} value={form.maxAttempts ?? 1}
//                 onChange={e => setForm(f => ({ ...f, maxAttempts: +e.target.value }))} style={inputStyle} />
//             </div>
//             <div>
//               <label style={labelStyle}>Available From</label>
//               <input type="datetime-local" value={form.startDate?.slice(0, 16) ?? ""}
//                 onChange={e => setForm(f => ({ ...f, startDate: e.target.value || null }))} style={inputStyle} />
//             </div>
//             <div>
//               <label style={labelStyle}>Available Until</label>
//               <input type="datetime-local" value={form.endDate?.slice(0, 16) ?? ""}
//                 onChange={e => setForm(f => ({ ...f, endDate: e.target.value || null }))} style={inputStyle} />
//             </div>
//             <div style={{ gridColumn: "1/-1" }}>
//               <label style={labelStyle}>Description</label>
//               <textarea value={form.description ?? ""} rows={2}
//                 onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
//                 placeholder="Instructions or notes for students…" style={{ ...inputStyle, resize: "vertical" }} />
//             </div>
//           </div>

//           {/* Toggles */}
//           <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
//             {[
//               { key: "shuffleQuestions",      label: "Shuffle Questions" },
//               { key: "allowReview",            label: "Allow Review" },
//               { key: "showResultImmediately",  label: "Instant Results" },
//             ].map(({ key, label }) => (
//               <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, fontWeight: 800, color: "#555" }}>
//                 <input type="checkbox"
//                   checked={!!(form as any)[key]}
//                   onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
//                   style={{ width: 16, height: 16, accentColor: "#FF6B6B" }}
//                 />
//                 {label}
//               </label>
//             ))}
//           </div>

//           <div style={{ display: "flex", gap: 10 }}>
//             <button onClick={handleSubmit} disabled={saving} style={primaryBtnStyle}>
//               {saving ? "Saving…" : editId ? "✅ Save Changes" : "✅ Create Paper"}
//             </button>
//             <button onClick={() => { setShowForm(false); setEditId(null); setError(""); }} style={cancelBtnStyle}>Cancel</button>
//           </div>
//         </div>
//       )}

//       {/* Papers list */}
//       {loading ? (
//         <div style={{ textAlign: "center", padding: 60, color: "#aaa", fontWeight: 800 }}>Loading papers…</div>
//       ) : filtered.length === 0 ? (
//         <div style={{ textAlign: "center", padding: "60px 24px" }}>
//           <div style={{ fontSize: 52, marginBottom: 12 }}>📄</div>
//           <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>No papers found</h3>
//           <p style={{ fontSize: 13, color: "#aaa" }}>
//             {filterCat !== "all" ? "No papers in this category yet." : "Create your first exam paper to get started."}
//           </p>
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//           {filtered.map(p => (
//             <PaperRow
//               key={p.id} paper={p}
//               onEdit={startEdit}
//               onDelete={handleDelete}
//               onTogglePublish={handleTogglePublish}
//               onEditQuestions={onEditQuestions}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function PaperRow({ paper, onEdit, onDelete, onTogglePublish, onEditQuestions }: {
//   paper: PortalPaper;
//   onEdit: (p: PortalPaper) => void;
//   onDelete: (id: string) => void;
//   onTogglePublish: (id: string, current: boolean) => void;
//   onEditQuestions: (id: string) => void;
// }) {
//   const qCount   = paper._count?.portalQuestions ?? 0;
//   const regCount = paper._count?.portalRegistrations ?? 0;

//   return (
//     <div style={{
//       background: "white", borderRadius: 18, padding: "18px 22px",
//       border: `2px solid ${paper.isPublished ? "#4ECDC433" : "#EEE"}`,
//       boxShadow: "0 2px 12px rgba(0,0,0,.05)",
//       display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap",
//     }}>
//       <div style={{
//         width: 48, height: 48, borderRadius: 12, flexShrink: 0,
//         background: paper.isPublished ? "linear-gradient(135deg,#4ECDC4,#26C6DA)" : "linear-gradient(135deg,#DDD,#CCC)",
//         display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
//       }}>📝</div>

//       <div style={{ flex: 1, minWidth: 200 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
//           <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#1A1A2E" }}>{paper.title}</span>
//           <span style={{
//             fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 50, letterSpacing: "0.08em",
//             background: paper.isPublished ? "#E8FFF5" : "#FFF8EE",
//             color: paper.isPublished ? "#22C55E" : "#FFB347",
//             border: `1.5px solid ${paper.isPublished ? "#22C55E33" : "#FFB34733"}`,
//           }}>
//             {paper.isPublished ? "● LIVE" : "○ DRAFT"}
//           </span>
//           {paper.category && (
//             <span style={{ fontSize: 11, fontWeight: 800, color: "#FF6B6B", background: "#FFF0F0", padding: "3px 10px", borderRadius: 50 }}>
//               {paper.category.name}
//             </span>
//           )}
//         </div>
//         <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
//           {[
//             ["⏱", `${paper.duration} min`],
//             ["🏆", `${paper.totalMarks} marks`],
//             ["📝", `${qCount} questions`],
//             ["👥", `${regCount} registered`],
//           ].map(([icon, text]) => (
//             <span key={text as string} style={{ fontSize: 12, color: "#999", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
//               {icon} {text}
//             </span>
//           ))}
//         </div>
//       </div>

//       <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//         <button onClick={() => onEditQuestions(paper.id)} style={{ ...iconTextBtnStyle, background: "#FFF0F0", color: "#FF6B6B", borderColor: "#FF6B6B33" }}>
//           ❓ Questions
//         </button>
//         <button
//           onClick={() => onTogglePublish(paper.id, paper.isPublished)}
//           style={{
//             ...iconTextBtnStyle,
//             background: paper.isPublished ? "#FFF8EE" : "#E8FFF5",
//             color: paper.isPublished ? "#FFB347" : "#22C55E",
//             borderColor: paper.isPublished ? "#FFB34733" : "#22C55E33",
//           }}
//         >
//           {paper.isPublished ? "📥 Unpublish" : "🚀 Publish"}
//         </button>
//         <button onClick={() => onEdit(paper)} style={{ ...iconTextBtnStyle, background: "#F0FFFE", color: "#4ECDC4", borderColor: "#4ECDC433" }}>✏️</button>
//         <button onClick={() => onDelete(paper.id)} style={{ ...iconTextBtnStyle, background: "#FFF0F0", color: "#FF6B6B", borderColor: "#FF6B6B33" }}>🗑️</button>
//       </div>
//     </div>
//   );
// }

// function ErrorBanner({ msg }: { msg: string }) {
//   return (
//     <div style={{ background: "#FFF0F0", border: "1.5px solid #FFD6D6", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#FF6B6B", fontWeight: 700 }}>
//       ⚠️ {msg}
//     </div>
//   );
// }

// const labelStyle: React.CSSProperties = {
//   display: "block", fontSize: 12, fontWeight: 900, color: "#555",
//   letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6,
// };
// const inputStyle: React.CSSProperties = {
//   width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14,
//   border: "2px solid #EEE", outline: "none", fontFamily: "inherit",
//   boxSizing: "border-box",
// };
// const primaryBtnStyle: React.CSSProperties = {
//   background: "linear-gradient(135deg,#FF6B6B,#FFB347)", color: "white",
//   border: "none", borderRadius: 10, padding: "11px 24px",
//   fontFamily: "inherit", fontWeight: 900, fontSize: 14, cursor: "pointer",
//   boxShadow: "0 4px 16px rgba(255,107,107,.3)",
// };
// const cancelBtnStyle: React.CSSProperties = {
//   background: "#F5F3EE", color: "#777", border: "none", borderRadius: 10,
//   padding: "11px 22px", fontFamily: "inherit", fontWeight: 800, fontSize: 14, cursor: "pointer",
// };
// const iconTextBtnStyle: React.CSSProperties = {
//   border: "1.5px solid", borderRadius: 8, padding: "7px 14px",
//   fontFamily: "inherit", fontWeight: 800, fontSize: 12, cursor: "pointer",
//   display: "flex", alignItems: "center", gap: 5,
// };























"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

export interface PortalPaper {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  isActive: boolean;
  isPublished: boolean;
  shuffleQuestions: boolean;
  allowReview: boolean;
  showResultImmediately: boolean;
  startDate: string | null;
  endDate: string | null;
  maxAttempts: number;
  category?: { id: string; name: string };
  _count?: { portalQuestions: number; portalRegistrations: number };
  createdAt: string;
}

interface PortalCategory { id: string; name: string; }

const blank = (): Partial<PortalPaper> => ({
  title: "", description: "", categoryId: "",
  duration: 60, totalMarks: 100, passingMarks: 40,
  isActive: true, isPublished: false, shuffleQuestions: false,
  allowReview: true, showResultImmediately: true,
  startDate: null, endDate: null, maxAttempts: 1,
});

export default function PortalPapersPanel({ onEditQuestions }: { onEditQuestions: (id: string) => void }) {
  const { token } = useAuth();

  const [papers,    setPapers]    = useState<PortalPaper[]>([]);
  const [cats,      setCats]      = useState<PortalCategory[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [filterCat, setFilterCat] = useState("all");
  const [showForm,  setShowForm]  = useState(false);
  const [editId,    setEditId]    = useState<string | null>(null);
  const [form,      setForm]      = useState<Partial<PortalPaper>>(blank());
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState("");

  // "open" = no schedule, "scheduled" = has start+end dates
  const [examMode, setExamMode] = useState<"open" | "scheduled">("open");

  const authHeaders = useCallback(
    (extra: Record<string, string> = {}) => ({
      Authorization: `Bearer ${token}`, ...extra,
    }),
    [token],
  );

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [pr, cr] = await Promise.all([
        fetch("/api/admin/portal/papers",     { headers: authHeaders(), cache: "no-store" }),
        fetch("/api/admin/portal/categories", { headers: authHeaders(), cache: "no-store" }),
      ]);
      setPapers((await pr.json()).papers ?? []);
      setCats((await cr.json()).categories ?? []);
    } catch { setError("Failed to load."); }
    finally { setLoading(false); }
  }, [token, authHeaders]);

  useEffect(() => { load(); }, [load]);

  const filtered = filterCat === "all" ? papers : papers.filter(p => p.categoryId === filterCat);

  const openForm = (paper?: PortalPaper) => {
    if (paper) {
      setForm({ ...paper });
      setEditId(paper.id);
      // Detect mode from existing data
      setExamMode(paper.startDate || paper.endDate ? "scheduled" : "open");
    } else {
      setForm(blank());
      setEditId(null);
      setExamMode("open");
    }
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.title?.trim())  return setError("Paper title is required.");
    if (!form.categoryId)     return setError("Please select a category.");

    // If open mode, clear any dates
    const payload = {
      ...form,
      startDate: examMode === "scheduled" ? form.startDate : null,
      endDate:   examMode === "scheduled" ? form.endDate   : null,
    };

    setSaving(true); setError("");
    try {
      const url    = editId ? `/api/admin/portal/papers/${editId}` : "/api/admin/portal/papers";
      const method = editId ? "PATCH" : "POST";
      const r = await fetch(url, {
        method,
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error((await r.json()).error ?? "Failed");
      setShowForm(false); setEditId(null); setForm(blank()); load();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this paper? All questions and submissions will be removed.")) return;
    try {
      const r = await fetch(`/api/admin/portal/papers/${id}`, {
        method: "DELETE", headers: authHeaders(),
      });
      if (!r.ok) throw new Error((await r.json()).error ?? "Delete failed");
      load();
    } catch (e: any) { setError(e.message); }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      const r = await fetch(`/api/admin/portal/papers/${id}`, {
        method: "PATCH",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ isPublished: !current }),
      });
      if (!r.ok) throw new Error((await r.json()).error ?? "Update failed");
      load();
    } catch (e: any) { setError(e.message); }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", margin: 0 }}>Exam Papers</h2>
          <p style={{ fontSize: 13, color: "#aaa", margin: "3px 0 0", fontWeight: 700 }}>Create papers, set duration, marks, and manage questions</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            style={{ ...inputStyle, width: "auto", padding: "9px 14px", fontSize: 13 }}
          >
            <option value="all">All Categories</option>
            {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={() => openForm()} style={primaryBtnStyle}>➕ New Paper</button>
        </div>
      </div>

      {error && !showForm && <ErrorBanner msg={error} />}

      {/* ── Form ── */}
      {showForm && (
        <div style={{
          background: "white", borderRadius: 20, padding: 28, marginBottom: 24,
          border: "2.5px solid #4ECDC433", boxShadow: "0 8px 32px rgba(78,205,196,.1)",
        }}>
          <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 17, color: "#1A1A2E", margin: "0 0 20px" }}>
            {editId ? "✏️ Edit Paper" : "📄 New Exam Paper"}
          </h3>
          {error && <ErrorBanner msg={error} />}

          {/* ── Exam Mode Toggle ── */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Exam Mode</label>
            <div style={{ display: "flex", gap: 10 }}>
              {(["open", "scheduled"] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setExamMode(mode)}
                  style={{
                    flex: 1, padding: "14px 20px", borderRadius: 14, cursor: "pointer",
                    fontFamily: "inherit", fontWeight: 900, fontSize: 14,
                    border: `2.5px solid ${examMode === mode ? (mode === "open" ? "#4ECDC4" : "#FF6B6B") : "#EEE"}`,
                    background: examMode === mode
                      ? (mode === "open" ? "#F0FFFE" : "#FFF0F0")
                      : "#FAFAFA",
                    color: examMode === mode
                      ? (mode === "open" ? "#4ECDC4" : "#FF6B6B")
                      : "#999",
                    transition: "all .2s",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>
                    {mode === "open" ? "🔓" : "📅"}
                  </div>
                  <div>{mode === "open" ? "Open / Anytime" : "Scheduled"}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, marginTop: 3, opacity: 0.8 }}>
                    {mode === "open"
                      ? "Users attempt whenever they want"
                      : "Locked to a specific date & time window"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>Paper Title *</label>
              <input
                value={form.title ?? ""}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Maths Olympiad 2025 – Level 1"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Category *</label>
              <select
                value={form.categoryId ?? ""}
                onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                style={inputStyle}
              >
                <option value="">Select category…</option>
                {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Duration (minutes)</label>
              <input
                type="number" min={5} value={form.duration ?? 60}
                onChange={e => setForm(f => ({ ...f, duration: +e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Total Marks</label>
              <input
                type="number" min={1} value={form.totalMarks ?? 100}
                onChange={e => setForm(f => ({ ...f, totalMarks: +e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Passing Marks</label>
              <input
                type="number" min={0} value={form.passingMarks ?? 40}
                onChange={e => setForm(f => ({ ...f, passingMarks: +e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Max Attempts</label>
              <input
                type="number" min={1} value={form.maxAttempts ?? 1}
                onChange={e => setForm(f => ({ ...f, maxAttempts: +e.target.value }))}
                style={inputStyle}
              />
            </div>

            {/* Date fields — only shown in scheduled mode */}
            {examMode === "scheduled" && (
              <>
                <div>
                  <label style={labelStyle}>Available From *</label>
                  <input
                    type="datetime-local"
                    value={form.startDate?.slice(0, 16) ?? ""}
                    onChange={e => setForm(f => ({ ...f, startDate: e.target.value || null }))}
                    style={{
                      ...inputStyle,
                      borderColor: "#FF6B6B44",
                      background: "#FFF8F8",
                    }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Available Until *</label>
                  <input
                    type="datetime-local"
                    value={form.endDate?.slice(0, 16) ?? ""}
                    onChange={e => setForm(f => ({ ...f, endDate: e.target.value || null }))}
                    style={{
                      ...inputStyle,
                      borderColor: "#FF6B6B44",
                      background: "#FFF8F8",
                    }}
                  />
                </div>
              </>
            )}

            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>Description</label>
              <textarea
                value={form.description ?? ""} rows={2}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Instructions or notes for students…"
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
          </div>

          {/* Toggles */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
            {[
              { key: "shuffleQuestions",     label: "Shuffle Questions" },
              { key: "allowReview",           label: "Allow Review" },
              { key: "showResultImmediately", label: "Instant Results" },
            ].map(({ key, label }) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, fontWeight: 800, color: "#555" }}>
                <input
                  type="checkbox"
                  checked={!!(form as any)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                  style={{ width: 16, height: 16, accentColor: "#FF6B6B" }}
                />
                {label}
              </label>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleSubmit} disabled={saving} style={primaryBtnStyle}>
              {saving ? "Saving…" : editId ? "✅ Save Changes" : "✅ Create Paper"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditId(null); setError(""); }}
              style={cancelBtnStyle}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Papers list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#aaa", fontWeight: 800 }}>Loading papers…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 24px" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>📄</div>
          <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>No papers found</h3>
          <p style={{ fontSize: 13, color: "#aaa" }}>
            {filterCat !== "all" ? "No papers in this category yet." : "Create your first exam paper to get started."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map(p => (
            <PaperRow
              key={p.id} paper={p}
              onEdit={openForm}
              onDelete={handleDelete}
              onTogglePublish={handleTogglePublish}
              onEditQuestions={onEditQuestions}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PaperRow({ paper, onEdit, onDelete, onTogglePublish, onEditQuestions }: {
  paper: PortalPaper;
  onEdit: (p: PortalPaper) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, current: boolean) => void;
  onEditQuestions: (id: string) => void;
}) {
  const qCount   = paper._count?.portalQuestions ?? 0;
  const regCount = paper._count?.portalRegistrations ?? 0;
  const isScheduled = !!(paper.startDate || paper.endDate);

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{
      background: "white", borderRadius: 18, padding: "18px 22px",
      border: `2px solid ${paper.isPublished ? "#4ECDC433" : "#EEE"}`,
      boxShadow: "0 2px 12px rgba(0,0,0,.05)",
      display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
        background: paper.isPublished ? "linear-gradient(135deg,#4ECDC4,#26C6DA)" : "linear-gradient(135deg,#DDD,#CCC)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
      }}>📝</div>

      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
          <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#1A1A2E" }}>{paper.title}</span>
          <span style={{
            fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 50, letterSpacing: "0.08em",
            background: paper.isPublished ? "#E8FFF5" : "#FFF8EE",
            color: paper.isPublished ? "#22C55E" : "#FFB347",
            border: `1.5px solid ${paper.isPublished ? "#22C55E33" : "#FFB34733"}`,
          }}>
            {paper.isPublished ? "● LIVE" : "○ DRAFT"}
          </span>
          {/* Mode badge */}
          <span style={{
            fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 50,
            background: isScheduled ? "#FFF0F0" : "#F0FFFE",
            color: isScheduled ? "#FF6B6B" : "#4ECDC4",
            border: `1.5px solid ${isScheduled ? "#FF6B6B33" : "#4ECDC433"}`,
          }}>
            {isScheduled ? "📅 Scheduled" : "🔓 Open"}
          </span>
          {paper.category && (
            <span style={{ fontSize: 11, fontWeight: 800, color: "#FF6B6B", background: "#FFF0F0", padding: "3px 10px", borderRadius: 50 }}>
              {paper.category.name}
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            ["⏱", `${paper.duration} min`],
            ["🏆", `${paper.totalMarks} marks`],
            ["📝", `${qCount} questions`],
            ["👥", `${regCount} registered`],
          ].map(([icon, text]) => (
            <span key={text as string} style={{ fontSize: 12, color: "#999", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              {icon} {text}
            </span>
          ))}
        </div>

        {/* Schedule window — shown only when scheduled */}
        {isScheduled && (
          <div style={{ marginTop: 6, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {paper.startDate && (
              <span style={{ fontSize: 11, fontWeight: 800, color: "#4ECDC4", display: "flex", alignItems: "center", gap: 4 }}>
                🟢 From: {formatDate(paper.startDate)}
              </span>
            )}
            {paper.endDate && (
              <span style={{ fontSize: 11, fontWeight: 800, color: "#FF6B6B", display: "flex", alignItems: "center", gap: 4 }}>
                🔴 Until: {formatDate(paper.endDate)}
              </span>
            )}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={() => onEditQuestions(paper.id)}
          style={{ ...iconTextBtnStyle, background: "#FFF0F0", color: "#FF6B6B", borderColor: "#FF6B6B33" }}
        >
          ❓ Questions
        </button>
        <button
          onClick={() => onTogglePublish(paper.id, paper.isPublished)}
          style={{
            ...iconTextBtnStyle,
            background: paper.isPublished ? "#FFF8EE" : "#E8FFF5",
            color: paper.isPublished ? "#FFB347" : "#22C55E",
            borderColor: paper.isPublished ? "#FFB34733" : "#22C55E33",
          }}
        >
          {paper.isPublished ? "📥 Unpublish" : "🚀 Publish"}
        </button>
        <button
          onClick={() => onEdit(paper)}
          style={{ ...iconTextBtnStyle, background: "#F0FFFE", color: "#4ECDC4", borderColor: "#4ECDC433" }}
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(paper.id)}
          style={{ ...iconTextBtnStyle, background: "#FFF0F0", color: "#FF6B6B", borderColor: "#FF6B6B33" }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div style={{ background: "#FFF0F0", border: "1.5px solid #FFD6D6", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#FF6B6B", fontWeight: 700 }}>
      ⚠️ {msg}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 900, color: "#555",
  letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14,
  border: "2px solid #EEE", outline: "none", fontFamily: "inherit",
  boxSizing: "border-box",
};
const primaryBtnStyle: React.CSSProperties = {
  background: "linear-gradient(135deg,#FF6B6B,#FFB347)", color: "white",
  border: "none", borderRadius: 10, padding: "11px 24px",
  fontFamily: "inherit", fontWeight: 900, fontSize: 14, cursor: "pointer",
  boxShadow: "0 4px 16px rgba(255,107,107,.3)",
};
const cancelBtnStyle: React.CSSProperties = {
  background: "#F5F3EE", color: "#777", border: "none", borderRadius: 10,
  padding: "11px 22px", fontFamily: "inherit", fontWeight: 800, fontSize: 14, cursor: "pointer",
};
const iconTextBtnStyle: React.CSSProperties = {
  border: "1.5px solid", borderRadius: 8, padding: "7px 14px",
  fontFamily: "inherit", fontWeight: 800, fontSize: 12, cursor: "pointer",
  display: "flex", alignItems: "center", gap: 5,
};