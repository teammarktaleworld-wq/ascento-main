// "use client";

// import { useEffect, useState } from "react";

// interface PortalCategory {
//   id: string;
//   name: string;
//   description: string;
//   slug: string;
//   isActive: boolean;
//   _count?: { portalPapers: number };
//   createdAt: string;
// }

// const COLOR_MAP: Record<number, { color: string; bg: string; emoji: string }> = {
//   0: { color: "#FF6B6B", bg: "#FFF0F0", emoji: "🏆" },
//   1: { color: "#4ECDC4", bg: "#F0FFFE", emoji: "🎯" },
//   2: { color: "#FFB347", bg: "#FFF8EE", emoji: "📚" },
//   3: { color: "#A78BFA", bg: "#F5F0FF", emoji: "🧠" },
//   4: { color: "#F06292", bg: "#FFF0F5", emoji: "⭐" },
// };

// const blankForm = { name: "", description: "", slug: "" };

// export default function PortalCategoriesPanel() {
//   const [cats, setCats] = useState<PortalCategory[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState(blankForm);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [saving, setSaving] = useState(false);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [error, setError] = useState("");

//   const load = async () => {
//     setLoading(true);
//     try {
//       const r = await fetch("/api/admin/portal/categories");
//       const d = await r.json();
//       setCats(d.categories ?? []);
//     } catch { setError("Failed to load categories."); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { load(); }, []);

//   const handleNameChange = (name: string) => {
//     setForm(f => ({
//       ...f,
//       name,
//       slug: editId ? f.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
//     }));
//   };

//   const handleSubmit = async () => {
//     if (!form.name.trim()) return setError("Category name is required.");
//     setSaving(true); setError("");
//     try {
//       const url = editId ? `/api/admin/portal/categories/${editId}` : "/api/admin/portal/categories";
//       const method = editId ? "PATCH" : "POST";
//       const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
//       if (!r.ok) throw new Error((await r.json()).error ?? "Failed");
//       setShowForm(false); setEditId(null); setForm(blankForm);
//       load();
//     } catch (e: any) { setError(e.message); }
//     finally { setSaving(false); }
//   };

//   const handleToggle = async (id: string, isActive: boolean) => {
//     await fetch(`/api/admin/portal/categories/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !isActive }) });
//     load();
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this category? All papers inside will also be removed.")) return;
//     setDeletingId(id);
//     await fetch(`/api/admin/portal/categories/${id}`, { method: "DELETE" });
//     setDeletingId(null); load();
//   };

//   const startEdit = (c: PortalCategory) => {
//     setForm({ name: c.name, description: c.description, slug: c.slug });
//     setEditId(c.id); setShowForm(true); setError("");
//   };

//   return (
//     <div>
//       {/* Header row */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
//         <div>
//           <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", margin: 0 }}>
//             Exam Categories
//           </h2>
//           <p style={{ fontSize: 13, color: "#aaa", margin: "3px 0 0", fontWeight: 700 }}>
//             Organise your exam papers into categories (e.g. Olympiad, Mock Tests)
//           </p>
//         </div>
//         <button
//           onClick={() => { setShowForm(true); setEditId(null); setForm(blankForm); setError(""); }}
//           style={{
//             background: "linear-gradient(135deg,#FF6B6B,#FFB347)", color: "white",
//             border: "none", borderRadius: 12, padding: "10px 20px",
//             fontFamily: "inherit", fontWeight: 900, fontSize: 14, cursor: "pointer",
//             display: "flex", alignItems: "center", gap: 8,
//             boxShadow: "0 4px 16px rgba(255,107,107,.35)",
//           }}
//         >
//           ➕ New Category
//         </button>
//       </div>

//       {/* Inline Form */}
//       {showForm && (
//         <div style={{
//           background: "white", borderRadius: 20, padding: 28, marginBottom: 24,
//           border: "2.5px solid #FF6B6B33", boxShadow: "0 8px 32px rgba(255,107,107,.1)",
//         }}>
//           <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 17, color: "#1A1A2E", margin: "0 0 20px" }}>
//             {editId ? "✏️ Edit Category" : "🆕 New Category"}
//           </h3>
//           {error && (
//             <div style={{ background: "#FFF0F0", border: "1.5px solid #FFD6D6", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#FF6B6B", fontWeight: 700 }}>
//               ⚠️ {error}
//             </div>
//           )}
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
//             <div>
//               <label style={labelStyle}>Category Name *</label>
//               <input
//                 value={form.name}
//                 onChange={e => handleNameChange(e.target.value)}
//                 placeholder="e.g. Olympiad Exams"
//                 style={inputStyle}
//               />
//             </div>
//             <div>
//               <label style={labelStyle}>URL Slug</label>
//               <input
//                 value={form.slug}
//                 onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
//                 placeholder="olympiad-exams"
//                 style={{ ...inputStyle, background: "#F9F9F9", color: "#777" }}
//               />
//             </div>
//           </div>
//           <div style={{ marginBottom: 20 }}>
//             <label style={labelStyle}>Description</label>
//             <textarea
//               value={form.description}
//               onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
//               placeholder="Brief description of what this category contains…"
//               rows={3}
//               style={{ ...inputStyle, resize: "vertical", minHeight: 72 }}
//             />
//           </div>
//           <div style={{ display: "flex", gap: 10 }}>
//             <button onClick={handleSubmit} disabled={saving} style={primaryBtnStyle}>
//               {saving ? "Saving…" : editId ? "✅ Save Changes" : "✅ Create Category"}
//             </button>
//             <button onClick={() => { setShowForm(false); setEditId(null); setError(""); }} style={cancelBtnStyle}>
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Categories Grid */}
//       {loading ? (
//         <LoadingGrid />
//       ) : cats.length === 0 ? (
//         <EmptyState onAdd={() => setShowForm(true)} />
//       ) : (
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}>
//           {cats.map((c, i) => {
//             const palette = COLOR_MAP[i % 5];
//             return (
//               <div
//                 key={c.id}
//                 style={{
//                   background: "white", borderRadius: 20, padding: 22,
//                   border: `2.5px solid ${palette.color}22`,
//                   boxShadow: "0 4px 16px rgba(0,0,0,.05)",
//                   opacity: c.isActive ? 1 : 0.55, transition: "all .2s",
//                 }}
//               >
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                     <div style={{
//                       width: 44, height: 44, borderRadius: 12, background: palette.bg,
//                       display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
//                       border: `2px solid ${palette.color}33`,
//                     }}>{palette.emoji}</div>
//                     <div>
//                       <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#1A1A2E" }}>{c.name}</div>
//                       <div style={{ fontSize: 11, color: "#aaa", fontWeight: 700 }}>/{c.slug}</div>
//                     </div>
//                   </div>
//                   {/* Active toggle */}
//                   <button
//                     onClick={() => handleToggle(c.id, c.isActive)}
//                     style={{
//                       border: "none", borderRadius: 20, padding: "4px 12px", cursor: "pointer",
//                       fontWeight: 800, fontSize: 11, fontFamily: "inherit",
//                       background: c.isActive ? "#E8FFF5" : "#F5F5F5",
//                       color: c.isActive ? "#22C55E" : "#aaa",
//                     }}
//                   >
//                     {c.isActive ? "● Active" : "○ Inactive"}
//                   </button>
//                 </div>

//                 {c.description && (
//                   <p style={{ fontSize: 13, color: "#777", lineHeight: 1.6, margin: "0 0 14px" }}>{c.description}</p>
//                 )}

//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <div style={{
//                     display: "inline-flex", alignItems: "center", gap: 6,
//                     background: palette.bg, borderRadius: 8, padding: "5px 12px",
//                     fontSize: 12, fontWeight: 800, color: palette.color,
//                   }}>
//                     📝 {c._count?.portalPapers ?? 0} Papers
//                   </div>
//                   <div style={{ display: "flex", gap: 6 }}>
//                     <button onClick={() => startEdit(c)} style={iconBtnStyle("#4ECDC4")}>✏️</button>
//                     <button
//                       onClick={() => handleDelete(c.id)}
//                       disabled={deletingId === c.id}
//                       style={iconBtnStyle("#FF6B6B")}
//                     >
//                       {deletingId === c.id ? "…" : "🗑️"}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// function LoadingGrid() {
//   return (
//     <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}>
//       {[1, 2, 3].map(i => (
//         <div key={i} style={{ background: "#F5F3EE", borderRadius: 20, height: 140, animation: "pulse 1.5s ease-in-out infinite" }} />
//       ))}
//     </div>
//   );
// }

// function EmptyState({ onAdd }: { onAdd: () => void }) {
//   return (
//     <div style={{ textAlign: "center", padding: "60px 24px" }}>
//       <div style={{ fontSize: 56, marginBottom: 16 }}>🗂️</div>
//       <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", marginBottom: 8 }}>No categories yet</h3>
//       <p style={{ fontSize: 14, color: "#aaa", marginBottom: 24 }}>Create your first category to start organising exam papers.</p>
//       <button onClick={onAdd} style={primaryBtnStyle}>➕ Create First Category</button>
//     </div>
//   );
// }

// // ── Shared micro-styles ──────────────────────────────────────────────────────
// const labelStyle: React.CSSProperties = {
//   display: "block", fontSize: 12, fontWeight: 900, color: "#555",
//   letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6,
// };
// const inputStyle: React.CSSProperties = {
//   width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14,
//   border: "2px solid #EEE", outline: "none", fontFamily: "inherit",
//   transition: "border .2s", boxSizing: "border-box",
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
// const iconBtnStyle = (color: string): React.CSSProperties => ({
//   background: color + "15", border: `1.5px solid ${color}33`, borderRadius: 8,
//   width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
//   cursor: "pointer", fontSize: 14, transition: "all .2s",
// });











// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useAuth } from "@/context/AuthContext";

// interface PortalCategory {
//   id: string;
//   name: string;
//   description: string;
//   slug: string;
//   isActive: boolean;
//   _count?: { portalPapers: number };
//   createdAt: string;
// }

// const COLOR_MAP: Record<number, { color: string; bg: string; emoji: string }> = {
//   0: { color: "#FF6B6B", bg: "#FFF0F0", emoji: "🏆" },
//   1: { color: "#4ECDC4", bg: "#F0FFFE", emoji: "🎯" },
//   2: { color: "#FFB347", bg: "#FFF8EE", emoji: "📚" },
//   3: { color: "#A78BFA", bg: "#F5F0FF", emoji: "🧠" },
//   4: { color: "#F06292", bg: "#FFF0F5", emoji: "⭐" },
// };

// const blankForm = { name: "", description: "", slug: "" };

// export default function PortalCategoriesPanel() {
//   const { token } = useAuth();

//   const [cats, setCats] = useState<PortalCategory[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState(blankForm);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [saving, setSaving] = useState(false);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [error, setError] = useState("");

//   // ── Auth headers helper ───────────────────────────────────────────────────
//   const authHeaders = useCallback(
//     (extra: Record<string, string> = {}) => ({
//       Authorization: `Bearer ${token}`,
//       ...extra,
//     }),
//     [token],
//   );

//   // ── Load categories ───────────────────────────────────────────────────────
//   const load = useCallback(async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const r = await fetch("/api/admin/portal/categories", {
//         headers: authHeaders(),
//         cache: "no-store",
//       });
//       if (!r.ok) throw new Error(`${r.status}`);
//       const d = await r.json();
//       setCats(d.categories ?? []);
//     } catch {
//       setError("Failed to load categories.");
//     } finally {
//       setLoading(false);
//     }
//   }, [token, authHeaders]);

//   useEffect(() => { load(); }, [load]);

//   // ── Slug auto-generate ────────────────────────────────────────────────────
//   const handleNameChange = (name: string) => {
//     setForm(f => ({
//       ...f,
//       name,
//       slug: editId
//         ? f.slug
//         : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
//     }));
//   };

//   // ── Create / Edit submit ──────────────────────────────────────────────────
//   const handleSubmit = async () => {
//     if (!form.name.trim()) return setError("Category name is required.");
//     setSaving(true); setError("");
//     try {
//       const url    = editId ? `/api/admin/portal/categories/${editId}` : "/api/admin/portal/categories";
//       const method = editId ? "PATCH" : "POST";
//       const r = await fetch(url, {
//         method,
//         headers: authHeaders({ "Content-Type": "application/json" }),
//         body: JSON.stringify(form),
//       });
//       if (!r.ok) throw new Error((await r.json()).error ?? "Failed");
//       setShowForm(false); setEditId(null); setForm(blankForm);
//       load();
//     } catch (e: any) {
//       setError(e.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Toggle active ─────────────────────────────────────────────────────────
//   const handleToggle = async (id: string, isActive: boolean) => {
//     await fetch(`/api/admin/portal/categories/${id}`, {
//       method: "PATCH",
//       headers: authHeaders({ "Content-Type": "application/json" }),
//       body: JSON.stringify({ isActive: !isActive }),
//     });
//     load();
//   };

//   // ── Delete ────────────────────────────────────────────────────────────────
//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this category? All papers inside will also be removed.")) return;
//     setDeletingId(id);
//     await fetch(`/api/admin/portal/categories/${id}`, {
//       method: "DELETE",
//       headers: authHeaders(),
//     });
//     setDeletingId(null); load();
//   };

//   // ── Start edit ────────────────────────────────────────────────────────────
//   const startEdit = (c: PortalCategory) => {
//     setForm({ name: c.name, description: c.description, slug: c.slug });
//     setEditId(c.id); setShowForm(true); setError("");
//   };

//   return (
//     <div>
//       {/* Header row */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
//         <div>
//           <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", margin: 0 }}>
//             Exam Categories
//           </h2>
//           <p style={{ fontSize: 13, color: "#aaa", margin: "3px 0 0", fontWeight: 700 }}>
//             Organise your exam papers into categories (e.g. Olympiad, Mock Tests)
//           </p>
//         </div>
//         <button
//           onClick={() => { setShowForm(true); setEditId(null); setForm(blankForm); setError(""); }}
//           style={{
//             background: "linear-gradient(135deg,#FF6B6B,#FFB347)", color: "white",
//             border: "none", borderRadius: 12, padding: "10px 20px",
//             fontFamily: "inherit", fontWeight: 900, fontSize: 14, cursor: "pointer",
//             display: "flex", alignItems: "center", gap: 8,
//             boxShadow: "0 4px 16px rgba(255,107,107,.35)",
//           }}
//         >
//           ➕ New Category
//         </button>
//       </div>

//       {/* Inline Form */}
//       {showForm && (
//         <div style={{
//           background: "white", borderRadius: 20, padding: 28, marginBottom: 24,
//           border: "2.5px solid #FF6B6B33", boxShadow: "0 8px 32px rgba(255,107,107,.1)",
//         }}>
//           <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 17, color: "#1A1A2E", margin: "0 0 20px" }}>
//             {editId ? "✏️ Edit Category" : "🆕 New Category"}
//           </h3>
//           {error && (
//             <div style={{ background: "#FFF0F0", border: "1.5px solid #FFD6D6", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#FF6B6B", fontWeight: 700 }}>
//               ⚠️ {error}
//             </div>
//           )}
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
//             <div>
//               <label style={labelStyle}>Category Name *</label>
//               <input
//                 value={form.name}
//                 onChange={e => handleNameChange(e.target.value)}
//                 placeholder="e.g. Olympiad Exams"
//                 style={inputStyle}
//               />
//             </div>
//             <div>
//               <label style={labelStyle}>URL Slug</label>
//               <input
//                 value={form.slug}
//                 onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
//                 placeholder="olympiad-exams"
//                 style={{ ...inputStyle, background: "#F9F9F9", color: "#777" }}
//               />
//             </div>
//           </div>
//           <div style={{ marginBottom: 20 }}>
//             <label style={labelStyle}>Description</label>
//             <textarea
//               value={form.description}
//               onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
//               placeholder="Brief description of what this category contains…"
//               rows={3}
//               style={{ ...inputStyle, resize: "vertical", minHeight: 72 }}
//             />
//           </div>
//           <div style={{ display: "flex", gap: 10 }}>
//             <button onClick={handleSubmit} disabled={saving} style={primaryBtnStyle}>
//               {saving ? "Saving…" : editId ? "✅ Save Changes" : "✅ Create Category"}
//             </button>
//             <button
//               onClick={() => { setShowForm(false); setEditId(null); setError(""); }}
//               style={cancelBtnStyle}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Categories Grid */}
//       {loading ? (
//         <LoadingGrid />
//       ) : cats.length === 0 ? (
//         <EmptyState onAdd={() => setShowForm(true)} />
//       ) : (
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}>
//           {cats.map((c, i) => {
//             const palette = COLOR_MAP[i % 5];
//             return (
//               <div
//                 key={c.id}
//                 style={{
//                   background: "white", borderRadius: 20, padding: 22,
//                   border: `2.5px solid ${palette.color}22`,
//                   boxShadow: "0 4px 16px rgba(0,0,0,.05)",
//                   opacity: c.isActive ? 1 : 0.55, transition: "all .2s",
//                 }}
//               >
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                     <div style={{
//                       width: 44, height: 44, borderRadius: 12, background: palette.bg,
//                       display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
//                       border: `2px solid ${palette.color}33`,
//                     }}>{palette.emoji}</div>
//                     <div>
//                       <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#1A1A2E" }}>{c.name}</div>
//                       <div style={{ fontSize: 11, color: "#aaa", fontWeight: 700 }}>/{c.slug}</div>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => handleToggle(c.id, c.isActive)}
//                     style={{
//                       border: "none", borderRadius: 20, padding: "4px 12px", cursor: "pointer",
//                       fontWeight: 800, fontSize: 11, fontFamily: "inherit",
//                       background: c.isActive ? "#E8FFF5" : "#F5F5F5",
//                       color: c.isActive ? "#22C55E" : "#aaa",
//                     }}
//                   >
//                     {c.isActive ? "● Active" : "○ Inactive"}
//                   </button>
//                 </div>

//                 {c.description && (
//                   <p style={{ fontSize: 13, color: "#777", lineHeight: 1.6, margin: "0 0 14px" }}>{c.description}</p>
//                 )}

//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <div style={{
//                     display: "inline-flex", alignItems: "center", gap: 6,
//                     background: palette.bg, borderRadius: 8, padding: "5px 12px",
//                     fontSize: 12, fontWeight: 800, color: palette.color,
//                   }}>
//                     📝 {c._count?.portalPapers ?? 0} Papers
//                   </div>
//                   <div style={{ display: "flex", gap: 6 }}>
//                     <button onClick={() => startEdit(c)} style={iconBtnStyle("#4ECDC4")}>✏️</button>
//                     <button
//                       onClick={() => handleDelete(c.id)}
//                       disabled={deletingId === c.id}
//                       style={iconBtnStyle("#FF6B6B")}
//                     >
//                       {deletingId === c.id ? "…" : "🗑️"}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// function LoadingGrid() {
//   return (
//     <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}>
//       {[1, 2, 3].map(i => (
//         <div key={i} style={{ background: "#F5F3EE", borderRadius: 20, height: 140 }} />
//       ))}
//     </div>
//   );
// }

// function EmptyState({ onAdd }: { onAdd: () => void }) {
//   return (
//     <div style={{ textAlign: "center", padding: "60px 24px" }}>
//       <div style={{ fontSize: 56, marginBottom: 16 }}>🗂️</div>
//       <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", marginBottom: 8 }}>No categories yet</h3>
//       <p style={{ fontSize: 14, color: "#aaa", marginBottom: 24 }}>Create your first category to start organising exam papers.</p>
//       <button onClick={onAdd} style={primaryBtnStyle}>➕ Create First Category</button>
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
//   transition: "border .2s", boxSizing: "border-box",
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
// const iconBtnStyle = (color: string): React.CSSProperties => ({
//   background: color + "15", border: `1.5px solid ${color}33`, borderRadius: 8,
//   width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
//   cursor: "pointer", fontSize: 14, transition: "all .2s",
// });
















"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

interface PortalCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  isActive: boolean;
  _count?: { portalPapers: number };
  createdAt: string;
}

const COLOR_MAP: Record<number, { color: string; bg: string; emoji: string }> = {
  0: { color: "#FF6B6B", bg: "#FFF0F0", emoji: "🏆" },
  1: { color: "#4ECDC4", bg: "#F0FFFE", emoji: "🎯" },
  2: { color: "#FFB347", bg: "#FFF8EE", emoji: "📚" },
  3: { color: "#A78BFA", bg: "#F5F0FF", emoji: "🧠" },
  4: { color: "#F06292", bg: "#FFF0F5", emoji: "⭐" },
};

const blankForm = { name: "", description: "", slug: "" };

export default function PortalCategoriesPanel() {
  const { token } = useAuth();

  const [cats, setCats] = useState<PortalCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blankForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // ── Auth headers helper ───────────────────────────────────────────────────
  const authHeaders = useCallback(
    (extra: Record<string, string> = {}) => ({
      Authorization: `Bearer ${token}`,
      ...extra,
    }),
    [token],
  );

  // ── Load categories ───────────────────────────────────────────────────────
  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const r = await fetch("/api/admin/portal/categories", {
        headers: authHeaders(),
        cache: "no-store",
      });
      if (!r.ok) throw new Error(`${r.status}`);
      const d = await r.json();
      setCats(d.categories ?? []);
    } catch {
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }, [token, authHeaders]);

  useEffect(() => { load(); }, [load]);

  // ── Slug auto-generate ────────────────────────────────────────────────────
  const handleNameChange = (name: string) => {
    setForm(f => ({
      ...f,
      name,
      slug: editId
        ? f.slug
        : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
  };

  // ── Create / Edit submit ──────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.name.trim()) return setError("Category name is required.");
    setSaving(true); setError("");
    try {
      const url    = editId ? `/api/admin/portal/categories/${editId}` : "/api/admin/portal/categories";
      const method = editId ? "PATCH" : "POST";
      const r = await fetch(url, {
        method,
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error((await r.json()).error ?? "Failed");
      setShowForm(false); setEditId(null); setForm(blankForm);
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle active ─────────────────────────────────────────────────────────
  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      const r = await fetch(`/api/admin/portal/categories/${id}`, {
        method: "PATCH",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (!r.ok) throw new Error((await r.json()).error ?? "Update failed");
      load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? All papers inside will also be removed.")) return;
    setDeletingId(id);
    try {
      const r = await fetch(`/api/admin/portal/categories/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!r.ok) throw new Error((await r.json()).error ?? "Delete failed");
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ── Start edit ────────────────────────────────────────────────────────────
  const startEdit = (c: PortalCategory) => {
    setForm({ name: c.name, description: c.description, slug: c.slug });
    setEditId(c.id); setShowForm(true); setError("");
  };

  return (
    <div>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", margin: 0 }}>
            Exam Categories
          </h2>
          <p style={{ fontSize: 13, color: "#aaa", margin: "3px 0 0", fontWeight: 700 }}>
            Organise your exam papers into categories (e.g. Olympiad, Mock Tests)
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(blankForm); setError(""); }}
          style={{
            background: "linear-gradient(135deg,#FF6B6B,#FFB347)", color: "white",
            border: "none", borderRadius: 12, padding: "10px 20px",
            fontFamily: "inherit", fontWeight: 900, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 4px 16px rgba(255,107,107,.35)",
          }}
        >
          ➕ New Category
        </button>
      </div>

      {/* Standalone error (e.g. from toggle/delete) */}
      {error && !showForm && (
        <div style={{ background: "#FFF0F0", border: "1.5px solid #FFD6D6", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#FF6B6B", fontWeight: 700 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Inline Form */}
      {showForm && (
        <div style={{
          background: "white", borderRadius: 20, padding: 28, marginBottom: 24,
          border: "2.5px solid #FF6B6B33", boxShadow: "0 8px 32px rgba(255,107,107,.1)",
        }}>
          <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 17, color: "#1A1A2E", margin: "0 0 20px" }}>
            {editId ? "✏️ Edit Category" : "🆕 New Category"}
          </h3>
          {error && (
            <div style={{ background: "#FFF0F0", border: "1.5px solid #FFD6D6", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#FF6B6B", fontWeight: 700 }}>
              ⚠️ {error}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Category Name *</label>
              <input
                value={form.name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Olympiad Exams"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>URL Slug</label>
              <input
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="olympiad-exams"
                style={{ ...inputStyle, background: "#F9F9F9", color: "#777" }}
              />
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of what this category contains…"
              rows={3}
              style={{ ...inputStyle, resize: "vertical", minHeight: 72 }}
            />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleSubmit} disabled={saving} style={primaryBtnStyle}>
              {saving ? "Saving…" : editId ? "✅ Save Changes" : "✅ Create Category"}
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

      {/* Categories Grid */}
      {loading ? (
        <LoadingGrid />
      ) : cats.length === 0 ? (
        <EmptyState onAdd={() => setShowForm(true)} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}>
          {cats.map((c, i) => {
            const palette = COLOR_MAP[i % 5];
            return (
              <div
                key={c.id}
                style={{
                  background: "white", borderRadius: 20, padding: 22,
                  border: `2.5px solid ${palette.color}22`,
                  boxShadow: "0 4px 16px rgba(0,0,0,.05)",
                  opacity: c.isActive ? 1 : 0.55, transition: "all .2s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, background: palette.bg,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                      border: `2px solid ${palette.color}33`,
                    }}>{palette.emoji}</div>
                    <div>
                      <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#1A1A2E" }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: "#aaa", fontWeight: 700 }}>/{c.slug}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle(c.id, c.isActive)}
                    style={{
                      border: "none", borderRadius: 20, padding: "4px 12px", cursor: "pointer",
                      fontWeight: 800, fontSize: 11, fontFamily: "inherit",
                      background: c.isActive ? "#E8FFF5" : "#F5F5F5",
                      color: c.isActive ? "#22C55E" : "#aaa",
                    }}
                  >
                    {c.isActive ? "● Active" : "○ Inactive"}
                  </button>
                </div>

                {c.description && (
                  <p style={{ fontSize: 13, color: "#777", lineHeight: 1.6, margin: "0 0 14px" }}>{c.description}</p>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: palette.bg, borderRadius: 8, padding: "5px 12px",
                    fontSize: 12, fontWeight: 800, color: palette.color,
                  }}>
                    📝 {c._count?.portalPapers ?? 0} Papers
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => startEdit(c)} style={iconBtnStyle("#4ECDC4")}>✏️</button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      disabled={deletingId === c.id}
                      style={iconBtnStyle("#FF6B6B")}
                    >
                      {deletingId === c.id ? "…" : "🗑️"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LoadingGrid() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ background: "#F5F3EE", borderRadius: 20, height: 140 }} />
      ))}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 24px" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🗂️</div>
      <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", marginBottom: 8 }}>No categories yet</h3>
      <p style={{ fontSize: 14, color: "#aaa", marginBottom: 24 }}>Create your first category to start organising exam papers.</p>
      <button onClick={onAdd} style={primaryBtnStyle}>➕ Create First Category</button>
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
  transition: "border .2s", boxSizing: "border-box",
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
const iconBtnStyle = (color: string): React.CSSProperties => ({
  background: color + "15", border: `1.5px solid ${color}33`, borderRadius: 8,
  width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", fontSize: 14, transition: "all .2s",
});