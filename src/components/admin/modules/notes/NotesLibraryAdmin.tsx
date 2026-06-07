






// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import { supabase } from "@/lib/helpers/supabaseClient";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type NoteType = "DEMO" | "REAL";

// interface Category {
//   id: string;
//   name: string;
//   description: string;
//   createdAt: string;
//   updatedAt: string;
//   _count?: { notes: number };
// }

// interface Note {
//   id: string;
//   serialId: number;
//   title: string;
//   label: string;
//   type: NoteType;
//   pdfUrl: string;
//   storagePath: string;
//   categoryId: string | null;
//   category?: { id: string; name: string } | null;
//   createdAt: string;
//   updatedAt: string;
// }

// // ─── Supabase Storage config ──────────────────────────────────────────────────
// const BUCKET = "notes-pdfs";

// async function uploadPdfToSupabase(
//   file: File,
//   onProgress?: (pct: number) => void
// ): Promise<{ pdfUrl: string; storagePath: string }> {
//   const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
//   const storagePath = `notes/${Date.now()}-${safeName}`;
//   onProgress?.(10);

//   const { error } = await supabase.storage
//     .from(BUCKET)
//     .upload(storagePath, file, { contentType: "application/pdf", upsert: false });

//   if (error) throw new Error(`Upload failed: ${error.message}`);
//   onProgress?.(90);

//   const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
//   onProgress?.(100);
//   return { pdfUrl: data.publicUrl, storagePath };
// }

// // ─── Auth helper ──────────────────────────────────────────────────────────────
// async function getAuthHeaders(): Promise<Record<string, string>> {
//   const { data: { session } } = await supabase.auth.getSession();
//   return {
//     Authorization: `Bearer ${session?.access_token ?? ""}`,
//     "Content-Type": "application/json",
//   };
// }

// // ─── API helpers ──────────────────────────────────────────────────────────────
// const API = {
//   // Notes
//   listNotes: async (params?: { categoryId?: string; type?: NoteType | "all"; search?: string }): Promise<Note[]> => {
//     const headers = await getAuthHeaders();
//     const qs = new URLSearchParams();
//     if (params?.categoryId) qs.set("categoryId", params.categoryId);
//     if (params?.type && params.type !== "all") qs.set("type", params.type);
//     if (params?.search) qs.set("search", params.search);
//     const res = await fetch(`/api/admin/notes?${qs}`, { headers });
//     const text = await res.text();
//     let json: { notes?: Note[]; error?: string } = {};
//     try { json = JSON.parse(text); } catch { throw new Error("Invalid server response"); }
//     if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
//     return json.notes ?? [];
//   },

//   createNote: async (fields: {
//     title: string; label: string; type: NoteType;
//     serialId: number; pdfUrl: string; storagePath: string; categoryId?: string | null;
//   }): Promise<Note> => {
//     const headers = await getAuthHeaders();
//     const res = await fetch("/api/admin/notes", { method: "POST", headers, body: JSON.stringify(fields) });
//     const text = await res.text();
//     let json: { note?: Note; error?: string } = {};
//     try { json = JSON.parse(text); } catch { throw new Error(`Server error ${res.status}`); }
//     if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
//     return json.note as Note;
//   },

//   updateNote: async (id: string, fields: Partial<{
//     title: string; label: string; type: NoteType;
//     serialId: number; pdfUrl: string; storagePath: string; categoryId: string | null;
//   }>): Promise<Note> => {
//     const headers = await getAuthHeaders();
//     const res = await fetch(`/api/admin/notes/${id}`, { method: "PATCH", headers, body: JSON.stringify(fields) });
//     const text = await res.text();
//     let json: { note?: Note; error?: string } = {};
//     try { json = JSON.parse(text); } catch { throw new Error(`Server error ${res.status}`); }
//     if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
//     return json.note as Note;
//   },

//   deleteNote: async (id: string): Promise<void> => {
//     const headers = await getAuthHeaders();
//     const res = await fetch(`/api/admin/notes/${id}`, { method: "DELETE", headers });
//     if (!res.ok) {
//       const text = await res.text();
//       let json: { error?: string } = {};
//       try { json = JSON.parse(text); } catch { /* ignore */ }
//       throw new Error(json.error ?? `Server error ${res.status}`);
//     }
//   },

//   // Categories
//   listCategories: async (): Promise<Category[]> => {
//     const headers = await getAuthHeaders();
//     const res = await fetch("/api/admin/categories", { headers });
//     const text = await res.text();
//     let json: { categories?: Category[]; error?: string } = {};
//     try { json = JSON.parse(text); } catch { throw new Error("Invalid server response"); }
//     if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
//     return json.categories ?? [];
//   },

//   createCategory: async (fields: { name: string; description?: string }): Promise<Category> => {
//     const headers = await getAuthHeaders();
//     const res = await fetch("/api/admin/categories", { method: "POST", headers, body: JSON.stringify(fields) });
//     const text = await res.text();
//     let json: { category?: Category; error?: string } = {};
//     try { json = JSON.parse(text); } catch { throw new Error(`Server error ${res.status}`); }
//     if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
//     return json.category as Category;
//   },

//   updateCategory: async (id: string, fields: { name?: string; description?: string }): Promise<Category> => {
//     const headers = await getAuthHeaders();
//     const res = await fetch(`/api/admin/categories/${id}`, { method: "PATCH", headers, body: JSON.stringify(fields) });
//     const text = await res.text();
//     let json: { category?: Category; error?: string } = {};
//     try { json = JSON.parse(text); } catch { throw new Error(`Server error ${res.status}`); }
//     if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
//     return json.category as Category;
//   },

//   deleteCategory: async (id: string): Promise<void> => {
//     const headers = await getAuthHeaders();
//     const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE", headers });
//     if (!res.ok) {
//       const text = await res.text();
//       let json: { error?: string } = {};
//       try { json = JSON.parse(text); } catch { /* ignore */ }
//       throw new Error(json.error ?? `Server error ${res.status}`);
//     }
//   },
// };

// // ─── Small helpers ────────────────────────────────────────────────────────────
// function storagePathToName(storagePath: string): string {
//   const filename = storagePath.split("/").pop() ?? storagePath;
//   return filename.replace(/^\d+-/, "").replace(/_/g, " ");
// }

// function Badge({ text }: { text: string }) {
//   if (!text) return null;
//   return (
//     <span style={{
//       display: "inline-block", padding: "2px 10px", borderRadius: 20,
//       background: "#FFF3CD", color: "#92660A", fontSize: 11, fontWeight: 600,
//       letterSpacing: 0.4, border: "1px solid #F0D080",
//     }}>{text}</span>
//   );
// }

// function CategoryBadge({ name }: { name: string }) {
//   return (
//     <span style={{
//       display: "inline-flex", alignItems: "center", gap: 4,
//       padding: "2px 10px", borderRadius: 20,
//       background: "#F3EEFF", color: "#6B35C8", fontSize: 11, fontWeight: 600,
//       letterSpacing: 0.4, border: "1px solid #C8A8F0",
//     }}>
//       📁 {name}
//     </span>
//   );
// }

// function TypePill({ type }: { type: NoteType }) {
//   const isDemo = type === "DEMO";
//   return (
//     <span style={{
//       display: "inline-block", padding: "2px 10px", borderRadius: 20,
//       background: isDemo ? "#EAF4FF" : "#EDFBF0",
//       color: isDemo ? "#1A6FB5" : "#1A7A3A", fontSize: 11, fontWeight: 700,
//       border: `1px solid ${isDemo ? "#A8CCEE" : "#8ED4A8"}`,
//       letterSpacing: 0.5, textTransform: "uppercase" as const,
//     }}>
//       {isDemo ? "Demo" : "Real"}
//     </span>
//   );
// }

// function ActionBtn({ label, emoji, color, bg, onClick }: {
//   label: string; emoji: string; color: string; bg: string; onClick: () => void;
// }) {
//   const [hovered, setHovered] = useState(false);
//   return (
//     <button title={label} onClick={onClick}
//       onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
//       style={{
//         display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8,
//         background: hovered ? color : bg, color: hovered ? "#fff" : color,
//         border: `1.5px solid ${color}22`, cursor: "pointer", fontWeight: 700, fontSize: 12,
//         transition: "all .15s", whiteSpace: "nowrap" as const,
//       }}
//     >
//       {emoji} {label}
//     </button>
//   );
// }

// // ─── PDF Viewer Modal ─────────────────────────────────────────────────────────
// function PdfModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
//   const [loadError, setLoadError] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
//     document.addEventListener("keydown", handler);
//     document.body.style.overflow = "hidden";
//     return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
//   }, [onClose]);

//   return (
//     <div onClick={onClose} style={{
//       position: "fixed", inset: 0, zIndex: 1000, background: "rgba(20,18,14,0.82)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       backdropFilter: "blur(6px)", padding: 20, boxSizing: "border-box",
//     }}>
//       <div onClick={(e) => e.stopPropagation()} style={{
//         background: "#FFFDF7", borderRadius: 16, width: "100%", maxWidth: 960,
//         height: "calc(100vh - 40px)", maxHeight: 860,
//         display: "flex", flexDirection: "column",
//         overflow: "hidden", boxShadow: "0 32px 100px rgba(0,0,0,0.45)",
//       }}>
//         <div style={{
//           display: "flex", alignItems: "center", justifyContent: "space-between",
//           padding: "14px 20px", borderBottom: "1px solid #EEE9DC",
//           background: "#FAF7EE", flexShrink: 0, gap: 12,
//         }}>
//           <span style={{
//             fontWeight: 700, fontSize: 15, color: "#2C2A22", fontFamily: "'Georgia', serif",
//             overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
//           }}>📄 {title}</span>
//           <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
//             <a href={url} target="_blank" rel="noopener noreferrer" style={{
//               padding: "7px 16px", borderRadius: 8, background: "#2C2A22", color: "#FFFDF7",
//               fontSize: 12, fontWeight: 600, textDecoration: "none",
//             }}>Open in Tab ↗</a>
//             <button onClick={onClose} style={{
//               padding: "7px 16px", borderRadius: 8, background: "#F0EBE0", color: "#555",
//               border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
//             }}>✕ Close</button>
//           </div>
//         </div>
//         <div style={{ flex: 1, position: "relative", background: "#525659", overflow: "hidden" }}>
//           {loading && !loadError && (
//             <div style={{
//               position: "absolute", inset: 0, display: "flex", flexDirection: "column",
//               alignItems: "center", justifyContent: "center", color: "#CCC", fontSize: 14, gap: 12, zIndex: 1,
//             }}>
//               <div style={{ width: 36, height: 36, border: "3px solid #666", borderTopColor: "#FFF", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
//               Loading PDF…
//             </div>
//           )}
//           {loadError ? (
//             <div style={{
//               position: "absolute", inset: 0, display: "flex", flexDirection: "column",
//               alignItems: "center", justifyContent: "center", color: "#EEE", gap: 16, padding: 32, textAlign: "center",
//             }}>
//               <div style={{ fontSize: 48 }}>⚠️</div>
//               <div style={{ fontSize: 16, fontWeight: 700 }}>PDF could not be loaded</div>
//               <a href={url} target="_blank" rel="noopener noreferrer" style={{
//                 padding: "10px 24px", borderRadius: 8, background: "#2C2A22", color: "#FFFDF7",
//                 fontSize: 13, fontWeight: 600, textDecoration: "none",
//               }}>Open in Tab ↗</a>
//             </div>
//           ) : (
//             <iframe key={url} src={url}
//               style={{ width: "100%", height: "100%", border: "none", display: "block" }}
//               title={title}
//               onLoad={() => setLoading(false)}
//               onError={() => { setLoading(false); setLoadError(true); }}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Upload Progress Bar ──────────────────────────────────────────────────────
// function UploadProgress({ pct, filename }: { pct: number; filename: string }) {
//   return (
//     <div style={{ padding: "12px 14px", borderRadius: 10, background: "#EAF4FF", border: "1.5px solid #A8CCEE", marginBottom: 8 }}>
//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
//         <span style={{ fontSize: 12, fontWeight: 700, color: "#1A6FB5" }}>⬆️ Uploading {filename}…</span>
//         <span style={{ fontSize: 12, fontWeight: 700, color: "#1A6FB5" }}>{pct}%</span>
//       </div>
//       <div style={{ height: 6, background: "#C8E0F8", borderRadius: 3, overflow: "hidden" }}>
//         <div style={{ height: "100%", borderRadius: 3, background: "#1A6FB5", width: `${pct}%`, transition: "width 0.3s ease" }} />
//       </div>
//     </div>
//   );
// }

// // ─── Category Form Modal ──────────────────────────────────────────────────────
// function CategoryFormModal({
//   editCategory, onClose, onSaved,
// }: {
//   editCategory?: Category | null; onClose: () => void; onSaved: () => void;
// }) {
//   const isEdit = !!editCategory;
//   const [name, setName] = useState(editCategory?.name ?? "");
//   const [description, setDescription] = useState(editCategory?.description ?? "");
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => { document.body.style.overflow = ""; };
//   }, []);

//   const handleSubmit = async () => {
//     if (!name.trim()) return setError("Category name is required.");
//     setError("");
//     setSaving(true);
//     try {
//       if (isEdit) {
//         await API.updateCategory(editCategory!.id, { name, description });
//       } else {
//         await API.createCategory({ name, description });
//       }
//       onSaved();
//       onClose();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Something went wrong.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const input: React.CSSProperties = {
//     width: "100%", padding: "10px 14px", borderRadius: 8,
//     border: "1.5px solid #DDD8CC", background: "#FFFDF7", color: "#2C2A22",
//     fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
//   };
//   const lbl: React.CSSProperties = {
//     fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: 0.6,
//     textTransform: "uppercase" as const, marginBottom: 6, display: "block",
//   };

//   return (
//     <div onClick={saving ? undefined : onClose} style={{
//       position: "fixed", inset: 0, zIndex: 999, background: "rgba(20,18,14,0.6)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       backdropFilter: "blur(3px)", padding: 20, boxSizing: "border-box",
//     }}>
//       <div onClick={(e) => e.stopPropagation()} style={{
//         background: "#FFFDF7", borderRadius: 18, width: "100%", maxWidth: 460, padding: 32,
//         boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
//       }}>
//         <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 800, color: "#2C2A22", fontFamily: "'Georgia', serif" }}>
//           {isEdit ? "✏️ Edit Category" : "📁 New Category"}
//         </h2>
//         <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//           <div>
//             <label style={lbl}>Category Name</label>
//             <input value={name} onChange={(e) => setName(e.target.value)}
//               placeholder="e.g. Vedic Maths, Physics, Biology…"
//               style={input} disabled={saving}
//             />
//           </div>
//           <div>
//             <label style={lbl}>Description (optional)</label>
//             <textarea value={description} onChange={(e) => setDescription(e.target.value)}
//               placeholder="Brief description of this category…"
//               rows={3}
//               style={{ ...input, resize: "vertical", lineHeight: 1.5 }}
//               disabled={saving}
//             />
//           </div>
//         </div>

//         {error && <p style={{ color: "#C0392B", fontSize: 13, marginTop: 12, marginBottom: 0 }}>⚠️ {error}</p>}

//         <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
//           <button onClick={handleSubmit} disabled={saving} style={{
//             flex: 1, padding: "12px 0", borderRadius: 10,
//             background: saving ? "#AAA" : "#2C2A22",
//             color: "#FFFDF7", border: "none", fontWeight: 800, fontSize: 15,
//             cursor: saving ? "not-allowed" : "pointer",
//           }}>
//             {saving ? (
//               <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
//                 <span style={{ width: 14, height: 14, border: "2px solid #fff6", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
//                 Saving…
//               </span>
//             ) : (isEdit ? "Save Changes" : "Create Category")}
//           </button>
//           <button onClick={saving ? undefined : onClose} style={{
//             padding: "12px 20px", borderRadius: 10, background: "#F0EBE0", color: "#555",
//             border: "none", fontWeight: 700, fontSize: 15, cursor: saving ? "not-allowed" : "pointer",
//             opacity: saving ? 0.5 : 1,
//           }}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Add / Edit Note Modal ────────────────────────────────────────────────────
// function NoteFormModal({
//   editNote, categories, onClose, onSaved,
// }: {
//   editNote?: Note | null; categories: Category[]; onClose: () => void; onSaved: () => void;
// }) {
//   const isEdit = !!editNote;
//   const [title, setTitle] = useState(editNote?.title ?? "");
//   const [label, setLabel] = useState(editNote?.label ?? "");
//   const [type, setType] = useState<NoteType>(editNote?.type ?? "REAL");
//   const [serialId, setSerialId] = useState<number>(editNote?.serialId ?? 1);
//   const [categoryId, setCategoryId] = useState<string>(editNote?.categoryId ?? "");
//   const [newFile, setNewFile] = useState<File | null>(null);
//   const [uploadPct, setUploadPct] = useState(0);
//   const [uploading, setUploading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const fileRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => { document.body.style.overflow = ""; };
//   }, []);

//   const currentPdfName = editNote?.storagePath ? storagePathToName(editNote.storagePath) : null;

//   const handleSubmit = async () => {
//     if (!title.trim()) return setError("Title is required.");
//     if (!isEdit && !newFile) return setError("Please select a PDF file.");
//     setError("");

//     let pdfUrl = editNote?.pdfUrl;
//     let storagePath = editNote?.storagePath;

//     if (newFile) {
//       setUploading(true);
//       setUploadPct(0);
//       try {
//         const result = await uploadPdfToSupabase(newFile, setUploadPct);
//         pdfUrl = result.pdfUrl;
//         storagePath = result.storagePath;
//       } catch (err) {
//         setUploading(false);
//         setError(err instanceof Error ? err.message : "Upload failed");
//         return;
//       }
//       setUploading(false);
//     }

//     setSaving(true);
//     try {
//       const catId = categoryId || null;
//       if (isEdit) {
//         await API.updateNote(editNote!.id, { title, label, type, serialId, pdfUrl, storagePath, categoryId: catId });
//       } else {
//         await API.createNote({ title, label, type, serialId, pdfUrl: pdfUrl!, storagePath: storagePath!, categoryId: catId });
//       }
//       onSaved();
//       onClose();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Something went wrong.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const isBusy = uploading || saving;

//   const input: React.CSSProperties = {
//     width: "100%", padding: "10px 14px", borderRadius: 8,
//     border: "1.5px solid #DDD8CC", background: "#FFFDF7", color: "#2C2A22",
//     fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
//   };
//   const lbl: React.CSSProperties = {
//     fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: 0.6,
//     textTransform: "uppercase" as const, marginBottom: 6, display: "block",
//   };

//   return (
//     <div onClick={isBusy ? undefined : onClose} style={{
//       position: "fixed", inset: 0, zIndex: 999, background: "rgba(20,18,14,0.6)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       backdropFilter: "blur(3px)", padding: 20, boxSizing: "border-box",
//     }}>
//       <div onClick={(e) => e.stopPropagation()} style={{
//         background: "#FFFDF7", borderRadius: 18, width: "100%", maxWidth: 520, padding: 32,
//         boxShadow: "0 20px 60px rgba(0,0,0,0.25)", maxHeight: "90vh", overflowY: "auto",
//       }}>
//         <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 800, color: "#2C2A22", fontFamily: "'Georgia', serif" }}>
//           {isEdit ? "✏️ Edit Note" : "➕ Add New Note"}
//         </h2>

//         <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//           <div>
//             <label style={lbl}>Serial ID (sort order)</label>
//             <input type="number" min={1} value={serialId}
//               onChange={(e) => setSerialId(Number(e.target.value))}
//               style={{ ...input, width: 100 }} disabled={isBusy}
//             />
//           </div>

//           <div>
//             <label style={lbl}>Title</label>
//             <input value={title} onChange={(e) => setTitle(e.target.value)}
//               placeholder="e.g. Chapter 1 – Introduction"
//               style={input} disabled={isBusy}
//             />
//           </div>

//           <div>
//             <label style={lbl}>Label (optional tag)</label>
//             <input value={label} onChange={(e) => setLabel(e.target.value)}
//               placeholder="e.g. Physics, Maths, Week 1…"
//               style={input} disabled={isBusy}
//             />
//           </div>

//           {/* Category selector */}
//           <div>
//             <label style={lbl}>Category</label>
//             <select
//               value={categoryId}
//               onChange={(e) => setCategoryId(e.target.value)}
//               disabled={isBusy}
//               style={{ ...input, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 36, cursor: "pointer" }}
//             >
//               <option value="">— No category —</option>
//               {categories.map((cat) => (
//                 <option key={cat.id} value={cat.id}>{cat.name}</option>
//               ))}
//             </select>
//             {categories.length === 0 && (
//               <p style={{ fontSize: 11, color: "#AAA", marginTop: 4 }}>
//                 No categories yet. Create one in Manage Categories.
//               </p>
//             )}
//           </div>

//           <div>
//             <label style={lbl}>Section</label>
//             <div style={{ display: "flex", gap: 10 }}>
//               {(["DEMO", "REAL"] as NoteType[]).map((t) => (
//                 <button key={t} onClick={() => !isBusy && setType(t)} style={{
//                   flex: 1, padding: "10px 0", borderRadius: 8,
//                   border: type === t ? "2px solid #2C2A22" : "2px solid #DDD8CC",
//                   background: type === t ? "#2C2A22" : "#FAF7EE",
//                   color: type === t ? "#FFFDF7" : "#555",
//                   fontWeight: 700, fontSize: 14,
//                   cursor: isBusy ? "not-allowed" : "pointer",
//                   opacity: isBusy ? 0.6 : 1,
//                 }}>
//                   {t === "DEMO" ? "🎓 Demo" : "📚 Real"}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* PDF section */}
//           <div>
//             <label style={lbl}>PDF File</label>

//             {uploading && newFile && <UploadProgress pct={uploadPct} filename={newFile.name} />}

//             {isEdit && !newFile && !uploading && currentPdfName && (
//               <div style={{
//                 display: "flex", alignItems: "center", gap: 10,
//                 padding: "10px 14px", borderRadius: 8,
//                 background: "#F0FBF3", border: "1.5px solid #8ED4A8", marginBottom: 8,
//               }}>
//                 <span style={{ fontSize: 18 }}>📄</span>
//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <div style={{ fontSize: 12, fontWeight: 700, color: "#1A7A3A" }}>Current PDF</div>
//                   <div style={{ fontSize: 13, color: "#2C2A22", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentPdfName}</div>
//                 </div>
//                 <button onClick={() => fileRef.current?.click()} disabled={isBusy} style={{
//                   padding: "5px 12px", borderRadius: 6, background: "#2C2A22", color: "#FFFDF7",
//                   border: "none", fontSize: 11, fontWeight: 700, cursor: isBusy ? "not-allowed" : "pointer", flexShrink: 0,
//                 }}>Replace</button>
//               </div>
//             )}

//             {newFile && !uploading && (
//               <div style={{
//                 display: "flex", alignItems: "center", gap: 10,
//                 padding: "10px 14px", borderRadius: 8,
//                 background: "#EAF4FF", border: "1.5px solid #A8CCEE", marginBottom: 8,
//               }}>
//                 <span style={{ fontSize: 18 }}>📋</span>
//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <div style={{ fontSize: 12, fontWeight: 700, color: "#1A6FB5" }}>
//                     {isEdit ? "New PDF (will replace current)" : "PDF selected"}
//                   </div>
//                   <div style={{ fontSize: 13, color: "#2C2A22", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{newFile.name}</div>
//                   <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{(newFile.size / 1024 / 1024).toFixed(2)} MB</div>
//                 </div>
//                 <button onClick={() => setNewFile(null)} style={{
//                   padding: "5px 10px", borderRadius: 6, background: "#FDECEC", color: "#C0392B",
//                   border: "1px solid #FFAAAA", fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0,
//                 }}>✕</button>
//               </div>
//             )}

//             {!uploading && !(isEdit && !newFile && currentPdfName) && (
//               <div onClick={() => !isBusy && fileRef.current?.click()} style={{
//                 border: "2px dashed #CCC8BE", borderRadius: 10, padding: "18px",
//                 cursor: isBusy ? "not-allowed" : "pointer",
//                 background: "#FAF7EE", color: "#888", fontSize: 13, fontWeight: 600, textAlign: "center",
//                 opacity: isBusy ? 0.5 : 1,
//               }}>
//                 📂 Click to {isEdit ? "replace" : "select"} PDF
//                 <div style={{ fontSize: 11, marginTop: 4, color: "#BBB" }}>PDF only · No size limit</div>
//               </div>
//             )}

//             <input ref={fileRef} type="file" accept="application/pdf" style={{ display: "none" }}
//               onChange={(e) => { setNewFile(e.target.files?.[0] ?? null); e.target.value = ""; }}
//             />
//           </div>
//         </div>

//         {error && <p style={{ color: "#C0392B", fontSize: 13, marginTop: 12, marginBottom: 0 }}>⚠️ {error}</p>}

//         {(uploading || saving) && (
//           <p style={{ color: "#1A6FB5", fontSize: 13, marginTop: 10, marginBottom: 0, fontWeight: 600 }}>
//             {uploading ? `⬆️ Uploading PDF… ${uploadPct}%` : "💾 Saving note…"}
//           </p>
//         )}

//         <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
//           <button onClick={handleSubmit} disabled={isBusy} style={{
//             flex: 1, padding: "12px 0", borderRadius: 10,
//             background: isBusy ? "#AAA" : "#2C2A22",
//             color: "#FFFDF7", border: "none", fontWeight: 800, fontSize: 15,
//             cursor: isBusy ? "not-allowed" : "pointer",
//           }}>
//             {uploading ? (
//               <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
//                 <span style={{ width: 14, height: 14, border: "2px solid #fff6", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
//                 Uploading… {uploadPct}%
//               </span>
//             ) : saving ? (
//               <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
//                 <span style={{ width: 14, height: 14, border: "2px solid #fff6", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
//                 Saving…
//               </span>
//             ) : (isEdit ? "Save Changes" : "Upload Note")}
//           </button>
//           <button onClick={isBusy ? undefined : onClose} style={{
//             padding: "12px 20px", borderRadius: 10, background: "#F0EBE0", color: "#555",
//             border: "none", fontWeight: 700, fontSize: 15,
//             cursor: isBusy ? "not-allowed" : "pointer", opacity: isBusy ? 0.5 : 1,
//           }}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Note Card ────────────────────────────────────────────────────────────────
// function NoteCard({ note, onView, onEdit, onDelete }: {
//   note: Note; onView: (n: Note) => void; onEdit: (n: Note) => void; onDelete: (n: Note) => void;
// }) {
//   const [hovered, setHovered] = useState(false);
//   return (
//     <div
//       onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
//       style={{
//         background: hovered ? "#FFF9EE" : "#FFFDF7", border: "1.5px solid #EEE9DC",
//         borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center",
//         gap: 14, transition: "all .15s ease", flexWrap: "wrap",
//         boxShadow: hovered ? "0 4px 18px rgba(0,0,0,0.07)" : "0 1px 4px rgba(0,0,0,0.04)",
//       }}
//     >
//       <div style={{
//         width: 38, height: 38, borderRadius: 10, background: "#F5F0E4",
//         display: "flex", alignItems: "center", justifyContent: "center",
//         fontWeight: 800, fontSize: 13, color: "#8B7D5A", flexShrink: 0, border: "1.5px solid #E8E1CF",
//       }}>
//         #{note.serialId}
//       </div>
//       <div style={{
//         width: 40, height: 40, borderRadius: 10, background: "#FFE8E8",
//         display: "flex", alignItems: "center", justifyContent: "center",
//         fontSize: 20, flexShrink: 0, border: "1.5px solid #FFCCCC",
//       }}>📄</div>
//       <div style={{ flex: 1, minWidth: 140 }}>
//         <div style={{ fontWeight: 700, fontSize: 15, color: "#2C2A22", marginBottom: 5 }}>{note.title}</div>
//         <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//           <TypePill type={note.type} />
//           {note.category && <CategoryBadge name={note.category.name} />}
//           <Badge text={note.label} />
//         </div>
//       </div>
//       <div style={{ fontSize: 11, color: "#AAA", flexShrink: 0, textAlign: "right", minWidth: 80 }}>
//         {new Date(note.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
//       </div>
//       <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
//         <ActionBtn label="View"   emoji="👁"  color="#1A6FB5" bg="#EAF4FF" onClick={() => onView(note)} />
//         <ActionBtn label="Edit"   emoji="✏️"  color="#7A5C1A" bg="#FFF3CD" onClick={() => onEdit(note)} />
//         <ActionBtn label="Delete" emoji="🗑"  color="#C0392B" bg="#FDECEC" onClick={() => onDelete(note)} />
//       </div>
//     </div>
//   );
// }

// // ─── Delete Confirm ───────────────────────────────────────────────────────────
// function DeleteConfirmModal({ title, message, onClose, onConfirm, deleting }: {
//   title: string; message: React.ReactNode;
//   onClose: () => void; onConfirm: () => void; deleting: boolean;
// }) {
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => { document.body.style.overflow = ""; };
//   }, []);
//   return (
//     <div onClick={onClose} style={{
//       position: "fixed", inset: 0, zIndex: 1001, background: "rgba(20,18,14,0.6)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       backdropFilter: "blur(3px)", padding: 20, boxSizing: "border-box",
//     }}>
//       <div onClick={(e) => e.stopPropagation()} style={{
//         background: "#FFFDF7", borderRadius: 16, padding: 32, width: "100%", maxWidth: 420,
//         boxShadow: "0 20px 60px rgba(0,0,0,0.25)", textAlign: "center",
//       }}>
//         <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
//         <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: "#2C2A22" }}>{title}</h3>
//         <p style={{ color: "#666", fontSize: 14, margin: "0 0 24px" }}>{message}</p>
//         <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
//           <button onClick={onConfirm} disabled={deleting} style={{
//             padding: "10px 24px", borderRadius: 10, background: deleting ? "#AAA" : "#C0392B",
//             color: "#fff", border: "none", fontWeight: 800, fontSize: 14,
//             cursor: deleting ? "not-allowed" : "pointer",
//           }}>
//             {deleting ? "Deleting…" : "Yes, Delete"}
//           </button>
//           <button onClick={onClose} style={{
//             padding: "10px 24px", borderRadius: 10, background: "#F0EBE0", color: "#555",
//             border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
//           }}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Category Management Panel ────────────────────────────────────────────────
// function CategoryPanel({
//   categories, onAdd, onEdit, onDelete,
// }: {
//   categories: Category[];
//   onAdd: () => void;
//   onEdit: (c: Category) => void;
//   onDelete: (c: Category) => void;
// }) {
//   return (
//     <div style={{
//       background: "#FAF7EE", border: "1.5px solid #EEE9DC", borderRadius: 14,
//       padding: "20px 24px", marginBottom: 24,
//     }}>
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
//         <div>
//           <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#2C2A22", fontFamily: "'Georgia', serif" }}>
//             📁 Manage Categories
//           </h2>
//           <p style={{ margin: "2px 0 0", color: "#999", fontSize: 12 }}>
//             Organise your notes into folders
//           </p>
//         </div>
//         <button onClick={onAdd} style={{
//           display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
//           background: "#6B35C8", color: "#fff", border: "none", fontWeight: 700, fontSize: 13,
//           cursor: "pointer",
//         }}>
//           ＋ New Category
//         </button>
//       </div>

//       {categories.length === 0 ? (
//         <div style={{
//           textAlign: "center", padding: "24px 0", color: "#CCC", fontSize: 13,
//           border: "2px dashed #EEE9DC", borderRadius: 10,
//         }}>
//           No categories yet. Click ＋ New Category to create one.
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
//           {categories.map((cat) => (
//             <div key={cat.id} style={{
//               display: "flex", alignItems: "center", gap: 8,
//               padding: "8px 14px", borderRadius: 10,
//               background: "#F3EEFF", border: "1.5px solid #C8A8F0",
//             }}>
//               <span style={{ fontSize: 16 }}>📁</span>
//               <div>
//                 <div style={{ fontSize: 13, fontWeight: 700, color: "#2C2A22" }}>{cat.name}</div>
//                 <div style={{ fontSize: 11, color: "#888" }}>
//                   {cat._count?.notes ?? 0} note{(cat._count?.notes ?? 0) !== 1 ? "s" : ""}
//                   {cat.description ? ` · ${cat.description}` : ""}
//                 </div>
//               </div>
//               <div style={{ display: "flex", gap: 4, marginLeft: 4 }}>
//                 <button title="Edit" onClick={() => onEdit(cat)} style={{
//                   padding: "4px 8px", borderRadius: 6, background: "#FFF3CD", color: "#7A5C1A",
//                   border: "1px solid #F0D080", cursor: "pointer", fontSize: 12, fontWeight: 700,
//                 }}>✏️</button>
//                 <button title="Delete" onClick={() => onDelete(cat)} style={{
//                   padding: "4px 8px", borderRadius: 6, background: "#FDECEC", color: "#C0392B",
//                   border: "1px solid #FFAAAA", cursor: "pointer", fontSize: 12, fontWeight: 700,
//                 }}>🗑</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Main View ────────────────────────────────────────────────────────────────
// export default function NotesView() {
//   const [allNotes, setAllNotes] = useState<Note[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [activeTab, setActiveTab] = useState<NoteType | "all">("all");
//   const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
//   const [showCategoryPanel, setShowCategoryPanel] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [loadError, setLoadError] = useState("");
//   const [search, setSearch] = useState("");

//   // Modal states
//   const [viewingNote, setViewingNote] = useState<Note | null>(null);
//   const [editingNote, setEditingNote] = useState<Note | null | undefined>(undefined);
//   const [deletingNote, setDeletingNote] = useState<Note | null>(null);
//   const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
//   const [editingCategory, setEditingCategory] = useState<Category | null | undefined>(undefined);
//   const [deleting, setDeleting] = useState(false);

//   const loadAll = useCallback(async (isRefresh = false) => {
//     if (isRefresh) setRefreshing(true);
//     else setLoading(true);
//     setLoadError("");
//     try {
//       const [notesData, catsData] = await Promise.all([
//         API.listNotes(),
//         API.listCategories(),
//       ]);
//       setAllNotes(notesData);
//       setCategories(catsData);
//     } catch (e) {
//       setLoadError(e instanceof Error ? e.message : "Failed to load");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => { loadAll(); }, [loadAll]);

//   const handleDeleteNote = async () => {
//     if (!deletingNote) return;
//     setDeleting(true);
//     try {
//       await API.deleteNote(deletingNote.id);
//       setDeletingNote(null);
//       loadAll(true);
//     } catch { /* ignore */ }
//     finally { setDeleting(false); }
//   };

//   const handleDeleteCategory = async () => {
//     if (!deletingCategory) return;
//     setDeleting(true);
//     try {
//       await API.deleteCategory(deletingCategory.id);
//       if (activeCategoryId === deletingCategory.id) setActiveCategoryId("all");
//       setDeletingCategory(null);
//       loadAll(true);
//     } catch { /* ignore */ }
//     finally { setDeleting(false); }
//   };

//   // Filtering
//   const filtered = allNotes
//     .filter((n) => activeTab === "all" || n.type === activeTab)
//     .filter((n) => {
//       if (activeCategoryId === "all") return true;
//       if (activeCategoryId === "uncategorized") return !n.categoryId;
//       return n.categoryId === activeCategoryId;
//     })
//     .filter((n) => {
//       const q = search.trim().toLowerCase();
//       if (!q) return true;
//       return n.title.toLowerCase().includes(q) || n.label.toLowerCase().includes(q);
//     });

//   const typeCounts = {
//     all: allNotes.length,
//     DEMO: allNotes.filter((n) => n.type === "DEMO").length,
//     REAL: allNotes.filter((n) => n.type === "REAL").length,
//   };

//   const uncategorizedCount = allNotes.filter((n) => !n.categoryId).length;

//   return (
//     <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: 900, margin: "0 auto" }}>
//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

//       {/* Header */}
//       <div style={{
//         display: "flex", justifyContent: "space-between", alignItems: "flex-start",
//         marginBottom: 24, flexWrap: "wrap", gap: 12,
//       }}>
//         <div>
//           <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#2C2A22", fontFamily: "'Georgia', serif" }}>
//             📚 Notes Library
//           </h1>
//           <p style={{ margin: "4px 0 0", color: "#999", fontSize: 13 }}>
//             Upload and manage PDF notes for students
//           </p>
//         </div>
//         <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//           <button onClick={() => setShowCategoryPanel((v) => !v)} style={{
//             display: "flex", alignItems: "center", gap: 6, padding: "11px 16px", borderRadius: 10,
//             background: showCategoryPanel ? "#6B35C8" : "#F0EBE0",
//             color: showCategoryPanel ? "#fff" : "#555",
//             border: "1.5px solid #DDD8CC", fontWeight: 700, fontSize: 13, cursor: "pointer",
//           }}>
//             📁 {showCategoryPanel ? "Hide" : "Manage"} Categories
//           </button>
//           <button onClick={() => loadAll(true)} disabled={refreshing} title="Refresh" style={{
//             display: "flex", alignItems: "center", gap: 6,
//             padding: "11px 16px", borderRadius: 10, background: "#F0EBE0", color: "#555",
//             border: "1.5px solid #DDD8CC", fontWeight: 700, fontSize: 14,
//             cursor: refreshing ? "not-allowed" : "pointer",
//           }}>
//             <span style={{ display: "inline-block", animation: refreshing ? "spin 0.7s linear infinite" : "none" }}>🔄</span>
//             {refreshing ? "Refreshing…" : "Refresh"}
//           </button>
//           <button onClick={() => setEditingNote(null)} style={{
//             display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 10,
//             background: "#2C2A22", color: "#FFFDF7", border: "none", fontWeight: 800, fontSize: 14,
//             cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//           }}>
//             ➕ Add Note
//           </button>
//         </div>
//       </div>

//       {/* Category Panel */}
//       {showCategoryPanel && (
//         <CategoryPanel
//           categories={categories}
//           onAdd={() => setEditingCategory(null)}
//           onEdit={setEditingCategory}
//           onDelete={setDeletingCategory}
//         />
//       )}

//       {/* Category filter tabs */}
//       <div style={{ marginBottom: 14 }}>
//         <div style={{ fontSize: 11, fontWeight: 700, color: "#AAA", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 }}>
//           Filter by Category
//         </div>
//         <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//           <button onClick={() => setActiveCategoryId("all")} style={{
//             padding: "7px 16px", borderRadius: 30,
//             background: activeCategoryId === "all" ? "#6B35C8" : "#F3EEFF",
//             color: activeCategoryId === "all" ? "#fff" : "#6B35C8",
//             border: "1.5px solid #C8A8F0", fontWeight: 700, fontSize: 12, cursor: "pointer",
//           }}>
//             📚 All
//             <span style={{ marginLeft: 5, padding: "1px 6px", borderRadius: 8, background: activeCategoryId === "all" ? "rgba(255,255,255,0.25)" : "#C8A8F0", fontSize: 11, fontWeight: 800 }}>
//               {allNotes.length}
//             </span>
//           </button>

//           {categories.map((cat) => {
//             const count = allNotes.filter((n) => n.categoryId === cat.id).length;
//             const isActive = activeCategoryId === cat.id;
//             return (
//               <button key={cat.id} onClick={() => setActiveCategoryId(cat.id)} style={{
//                 padding: "7px 16px", borderRadius: 30,
//                 background: isActive ? "#6B35C8" : "#F3EEFF",
//                 color: isActive ? "#fff" : "#6B35C8",
//                 border: "1.5px solid #C8A8F0", fontWeight: 700, fontSize: 12, cursor: "pointer",
//               }}>
//                 📁 {cat.name}
//                 <span style={{ marginLeft: 5, padding: "1px 6px", borderRadius: 8, background: isActive ? "rgba(255,255,255,0.25)" : "#C8A8F0", fontSize: 11, fontWeight: 800 }}>
//                   {count}
//                 </span>
//               </button>
//             );
//           })}

//           {uncategorizedCount > 0 && (
//             <button onClick={() => setActiveCategoryId("uncategorized")} style={{
//               padding: "7px 16px", borderRadius: 30,
//               background: activeCategoryId === "uncategorized" ? "#888" : "#F0EBE0",
//               color: activeCategoryId === "uncategorized" ? "#fff" : "#888",
//               border: "1.5px solid #DDD8CC", fontWeight: 700, fontSize: 12, cursor: "pointer",
//             }}>
//               📄 Uncategorized
//               <span style={{ marginLeft: 5, padding: "1px 6px", borderRadius: 8, background: activeCategoryId === "uncategorized" ? "rgba(255,255,255,0.25)" : "#DDD8CC", fontSize: 11, fontWeight: 800 }}>
//                 {uncategorizedCount}
//               </span>
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Type Tabs + Search */}
//       <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
//         {(["all", "DEMO", "REAL"] as const).map((tab) => (
//           <button key={tab} onClick={() => setActiveTab(tab)} style={{
//             padding: "8px 18px", borderRadius: 30,
//             background: activeTab === tab ? "#2C2A22" : "#F0EBE0",
//             color: activeTab === tab ? "#FFFDF7" : "#666",
//             border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all .15s",
//           }}>
//             {tab === "all" ? "All" : tab === "DEMO" ? "🎓 Demo" : "📚 Real"}
//             <span style={{
//               marginLeft: 6, padding: "1px 7px", borderRadius: 10,
//               background: activeTab === tab ? "rgba(255,255,255,0.2)" : "#DDD8CC",
//               color: activeTab === tab ? "#fff" : "#888", fontSize: 11, fontWeight: 800,
//             }}>
//               {typeCounts[tab]}
//             </span>
//           </button>
//         ))}
//         <div style={{ marginLeft: "auto", position: "relative" }}>
//           <input value={search} onChange={(e) => setSearch(e.target.value)}
//             placeholder="🔍  Search by title or label…"
//             style={{
//               padding: "8px 36px 8px 14px", border: "1.5px solid #DDD8CC", borderRadius: 30,
//               background: "#FAF7EE", color: "#2C2A22", fontSize: 13, outline: "none",
//               fontFamily: "inherit", minWidth: 220,
//             }}
//           />
//           {search && (
//             <button onClick={() => setSearch("")} style={{
//               position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
//               background: "none", border: "none", cursor: "pointer", color: "#AAA", fontSize: 14, padding: 0,
//             }}>✕</button>
//           )}
//         </div>
//       </div>

//       {search.trim() && !loading && (
//         <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
//           {filtered.length === 0
//             ? `No results for "${search}"`
//             : `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`}
//         </div>
//       )}

//       {loadError && (
//         <div style={{
//           padding: "16px 20px", borderRadius: 12, background: "#FFF0F0",
//           border: "1.5px solid #FFCCCC", color: "#C0392B", fontSize: 14, marginBottom: 16,
//           display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
//         }}>
//           <span>⚠️ {loadError}</span>
//           <button onClick={() => loadAll()} style={{
//             padding: "6px 14px", borderRadius: 8, background: "#C0392B", color: "#fff",
//             border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer",
//           }}>Retry</button>
//         </div>
//       )}

//       {loading ? (
//         <div style={{ textAlign: "center", padding: "60px 0", color: "#BBB", fontSize: 15 }}>
//           <div style={{ width: 32, height: 32, border: "3px solid #DDD", borderTopColor: "#888", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
//           Loading…
//         </div>
//       ) : filtered.length === 0 && !loadError ? (
//         <div style={{
//           textAlign: "center", padding: "60px 0", color: "#CCC", fontSize: 15,
//           border: "2px dashed #EEE9DC", borderRadius: 14,
//         }}>
//           {search.trim()
//             ? `No notes match "${search}".`
//             : activeCategoryId !== "all"
//               ? "No notes in this category yet."
//               : "No notes yet. Click ➕ Add Note to get started."}
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           {filtered.map((note) => (
//             <NoteCard key={note.id} note={note}
//               onView={setViewingNote} onEdit={setEditingNote} onDelete={setDeletingNote}
//             />
//           ))}
//         </div>
//       )}

//       {/* Modals */}
//       {viewingNote && (
//         <PdfModal url={viewingNote.pdfUrl} title={viewingNote.title} onClose={() => setViewingNote(null)} />
//       )}
//       {editingNote !== undefined && (
//         <NoteFormModal
//           editNote={editingNote}
//           categories={categories}
//           onClose={() => setEditingNote(undefined)}
//           onSaved={() => loadAll(true)}
//         />
//       )}
//       {deletingNote && (
//         <DeleteConfirmModal
//           title="Delete Note?"
//           message={<>"{deletingNote.title}" will be permanently deleted along with its PDF.</>}
//           onClose={() => setDeletingNote(null)}
//           onConfirm={handleDeleteNote}
//           deleting={deleting}
//         />
//       )}
//       {editingCategory !== undefined && (
//         <CategoryFormModal
//           editCategory={editingCategory}
//           onClose={() => setEditingCategory(undefined)}
//           onSaved={() => loadAll(true)}
//         />
//       )}
//       {deletingCategory && (
//         <DeleteConfirmModal
//           title="Delete Category?"
//           message={
//             <>
//               "<strong>{deletingCategory.name}</strong>" will be deleted.{" "}
//               {(deletingCategory._count?.notes ?? 0) > 0
//                 ? `${deletingCategory._count!.notes} note(s) will become uncategorized.`
//                 : ""}
//             </>
//           }
//           onClose={() => setDeletingCategory(null)}
//           onConfirm={handleDeleteCategory}
//           deleting={deleting}
//         />
//       )}
//     </div>
//   );
// }



















// "use client";

// import {
//   useState, useCallback, useRef, useEffect,
// } from "react";
// import {
//   BookOpen, FileText, ShoppingBag, Tag, Plus, Search, Filter,
//   Edit2, Trash2, X, Check, ChevronDown, Loader2, AlertCircle,
//   CheckCircle2, Eye, Percent, RefreshCw, TicketPercent, FolderOpen,
//   Upload, Download, Users, DollarSign, TrendingUp, Package,
// } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface NoteCategory    { id: string; name: string; description: string; _count: { notes: number } }
// interface PaperCategory   { id: string; name: string; description: string; _count: { papers: number } }

// interface Note {
//   id: string; serialId: number; title: string; label: string;
//   categoryId: string | null; price: number; discountPercent: number | null;
//   demoUrl: string | null; demoPath: string | null;
//   realUrl: string | null; realPath: string | null;
//   createdAt: string;
//   category: { id: string; name: string } | null;
//   _count: { purchases: number };
// }

// interface TestPaper {
//   id: string; serialId: number; title: string; label: string;
//   categoryId: string | null; price: number; discountPercent: number | null;
//   fileUrl: string; filePath: string; createdAt: string;
//   category: { id: string; name: string } | null;
//   _count: { purchases: number };
// }

// interface Coupon {
//   id: string; code: string; discountPercent: number;
//   scope: "global" | "note" | "test_paper";
//   noteId: string | null; testPaperId: string | null;
//   maxUses: number | null; usedCount: number;
//   expiresAt: string | null; isActive: boolean; createdAt: string;
//   note: { id: string; title: string } | null;
//   testPaper: { id: string; title: string } | null;
//   _count: { purchases: number };
// }

// interface Purchase {
//   id: string; userId: string; noteId: string | null; testPaperId: string | null;
//   couponId: string | null; originalPrice: number; finalPrice: number;
//   discountApplied: number; purchasedAt: string;
//   user: { id: string; name: string | null; email: string };
//   note: { id: string; title: string } | null;
//   testPaper: { id: string; title: string } | null;
//   coupon: { id: string; code: string } | null;
// }

// type Tab = "notes" | "papers" | "coupons" | "purchases";

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function fmt(price: number) {
//   if (price === 0) return "Free";
//   return `₹${price}`;
// }
// function fmtDate(d: string) {
//   return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
// }
// function effectivePrice(price: number, discount: number | null) {
//   if (!discount) return price;
//   return Math.round(price * (1 - discount / 100));
// }

// // ─── Toast ────────────────────────────────────────────────────────────────────

// function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
//   return (
//     <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold border
//       ${type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
//       {type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
//       {msg}
//     </div>
//   );
// }

// // ─── Upload Zone ──────────────────────────────────────────────────────────────

// function UploadZone({
//   label, accept, file, existingUrl, onFile, onRemove, color = "#5b4fcf",
// }: {
//   label: string; accept: string; file: File | null;
//   existingUrl: string | null; onFile: (f: File) => void;
//   onRemove: () => void; color?: string;
// }) {
//   const ref = useRef<HTMLInputElement>(null);
//   const hasFile = !!file || !!existingUrl;

//   return (
//     <div className="flex flex-col gap-1.5 flex-1">
//       <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>{label}</span>
//       {hasFile ? (
//         <div className="flex items-center justify-between px-3 py-2.5 rounded-xl border-2 border-green-300 bg-green-50">
//           <span className="text-xs font-semibold text-green-700 truncate">
//             {file ? `📄 ${file.name}` : "✅ Existing PDF"}
//           </span>
//           <button onClick={onRemove} className="text-red-400 hover:text-red-600 ml-2 flex-shrink-0">
//             <X size={13} />
//           </button>
//         </div>
//       ) : (
//         <button
//           type="button"
//           onClick={() => ref.current?.click()}
//           className="flex flex-col items-center justify-center gap-1 px-3 py-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#5b4fcf]/40 hover:bg-[#5b4fcf]/5 transition-all text-gray-400 hover:text-[#5b4fcf]"
//         >
//           <Upload size={16} />
//           <span className="text-xs font-semibold">Upload {label}</span>
//         </button>
//       )}
//       <input ref={ref} type="file" accept={accept} className="hidden"
//         onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} />
//     </div>
//   );
// }

// // ─── FormField ────────────────────────────────────────────────────────────────

// function FF({ label, children }: { label: string; children: React.ReactNode }) {
//   return (
//     <div className="flex flex-col gap-1.5">
//       <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</label>
//       {children}
//     </div>
//   );
// }

// const inputCls = "w-full px-3 py-2.5 border-2 border-gray-100 rounded-xl text-sm font-medium text-[#1a1a2e] bg-white outline-none focus:border-[#5b4fcf]/40 focus:ring-2 focus:ring-[#5b4fcf]/10 transition-all";
// const selectCls = inputCls + " cursor-pointer";

// // ─── Stat Card ────────────────────────────────────────────────────────────────

// function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
//       <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
//         <Icon size={18} style={{ color }} />
//       </div>
//       <div>
//         <p className="text-xl font-black text-[#1a1a2e]">{value}</p>
//         <p className="text-xs text-gray-400 font-medium">{label}</p>
//       </div>
//     </div>
//   );
// }

// // ─── Delete Confirm Modal ─────────────────────────────────────────────────────

// function DeleteModal({ title, message, onClose, onConfirm, loading }: {
//   title: string; message: string; onClose: () => void; onConfirm: () => void; loading: boolean;
// }) {
//   return (
//     <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose}>
//       <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
//         <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
//           <Trash2 size={24} className="text-red-500" />
//         </div>
//         <h3 className="font-black text-[#1a1a2e] text-lg mb-2">{title}</h3>
//         <p className="text-sm text-gray-400 mb-6">{message}</p>
//         <div className="flex gap-3 justify-center">
//           <button onClick={onConfirm} disabled={loading}
//             className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl disabled:opacity-60 transition-colors">
//             {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
//           </button>
//           <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50">Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Category Manager Modal ───────────────────────────────────────────────────

// function CategoryModal({
//   mode, onClose, authFetch, showToast,
// }: {
//   mode: "notes" | "papers"; onClose: () => void;
//   authFetch: (url: string, init?: RequestInit) => Promise<Response>;
//   showToast: (msg: string, type?: "success" | "error") => void;
// }) {
//   const [cats, setCats]       = useState<(NoteCategory | PaperCategory)[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [name, setName]       = useState("");
//   const [desc, setDesc]       = useState("");
//   const [editId, setEditId]   = useState<string | null>(null);
//   const [saving, setSaving]   = useState(false);
//   const [delId, setDelId]     = useState<string | null>(null);

//   const base = mode === "notes" ? "/api/admin/notes/note-categories" : "/api/admin/notes/test-papers/test-paper-categories";

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await authFetch(base);
//       const d   = await res.json();
//       setCats(d.categories || []);
//     } finally { setLoading(false); }
//   }, [base, authFetch]);

//   useEffect(() => { load(); }, [load]);

//   const handleSave = async () => {
//     if (!name.trim()) return;
//     setSaving(true);
//     try {
//       const url    = editId ? `${base}/${editId}` : base;
//       const method = editId ? "PATCH" : "POST";
//       const res    = await authFetch(url, {
//         method, body: JSON.stringify({ name: name.trim(), description: desc.trim() }),
//       });
//       if (!res.ok) throw new Error((await res.json()).error);
//       showToast(editId ? "Category updated!" : "Category created!");
//       setName(""); setDesc(""); setEditId(null);
//       load();
//     } catch (e: any) { showToast(e.message, "error"); }
//     finally { setSaving(false); }
//   };

//   const handleDelete = async (id: string) => {
//     setDelId(id);
//     try {
//       const res = await authFetch(`${base}/${id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error((await res.json()).error);
//       showToast("Category deleted.");
//       load();
//     } catch (e: any) { showToast(e.message, "error"); }
//     finally { setDelId(null); }
//   };

//   return (
//     <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose}>
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-2.5">
//             <div className="w-8 h-8 bg-gradient-to-br from-[#5b4fcf] to-[#7c3aed] rounded-xl flex items-center justify-center">
//               <FolderOpen size={15} className="text-white" />
//             </div>
//             <h2 className="font-black text-[#1a1a2e]">{mode === "notes" ? "Note" : "Test Paper"} Categories</h2>
//           </div>
//           <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={17} /></button>
//         </div>

//         {/* Add / Edit form */}
//         <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
//           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">{editId ? "Edit Category" : "New Category"}</p>
//           <div className="flex gap-2 mb-2">
//             <input value={name} onChange={e => setName(e.target.value)} placeholder="Category name…"
//               className={inputCls + " flex-1"} />
//             <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description (optional)"
//               className={inputCls + " flex-[2]"} />
//           </div>
//           <div className="flex gap-2">
//             <button onClick={handleSave} disabled={saving || !name.trim()}
//               className="flex items-center gap-1.5 px-4 py-2 bg-[#5b4fcf] hover:bg-[#7c3aed] text-white text-xs font-bold rounded-lg disabled:opacity-50 transition-colors">
//               {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
//               {editId ? "Save Changes" : "Add"}
//             </button>
//             {editId && (
//               <button onClick={() => { setEditId(null); setName(""); setDesc(""); }}
//                 className="px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
//                 Cancel
//               </button>
//             )}
//           </div>
//         </div>

//         {/* List */}
//         <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
//           {loading ? (
//             <div className="flex justify-center py-8"><Loader2 size={22} className="animate-spin text-[#5b4fcf]" /></div>
//           ) : cats.length === 0 ? (
//             <div className="text-center py-8 text-gray-400 text-sm">No categories yet.</div>
//           ) : cats.map(c => (
//             <div key={c.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl">
//               <FolderOpen size={15} className="text-[#5b4fcf] flex-shrink-0" />
//               <div className="flex-1 min-w-0">
//                 <p className="font-bold text-sm text-[#1a1a2e]">{c.name}</p>
//                 {c.description && <p className="text-xs text-gray-400 truncate">{c.description}</p>}
//               </div>
//               <span className="text-xs text-gray-400 font-medium flex-shrink-0">
//                 {"_count" in c ? (c._count as any).notes ?? (c._count as any).papers ?? 0 : 0} items
//               </span>
//               <button onClick={() => { setEditId(c.id); setName(c.name); setDesc(c.description); }}
//                 className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
//                 <Edit2 size={13} />
//               </button>
//               <button onClick={() => handleDelete(c.id)} disabled={delId === c.id}
//                 className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
//                 {delId === c.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Note Modal ───────────────────────────────────────────────────────────────

// function NoteModal({
//   editNote, categories, onClose, onSaved, authFetch, showToast, token,
// }: {
//   editNote: Note | null; categories: NoteCategory[]; onClose: () => void;
//   onSaved: (n: Note) => void;
//   authFetch: (url: string, init?: RequestInit) => Promise<Response>;
//   showToast: (msg: string, type?: "success" | "error") => void;
//   token: string | null;
// }) {
//   const isEdit = !!editNote;

//   const [title,      setTitle]      = useState(editNote?.title      ?? "");
//   const [label,      setLabel]      = useState(editNote?.label      ?? "");
//   const [serialId,   setSerialId]   = useState<number>(editNote?.serialId ?? 1);
//   const [catId,      setCatId]      = useState(editNote?.categoryId ?? "");
//   const [price,      setPrice]      = useState<number>(editNote?.price ?? 0);
//   const [discount,   setDiscount]   = useState<number | "">(editNote?.discountPercent ?? "");

//   // Demo PDF
//   const [demoFile,   setDemoFile]   = useState<File | null>(null);
//   const [keepDemo,   setKeepDemo]   = useState(!!editNote?.demoUrl);
//   // Real PDF
//   const [realFile,   setRealFile]   = useState<File | null>(null);
//   const [keepReal,   setKeepReal]   = useState(!!editNote?.realUrl);

//   const [saving,  setSaving]  = useState(false);
//   const [error,   setError]   = useState("");

//   const BUCKET = "notes-pdfs";

//   const uploadPdf = async (file: File, folder: string): Promise<{ url: string; path: string }> => {
//     const ext      = file.name.split(".").pop();
//     const path     = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("bucket", BUCKET);
//     formData.append("path", path);
//     const res = await fetch("/api/admin/notes/upload-pdf", {
//       method: "POST",
//       headers: token ? { Authorization: `Bearer ${token}` } : {},
//       body: formData,
//     });
//     const d = await res.json();
//     if (!res.ok) throw new Error(d.error || "Upload failed");
//     return { url: d.url, path };
//   };

//   const handleSave = async () => {
//     setError("");
//     if (!title.trim()) return setError("Title is required.");
//     const hasDemoFinal = keepDemo || !!demoFile;
//     const hasRealFinal = keepReal || !!realFile;
//     if (!hasDemoFinal && !hasRealFinal) return setError("Upload at least one PDF (Demo or Real).");

//     setSaving(true);
//     try {
//       let demoUrl  = keepDemo ? (editNote?.demoUrl  ?? null) : null;
//       let demoPath = keepDemo ? (editNote?.demoPath ?? null) : null;
//       let realUrl  = keepReal ? (editNote?.realUrl  ?? null) : null;
//       let realPath = keepReal ? (editNote?.realPath ?? null) : null;

//       if (demoFile) { const r = await uploadPdf(demoFile, "demo"); demoUrl = r.url; demoPath = r.path; }
//       if (realFile) { const r = await uploadPdf(realFile, "real"); realUrl = r.url; realPath = r.path; }

//       const body: Record<string, any> = {
//         serialId, title: title.trim(), label: label.trim(),
//         categoryId: catId || null, price,
//         discountPercent: discount !== "" ? Number(discount) : null,
//         demoUrl, demoPath, realUrl, realPath,
//       };
//       if (isEdit) {
//         body.removeDemo = !keepDemo && !demoFile;
//         body.removeReal = !keepReal && !realFile;
//       }

//       const url    = isEdit ? `/api/admin/notes/${editNote!.id}` : "/api/admin/notes";
//       const method = isEdit ? "PATCH" : "POST";
//       const res    = await authFetch(url, { method, body: JSON.stringify(body) });
//       const d      = await res.json();
//       if (!res.ok) throw new Error(d.error || "Failed");
//       showToast(isEdit ? "Note updated!" : "Note created!");
//       onSaved(d.note);
//       onClose();
//     } catch (e: any) {
//       setError(e.message);
//     } finally { setSaving(false); }
//   };

//   const effPrice = typeof discount === "number" && discount > 0 ? effectivePrice(price, discount) : price;

//   return (
//     <div className="fixed inset-0 z-[9990] flex justify-center overflow-y-auto p-4"
//       style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose}>
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl h-fit mt-12 mb-8" onClick={e => e.stopPropagation()}>
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-2.5">
//             <div className="w-8 h-8 bg-gradient-to-br from-[#5b4fcf] to-[#7c3aed] rounded-xl flex items-center justify-center">
//               <BookOpen size={15} className="text-white" />
//             </div>
//             <h2 className="font-black text-[#1a1a2e]">{isEdit ? "Edit Note" : "Add Note"}</h2>
//           </div>
//           <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={17} /></button>
//         </div>

//         {/* Body */}
//         <div className="px-6 py-5 space-y-4">
//           <div className="grid grid-cols-4 gap-3">
//             <FF label="Serial #">
//               <input type="number" min={1} value={serialId} onChange={e => setSerialId(+e.target.value)} className={inputCls} />
//             </FF>
//             <div className="col-span-3">
//               <FF label="Title *">
//                 <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Abacus Level 1 – Unit 2" className={inputCls} />
//               </FF>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <FF label="Label / Tag">
//               <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Week 3, Advanced" className={inputCls} />
//             </FF>
//             <FF label="Category">
//               <select value={catId} onChange={e => setCatId(e.target.value)} className={selectCls}>
//                 <option value="">— None —</option>
//                 {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//               </select>
//             </FF>
//           </div>

//           {/* Pricing */}
//           <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
//             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pricing</p>
//             <div className="grid grid-cols-2 gap-3">
//               <FF label="Price ₹ (0 = Free)">
//                 <input type="number" min={0} value={price} onChange={e => setPrice(+e.target.value)} className={inputCls} />
//               </FF>
//               <FF label="Discount % (optional)">
//                 <input type="number" min={1} max={100} value={discount}
//                   onChange={e => setDiscount(e.target.value === "" ? "" : +e.target.value)}
//                   placeholder="e.g. 20" className={inputCls} />
//               </FF>
//             </div>
//             {/* Price preview */}
//             <div className="flex items-center gap-3 text-sm">
//               {price === 0 ? (
//                 <span className="flex items-center gap-1.5 text-green-600 font-bold">🆓 Free</span>
//               ) : (
//                 <>
//                   <span className="font-bold text-[#5b4fcf]">₹{price}</span>
//                   {typeof discount === "number" && discount > 0 && (
//                     <>
//                       <span className="text-gray-300">→</span>
//                       <span className="font-black text-green-600">₹{effPrice}</span>
//                       <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">{discount}% off</span>
//                     </>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>

//           {/* PDF Uploads */}
//           <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
//             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">PDF Files — at least one required</p>
//             <div className="grid grid-cols-2 gap-3">
//               <UploadZone
//                 label="Demo Version (preview)"
//                 accept="application/pdf"
//                 file={demoFile}
//                 existingUrl={keepDemo ? (editNote?.demoUrl ?? null) : null}
//                 onFile={f => { setDemoFile(f); setKeepDemo(false); }}
//                 onRemove={() => { setDemoFile(null); setKeepDemo(false); }}
//                 color="#2563eb"
//               />
//               <UploadZone
//                 label="Real Version (full)"
//                 accept="application/pdf"
//                 file={realFile}
//                 existingUrl={keepReal ? (editNote?.realUrl ?? null) : null}
//                 onFile={f => { setRealFile(f); setKeepReal(false); }}
//                 onRemove={() => { setRealFile(null); setKeepReal(false); }}
//                 color="#059669"
//               />
//             </div>
//           </div>

//           {error && (
//             <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-semibold">
//               <AlertCircle size={14} /> {error}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
//           <button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
//           <button onClick={handleSave} disabled={saving}
//             className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5b4fcf] to-[#7c3aed] text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity">
//             {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
//             {isEdit ? "Save Changes" : "Create Note"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Paper Modal ──────────────────────────────────────────────────────────────

// function PaperModal({
//   editPaper, categories, onClose, onSaved, authFetch, showToast, token,
// }: {
//   editPaper: TestPaper | null; categories: PaperCategory[]; onClose: () => void;
//   onSaved: (p: TestPaper) => void;
//   authFetch: (url: string, init?: RequestInit) => Promise<Response>;
//   showToast: (msg: string, type?: "success" | "error") => void;
//   token: string | null;
// }) {
//   const isEdit = !!editPaper;

//   const [title,    setTitle]    = useState(editPaper?.title    ?? "");
//   const [label,    setLabel]    = useState(editPaper?.label    ?? "");
//   const [serialId, setSerialId] = useState<number>(editPaper?.serialId ?? 1);
//   const [catId,    setCatId]    = useState(editPaper?.categoryId ?? "");
//   const [price,    setPrice]    = useState<number>(editPaper?.price ?? 0);
//   const [discount, setDiscount] = useState<number | "">(editPaper?.discountPercent ?? "");
//   const [file,     setFile]     = useState<File | null>(null);
//   const [keepFile, setKeepFile] = useState(!!editPaper?.fileUrl);
//   const [saving,   setSaving]   = useState(false);
//   const [error,    setError]    = useState("");

//   const uploadPdf = async (f: File): Promise<{ url: string; path: string }> => {
//     const ext  = f.name.split(".").pop();
//     const path = `papers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
//     const fd   = new FormData();
//     fd.append("file", f); fd.append("bucket", "test-papers"); fd.append("path", path);
//     const res = await fetch("/api/admin/notes/upload-pdf", {
//       method: "POST",
//       headers: token ? { Authorization: `Bearer ${token}` } : {},
//       body: fd,
//     });
//     const d = await res.json();
//     if (!res.ok) throw new Error(d.error || "Upload failed");
//     return { url: d.url, path };
//   };

//   const handleSave = async () => {
//     setError("");
//     if (!title.trim()) return setError("Title is required.");
//     if (!file && !keepFile) return setError("Please upload a PDF.");
//     setSaving(true);
//     try {
//       let fileUrl  = keepFile ? editPaper?.fileUrl  : "";
//       let filePath = keepFile ? editPaper?.filePath : "";
//       if (file) { const r = await uploadPdf(file); fileUrl = r.url; filePath = r.path; }

//       const body = {
//         serialId, title: title.trim(), label: label.trim(),
//         categoryId: catId || null, price,
//         discountPercent: discount !== "" ? Number(discount) : null,
//         fileUrl, filePath,
//       };
//       const url    = isEdit ? `/api/admin/notes/test-papers/${editPaper!.id}` : "/api/admin/notes/test-papers";
//       const method = isEdit ? "PATCH" : "POST";
//       const res    = await authFetch(url, { method, body: JSON.stringify(body) });
//       const d      = await res.json();
//       if (!res.ok) throw new Error(d.error || "Failed");
//       showToast(isEdit ? "Test paper updated!" : "Test paper created!");
//       onSaved(d.paper);
//       onClose();
//     } catch (e: any) {
//       setError(e.message);
//     } finally { setSaving(false); }
//   };

//   const effPrice = typeof discount === "number" && discount > 0 ? effectivePrice(price, discount) : price;

//   return (
//     <div className="fixed inset-0 z-[9990] flex justify-center overflow-y-auto p-4"
//       style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose}>
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl h-fit mt-12 mb-8" onClick={e => e.stopPropagation()}>
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-2.5">
//             <div className="w-8 h-8 bg-gradient-to-br from-[#0891b2] to-[#0e7490] rounded-xl flex items-center justify-center">
//               <FileText size={15} className="text-white" />
//             </div>
//             <h2 className="font-black text-[#1a1a2e]">{isEdit ? "Edit Test Paper" : "Add Test Paper"}</h2>
//           </div>
//           <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={17} /></button>
//         </div>

//         <div className="px-6 py-5 space-y-4">
//           <div className="grid grid-cols-4 gap-3">
//             <FF label="Serial #">
//               <input type="number" min={1} value={serialId} onChange={e => setSerialId(+e.target.value)} className={inputCls} />
//             </FF>
//             <div className="col-span-3">
//               <FF label="Title *">
//                 <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. SOF Olympiad 2024" className={inputCls} />
//               </FF>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <FF label="Label / Tag">
//               <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Class 3–5" className={inputCls} />
//             </FF>
//             <FF label="Category">
//               <select value={catId} onChange={e => setCatId(e.target.value)} className={selectCls}>
//                 <option value="">— None —</option>
//                 {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//               </select>
//             </FF>
//           </div>

//           <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
//             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pricing</p>
//             <div className="grid grid-cols-2 gap-3">
//               <FF label="Price ₹ (0 = Free)">
//                 <input type="number" min={0} value={price} onChange={e => setPrice(+e.target.value)} className={inputCls} />
//               </FF>
//               <FF label="Discount % (optional)">
//                 <input type="number" min={1} max={100} value={discount}
//                   onChange={e => setDiscount(e.target.value === "" ? "" : +e.target.value)}
//                   placeholder="e.g. 15" className={inputCls} />
//               </FF>
//             </div>
//             <div className="flex items-center gap-3 text-sm">
//               {price === 0 ? (
//                 <span className="text-green-600 font-bold">🆓 Free</span>
//               ) : (
//                 <>
//                   <span className="font-bold text-[#0891b2]">₹{price}</span>
//                   {typeof discount === "number" && discount > 0 && (
//                     <>
//                       <span className="text-gray-300">→</span>
//                       <span className="font-black text-green-600">₹{effPrice}</span>
//                       <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">{discount}% off</span>
//                     </>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>

//           <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
//             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">PDF File *</p>
//             <UploadZone
//               label="Test Paper PDF"
//               accept="application/pdf"
//               file={file}
//               existingUrl={keepFile ? (editPaper?.fileUrl ?? null) : null}
//               onFile={f => { setFile(f); setKeepFile(false); }}
//               onRemove={() => { setFile(null); setKeepFile(false); }}
//               color="#0891b2"
//             />
//           </div>

//           {error && (
//             <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-semibold">
//               <AlertCircle size={14} /> {error}
//             </div>
//           )}
//         </div>

//         <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
//           <button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
//           <button onClick={handleSave} disabled={saving}
//             className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0891b2] to-[#0e7490] text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity">
//             {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
//             {isEdit ? "Save Changes" : "Add Test Paper"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Coupon Modal ─────────────────────────────────────────────────────────────

// function CouponModal({
//   editCoupon, notes, papers, onClose, onSaved, authFetch, showToast,
// }: {
//   editCoupon: Coupon | null;
//   notes: Note[]; papers: TestPaper[];
//   onClose: () => void; onSaved: (c: Coupon) => void;
//   authFetch: (url: string, init?: RequestInit) => Promise<Response>;
//   showToast: (msg: string, type?: "success" | "error") => void;
// }) {
//   const isEdit = !!editCoupon;
//   const [code,       setCode]       = useState(editCoupon?.code             ?? "");
//   const [discount,   setDiscount]   = useState<number>(editCoupon?.discountPercent ?? 10);
//   const [scope,      setScope]      = useState<"global"|"note"|"test_paper">(editCoupon?.scope ?? "global");
//   const [noteId,     setNoteId]     = useState(editCoupon?.noteId       ?? "");
//   const [paperId,    setPaperId]    = useState(editCoupon?.testPaperId  ?? "");
//   const [maxUses,    setMaxUses]    = useState<number | "">(editCoupon?.maxUses ?? "");
//   const [expiresAt,  setExpiresAt]  = useState(editCoupon?.expiresAt ? editCoupon.expiresAt.slice(0, 10) : "");
//   const [isActive,   setIsActive]   = useState(editCoupon?.isActive    ?? true);
//   const [saving,     setSaving]     = useState(false);
//   const [error,      setError]      = useState("");

//   const handleSave = async () => {
//     setError("");
//     if (!code.trim())               return setError("Code is required.");
//     if (discount < 1 || discount > 100) return setError("Discount must be 1–100.");
//     if (scope === "note" && !noteId)     return setError("Select a note for this coupon.");
//     if (scope === "test_paper" && !paperId) return setError("Select a test paper.");
//     setSaving(true);
//     try {
//       const body = {
//         code: code.trim().toUpperCase(), discountPercent: discount, scope,
//         noteId: scope === "note" ? noteId : null,
//         testPaperId: scope === "test_paper" ? paperId : null,
//         maxUses: maxUses !== "" ? Number(maxUses) : null,
//         expiresAt: expiresAt || null, isActive,
//       };
//       const url    = isEdit ? `/api/admin/notes/coupons/${editCoupon!.id}` : "/api/admin/notes/coupons";
//       const method = isEdit ? "PATCH" : "POST";
//       const res    = await authFetch(url, { method, body: JSON.stringify(body) });
//       const d      = await res.json();
//       if (!res.ok) throw new Error(d.error || "Failed");
//       showToast(isEdit ? "Coupon updated!" : "Coupon created!");
//       onSaved(d.coupon);
//       onClose();
//     } catch (e: any) { setError(e.message); }
//     finally { setSaving(false); }
//   };

//   return (
//     <div className="fixed inset-0 z-[9990] flex justify-center overflow-y-auto p-4"
//       style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose}>
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-fit mt-12 mb-8" onClick={e => e.stopPropagation()}>
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-2.5">
//             <div className="w-8 h-8 bg-gradient-to-br from-[#d97706] to-[#b45309] rounded-xl flex items-center justify-center">
//               <TicketPercent size={15} className="text-white" />
//             </div>
//             <h2 className="font-black text-[#1a1a2e]">{isEdit ? "Edit Coupon" : "Create Coupon"}</h2>
//           </div>
//           <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={17} /></button>
//         </div>

//         <div className="px-6 py-5 space-y-4">
//           <div className="grid grid-cols-2 gap-3">
//             <FF label="Coupon Code *">
//               <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. SAVE50"
//                 className={inputCls + " uppercase font-mono tracking-widest"} />
//             </FF>
//             <FF label="Discount %">
//               <input type="number" min={1} max={100} value={discount}
//                 onChange={e => setDiscount(+e.target.value)} className={inputCls} />
//             </FF>
//           </div>

//           <FF label="Scope — what does this coupon apply to?">
//             <div className="grid grid-cols-3 gap-2">
//               {(["global", "note", "test_paper"] as const).map(s => (
//                 <button key={s} type="button" onClick={() => setScope(s)}
//                   className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all
//                     ${scope === s ? "border-[#d97706] bg-[#d97706]/10 text-[#b45309]" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}>
//                   {s === "global" ? "🌐 Global" : s === "note" ? "📚 Note" : "📝 Paper"}
//                 </button>
//               ))}
//             </div>
//           </FF>

//           {scope === "note" && (
//             <FF label="Specific Note">
//               <select value={noteId} onChange={e => setNoteId(e.target.value)} className={selectCls}>
//                 <option value="">— Select Note —</option>
//                 {notes.map(n => <option key={n.id} value={n.id}>#{n.serialId} {n.title}</option>)}
//               </select>
//             </FF>
//           )}

//           {scope === "test_paper" && (
//             <FF label="Specific Test Paper">
//               <select value={paperId} onChange={e => setPaperId(e.target.value)} className={selectCls}>
//                 <option value="">— Select Paper —</option>
//                 {papers.map(p => <option key={p.id} value={p.id}>#{p.serialId} {p.title}</option>)}
//               </select>
//             </FF>
//           )}

//           <div className="grid grid-cols-2 gap-3">
//             <FF label="Max Uses (blank = unlimited)">
//               <input type="number" min={1} value={maxUses}
//                 onChange={e => setMaxUses(e.target.value === "" ? "" : +e.target.value)}
//                 placeholder="Unlimited" className={inputCls} />
//             </FF>
//             <FF label="Expires At (optional)">
//               <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className={inputCls} />
//             </FF>
//           </div>

//           {isEdit && (
//             <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-100 hover:border-[#d97706]/30 transition-colors">
//               <div className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${isActive ? "bg-[#d97706]" : "bg-gray-200"}`}
//                 onClick={() => setIsActive(v => !v)}>
//                 <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${isActive ? "left-4" : "left-0.5"}`} />
//               </div>
//               <span className="text-sm font-semibold text-[#1a1a2e]">{isActive ? "Active" : "Inactive"}</span>
//             </label>
//           )}

//           {error && (
//             <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-semibold">
//               <AlertCircle size={14} /> {error}
//             </div>
//           )}
//         </div>

//         <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
//           <button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
//           <button onClick={handleSave} disabled={saving}
//             className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d97706] to-[#b45309] text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity">
//             {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
//             {isEdit ? "Save Changes" : "Create Coupon"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Notes Tab ────────────────────────────────────────────────────────────────

// function NotesTab({ authFetch, showToast, token }: {
//   authFetch: (url: string, init?: RequestInit) => Promise<Response>;
//   showToast: (msg: string, type?: "success" | "error") => void;
//   token: string | null;
// }) {
//   const [notes,      setNotes]      = useState<Note[]>([]);
//   const [categories, setCategories] = useState<NoteCategory[]>([]);
//   const [loading,    setLoading]    = useState(true);
//   const [search,     setSearch]     = useState("");
//   const [catFilter,  setCatFilter]  = useState("");
//   const [priceFilter,setPriceFilter]= useState("");
//   const [availFilter,setAvailFilter]= useState("");
//   const [editNote,   setEditNote]   = useState<Note | null | undefined>(undefined);
//   const [delNote,    setDelNote]    = useState<Note | null>(null);
//   const [deleting,   setDeleting]   = useState(false);
//   const [showCatMgr, setShowCatMgr] = useState(false);

//   const loadCats = useCallback(async () => {
//     const res = await authFetch("/api/admin/notes/note-categories");
//     const d   = await res.json();
//     setCategories(d.categories || []);
//   }, [authFetch]);

//   const loadNotes = useCallback(async () => {
//     setLoading(true);
//     try {
//       const p = new URLSearchParams();
//       if (search)      p.set("search",       search);
//       if (catFilter)   p.set("categoryId",   catFilter);
//       if (priceFilter) p.set("price",        priceFilter);
//       if (availFilter) p.set("availability", availFilter);
//       const res = await authFetch(`/api/admin/notes?${p}`);
//       const d   = await res.json();
//       setNotes(d.notes || []);
//     } finally { setLoading(false); }
//   }, [authFetch, search, catFilter, priceFilter, availFilter]);

//   useEffect(() => { loadCats(); }, [loadCats]);
//   useEffect(() => { loadNotes(); }, [loadNotes]);

//   const handleDelete = async () => {
//     if (!delNote) return;
//     setDeleting(true);
//     try {
//       const res = await authFetch(`/api/admin/notes/${delNote.id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error((await res.json()).error);
//       showToast("Note deleted.");
//       setDelNote(null);
//       loadNotes();
//     } catch (e: any) { showToast(e.message, "error"); }
//     finally { setDeleting(false); }
//   };

//   const clearFilters = () => { setSearch(""); setCatFilter(""); setPriceFilter(""); setAvailFilter(""); };
//   const hasFilters = !!(search || catFilter || priceFilter || availFilter);

//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <div>
//           <h2 className="text-lg font-black text-[#1a1a2e]">Notes Library</h2>
//           <p className="text-xs text-gray-400 mt-0.5">{notes.length} notes total</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <button onClick={() => setShowCatMgr(true)}
//             className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors text-gray-600">
//             <FolderOpen size={14} /> Categories
//           </button>
//           <button onClick={() => setEditNote(null)}
//             className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#5b4fcf] to-[#7c3aed] text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity">
//             <Plus size={14} /> Add Note
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-2 items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
//         <div className="relative flex-1 min-w-[180px]">
//           <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes…"
//             className="w-full pl-8 pr-3 py-2 border border-gray-100 rounded-lg text-sm outline-none focus:border-[#5b4fcf]/40 bg-gray-50" />
//         </div>
//         <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
//           className="px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 outline-none focus:border-[#5b4fcf]/40 text-gray-600">
//           <option value="">All Categories</option>
//           <option value="uncategorized">Uncategorized</option>
//           {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//         </select>
//         <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}
//           className="px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 outline-none focus:border-[#5b4fcf]/40 text-gray-600">
//           <option value="">Any Price</option>
//           <option value="free">Free Only</option>
//           <option value="paid">Paid Only</option>
//         </select>
//         <select value={availFilter} onChange={e => setAvailFilter(e.target.value)}
//           className="px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 outline-none focus:border-[#5b4fcf]/40 text-gray-600">
//           <option value="">All Versions</option>
//           <option value="both">Demo + Real</option>
//           <option value="demo_only">Demo Only</option>
//           <option value="real_only">Real Only</option>
//         </select>
//         <button onClick={loadNotes} className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
//           <RefreshCw size={14} />
//         </button>
//         {hasFilters && (
//           <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
//             <X size={13} /> Clear
//           </button>
//         )}
//       </div>

//       {/* List */}
//       {loading ? (
//         <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-[#5b4fcf]" /></div>
//       ) : notes.length === 0 ? (
//         <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
//           <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
//           <p className="font-semibold text-sm">No notes found</p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//           {notes.map((note, i) => {
//             const effP = effectivePrice(note.price, note.discountPercent);
//             return (
//               <div key={note.id}
//                 className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${i < notes.length - 1 ? "border-b border-gray-50" : ""}`}>
//                 {/* Serial */}
//                 <div className="w-9 h-9 rounded-xl bg-[#5b4fcf]/10 flex items-center justify-center flex-shrink-0">
//                   <span className="text-xs font-black text-[#5b4fcf]">#{note.serialId}</span>
//                 </div>
//                 {/* Icon */}
//                 <BookOpen size={18} className="text-[#5b4fcf]/40 flex-shrink-0" />
//                 {/* Info */}
//                 <div className="flex-1 min-w-0">
//                   <p className="font-bold text-sm text-[#1a1a2e] truncate">{note.title}</p>
//                   <div className="flex items-center gap-2 mt-1 flex-wrap">
//                     {note.category && (
//                       <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5b4fcf]/10 text-[#5b4fcf]">
//                         {note.category.name}
//                       </span>
//                     )}
//                     {note.label && (
//                       <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">{note.label}</span>
//                     )}
//                     <span className="text-[10px] text-gray-400 font-medium">🛒 {note._count.purchases} sold</span>
//                   </div>
//                 </div>
//                 {/* PDF slots */}
//                 <div className="flex gap-1.5 flex-shrink-0">
//                   <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border
//                     ${note.demoUrl ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-gray-50 border-gray-100 text-gray-300"}`}>
//                     {note.demoUrl ? "✓" : "—"} Demo
//                   </span>
//                   <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border
//                     ${note.realUrl ? "bg-green-50 border-green-200 text-green-600" : "bg-gray-50 border-gray-100 text-gray-300"}`}>
//                     {note.realUrl ? "✓" : "—"} Real
//                   </span>
//                 </div>
//                 {/* Price */}
//                 <div className="text-right flex-shrink-0 min-w-[60px]">
//                   {note.price === 0 ? (
//                     <span className="text-xs font-black text-green-600">Free</span>
//                   ) : (
//                     <div>
//                       {note.discountPercent ? (
//                         <>
//                           <span className="text-xs line-through text-gray-300 block">₹{note.price}</span>
//                           <span className="text-xs font-black text-[#5b4fcf]">₹{effP}</span>
//                         </>
//                       ) : (
//                         <span className="text-xs font-black text-[#5b4fcf]">₹{note.price}</span>
//                       )}
//                     </div>
//                   )}
//                 </div>
//                 {/* Actions */}
//                 <div className="flex items-center gap-1 flex-shrink-0">
//                   <button onClick={() => setEditNote(note)}
//                     className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
//                     <Edit2 size={14} />
//                   </button>
//                   <button onClick={() => setDelNote(note)}
//                     className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Modals */}
//       {editNote !== undefined && (
//         <NoteModal editNote={editNote} categories={categories} onClose={() => setEditNote(undefined)}
//           onSaved={saved => { setNotes(ns => editNote ? ns.map(n => n.id === saved.id ? saved : n) : [saved, ...ns]); }}
//           authFetch={authFetch} showToast={showToast} token={token} />
//       )}
//       {delNote && (
//         <DeleteModal title="Delete Note?" message={`"${delNote.title}" will be permanently deleted.`}
//           onClose={() => setDelNote(null)} onConfirm={handleDelete} loading={deleting} />
//       )}
//       {showCatMgr && (
//         <CategoryModal mode="notes" onClose={() => { setShowCatMgr(false); loadCats(); }}
//           authFetch={authFetch} showToast={showToast} />
//       )}
//     </div>
//   );
// }

// // ─── Papers Tab ───────────────────────────────────────────────────────────────

// function PapersTab({ authFetch, showToast, token }: {
//   authFetch: (url: string, init?: RequestInit) => Promise<Response>;
//   showToast: (msg: string, type?: "success" | "error") => void;
//   token: string | null;
// }) {
//   const [papers,     setPapers]     = useState<TestPaper[]>([]);
//   const [categories, setCategories] = useState<PaperCategory[]>([]);
//   const [loading,    setLoading]    = useState(true);
//   const [search,     setSearch]     = useState("");
//   const [catFilter,  setCatFilter]  = useState("");
//   const [priceFilter,setPriceFilter]= useState("");
//   const [editPaper,  setEditPaper]  = useState<TestPaper | null | undefined>(undefined);
//   const [delPaper,   setDelPaper]   = useState<TestPaper | null>(null);
//   const [deleting,   setDeleting]   = useState(false);
//   const [showCatMgr, setShowCatMgr] = useState(false);

//   const loadCats = useCallback(async () => {
//     const res = await authFetch("/api/admin/notes/test-papers/test-paper-categories");
//     const d   = await res.json();
//     setCategories(d.categories || []);
//   }, [authFetch]);

//   const loadPapers = useCallback(async () => {
//     setLoading(true);
//     try {
//       const p = new URLSearchParams();
//       if (search)      p.set("search",     search);
//       if (catFilter)   p.set("categoryId", catFilter);
//       if (priceFilter) p.set("price",      priceFilter);
//       const res = await authFetch(`/api/admin/notes/test-papers?${p}`);
//       const d   = await res.json();
//       setPapers(d.papers || []);
//     } finally { setLoading(false); }
//   }, [authFetch, search, catFilter, priceFilter]);

//   useEffect(() => { loadCats(); }, [loadCats]);
//   useEffect(() => { loadPapers(); }, [loadPapers]);

//   const handleDelete = async () => {
//     if (!delPaper) return;
//     setDeleting(true);
//     try {
//       const res = await authFetch(`/api/admin/notes/test-papers/${delPaper.id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error((await res.json()).error);
//       showToast("Test paper deleted.");
//       setDelPaper(null);
//       loadPapers();
//     } catch (e: any) { showToast(e.message, "error"); }
//     finally { setDeleting(false); }
//   };

//   const clearFilters = () => { setSearch(""); setCatFilter(""); setPriceFilter(""); };
//   const hasFilters = !!(search || catFilter || priceFilter);

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <div>
//           <h2 className="text-lg font-black text-[#1a1a2e]">Test Papers</h2>
//           <p className="text-xs text-gray-400 mt-0.5">{papers.length} papers total</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <button onClick={() => setShowCatMgr(true)}
//             className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors text-gray-600">
//             <FolderOpen size={14} /> Categories
//           </button>
//           <button onClick={() => setEditPaper(null)}
//             className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#0891b2] to-[#0e7490] text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity">
//             <Plus size={14} /> Add Paper
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-2 items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
//         <div className="relative flex-1 min-w-[180px]">
//           <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search papers…"
//             className="w-full pl-8 pr-3 py-2 border border-gray-100 rounded-lg text-sm outline-none focus:border-[#0891b2]/40 bg-gray-50" />
//         </div>
//         <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
//           className="px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 outline-none focus:border-[#0891b2]/40 text-gray-600">
//           <option value="">All Categories</option>
//           <option value="uncategorized">Uncategorized</option>
//           {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//         </select>
//         <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}
//           className="px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 outline-none focus:border-[#0891b2]/40 text-gray-600">
//           <option value="">Any Price</option>
//           <option value="free">Free Only</option>
//           <option value="paid">Paid Only</option>
//         </select>
//         <button onClick={loadPapers} className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
//           <RefreshCw size={14} />
//         </button>
//         {hasFilters && (
//           <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
//             <X size={13} /> Clear
//           </button>
//         )}
//       </div>

//       {/* List */}
//       {loading ? (
//         <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-[#0891b2]" /></div>
//       ) : papers.length === 0 ? (
//         <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
//           <FileText size={32} className="mx-auto mb-3 opacity-30" />
//           <p className="font-semibold text-sm">No test papers found</p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//           {papers.map((paper, i) => {
//             const effP = effectivePrice(paper.price, paper.discountPercent);
//             return (
//               <div key={paper.id}
//                 className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${i < papers.length - 1 ? "border-b border-gray-50" : ""}`}>
//                 <div className="w-9 h-9 rounded-xl bg-[#0891b2]/10 flex items-center justify-center flex-shrink-0">
//                   <span className="text-xs font-black text-[#0891b2]">#{paper.serialId}</span>
//                 </div>
//                 <FileText size={18} className="text-[#0891b2]/40 flex-shrink-0" />
//                 <div className="flex-1 min-w-0">
//                   <p className="font-bold text-sm text-[#1a1a2e] truncate">{paper.title}</p>
//                   <div className="flex items-center gap-2 mt-1 flex-wrap">
//                     {paper.category && (
//                       <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0891b2]/10 text-[#0891b2]">
//                         {paper.category.name}
//                       </span>
//                     )}
//                     {paper.label && (
//                       <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">{paper.label}</span>
//                     )}
//                     <span className="text-[10px] text-gray-400 font-medium">⬇️ {paper._count.purchases} downloaded</span>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-1.5 flex-shrink-0">
//                   <Download size={12} className="text-gray-300" />
//                   <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gray-50 border border-gray-100 text-gray-500">PDF</span>
//                 </div>
//                 <div className="text-right flex-shrink-0 min-w-[60px]">
//                   {paper.price === 0 ? (
//                     <span className="text-xs font-black text-green-600">Free</span>
//                   ) : (
//                     <div>
//                       {paper.discountPercent ? (
//                         <>
//                           <span className="text-xs line-through text-gray-300 block">₹{paper.price}</span>
//                           <span className="text-xs font-black text-[#0891b2]">₹{effP}</span>
//                         </>
//                       ) : (
//                         <span className="text-xs font-black text-[#0891b2]">₹{paper.price}</span>
//                       )}
//                     </div>
//                   )}
//                 </div>
//                 <div className="flex items-center gap-1 flex-shrink-0">
//                   <button onClick={() => setEditPaper(paper)}
//                     className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
//                     <Edit2 size={14} />
//                   </button>
//                   <button onClick={() => setDelPaper(paper)}
//                     className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {editPaper !== undefined && (
//         <PaperModal editPaper={editPaper} categories={categories} onClose={() => setEditPaper(undefined)}
//           onSaved={saved => { setPapers(ps => editPaper ? ps.map(p => p.id === saved.id ? saved : p) : [saved, ...ps]); }}
//           authFetch={authFetch} showToast={showToast} token={token} />
//       )}
//       {delPaper && (
//         <DeleteModal title="Delete Test Paper?" message={`"${delPaper.title}" will be permanently deleted.`}
//           onClose={() => setDelPaper(null)} onConfirm={handleDelete} loading={deleting} />
//       )}
//       {showCatMgr && (
//         <CategoryModal mode="papers" onClose={() => { setShowCatMgr(false); loadCats(); }}
//           authFetch={authFetch} showToast={showToast} />
//       )}
//     </div>
//   );
// }

// // ─── Coupons Tab ──────────────────────────────────────────────────────────────

// function CouponsTab({ authFetch, showToast }: {
//   authFetch: (url: string, init?: RequestInit) => Promise<Response>;
//   showToast: (msg: string, type?: "success" | "error") => void;
// }) {
//   const [coupons,    setCoupons]    = useState<Coupon[]>([]);
//   const [notes,      setNotes]      = useState<Note[]>([]);
//   const [papers,     setPapers]     = useState<TestPaper[]>([]);
//   const [loading,    setLoading]    = useState(true);
//   const [editCoupon, setEditCoupon] = useState<Coupon | null | undefined>(undefined);
//   const [delCoupon,  setDelCoupon]  = useState<Coupon | null>(null);
//   const [deleting,   setDeleting]   = useState(false);
//   const [scopeFilter,setScopeFilter]= useState("");
//   const [activeOnly, setActiveOnly] = useState(false);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const p = new URLSearchParams();
//       if (scopeFilter) p.set("scope",  scopeFilter);
//       if (activeOnly)  p.set("active", "true");
//       const [cr, nr, pr] = await Promise.all([
//         authFetch(`/api/admin/notes/coupons?${p}`),
//         authFetch("/api/admin/notes?limit=200"),
//         authFetch("/api/admin/notes/test-papers?limit=200"),
//       ]);
//       const [cd, nd, pd] = await Promise.all([cr.json(), nr.json(), pr.json()]);
//       setCoupons(cd.coupons || []);
//       setNotes(nd.notes || []);
//       setPapers(pd.papers || []);
//     } finally { setLoading(false); }
//   }, [authFetch, scopeFilter, activeOnly]);

//   useEffect(() => { load(); }, [load]);

//   const handleDelete = async () => {
//     if (!delCoupon) return;
//     setDeleting(true);
//     try {
//       const res = await authFetch(`/api/admin/notes/coupons/${delCoupon.id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error((await res.json()).error);
//       showToast("Coupon deleted.");
//       setDelCoupon(null);
//       load();
//     } catch (e: any) { showToast(e.message, "error"); }
//     finally { setDeleting(false); }
//   };

//   const toggleActive = async (c: Coupon) => {
//     try {
//       await authFetch(`/api/admin/notes/coupons/${c.id}`, {
//         method: "PATCH", body: JSON.stringify({ isActive: !c.isActive }),
//       });
//       load();
//     } catch {}
//   };

//   const scopeColor: Record<string, string> = {
//     global: "#5b4fcf", note: "#059669", test_paper: "#0891b2",
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <div>
//           <h2 className="text-lg font-black text-[#1a1a2e]">Coupons</h2>
//           <p className="text-xs text-gray-400 mt-0.5">{coupons.length} coupons total</p>
//         </div>
//         <button onClick={() => setEditCoupon(null)}
//           className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#d97706] to-[#b45309] text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity">
//           <Plus size={14} /> Create Coupon
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-2 items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
//         <select value={scopeFilter} onChange={e => setScopeFilter(e.target.value)}
//           className="px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 outline-none text-gray-600">
//           <option value="">All Scopes</option>
//           <option value="global">Global</option>
//           <option value="note">Note-specific</option>
//           <option value="test_paper">Paper-specific</option>
//         </select>
//         <label className="flex items-center gap-2 cursor-pointer px-3 py-2 border border-gray-100 rounded-lg bg-gray-50">
//           <input type="checkbox" checked={activeOnly} onChange={e => setActiveOnly(e.target.checked)}
//             className="accent-[#d97706]" />
//           <span className="text-sm font-medium text-gray-600">Active only</span>
//         </label>
//         <button onClick={load} className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
//           <RefreshCw size={14} />
//         </button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-[#d97706]" /></div>
//       ) : coupons.length === 0 ? (
//         <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
//           <TicketPercent size={32} className="mx-auto mb-3 opacity-30" />
//           <p className="font-semibold text-sm">No coupons yet</p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//           {coupons.map((c, i) => (
//             <div key={c.id}
//               className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${i < coupons.length - 1 ? "border-b border-gray-50" : ""}`}>
//               {/* Code */}
//               <div className="flex-shrink-0">
//                 <span className="font-mono text-sm font-black tracking-widest px-3 py-1.5 rounded-lg border-2"
//                   style={{ color: scopeColor[c.scope] ?? "#5b4fcf", borderColor: `${scopeColor[c.scope] ?? "#5b4fcf"}30`, background: `${scopeColor[c.scope] ?? "#5b4fcf"}08` }}>
//                   {c.code}
//                 </span>
//               </div>
//               {/* Info */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <span className="text-sm font-black text-[#1a1a2e]">{c.discountPercent}% off</span>
//                   <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
//                     style={{ background: `${scopeColor[c.scope]}18`, color: scopeColor[c.scope] }}>
//                     {c.scope === "global" ? "🌐 Global" : c.scope === "note" ? "📚 Note" : "📝 Paper"}
//                   </span>
//                   {c.note && <span className="text-[10px] text-gray-400 truncate max-w-[120px]">{c.note.title}</span>}
//                   {c.testPaper && <span className="text-[10px] text-gray-400 truncate max-w-[120px]">{c.testPaper.title}</span>}
//                 </div>
//                 <div className="flex items-center gap-3 mt-1">
//                   <span className="text-[10px] text-gray-400 font-medium">
//                     Used: {c.usedCount}{c.maxUses ? `/${c.maxUses}` : ""}
//                   </span>
//                   {c.expiresAt && (
//                     <span className="text-[10px] text-gray-400 font-medium">
//                       Expires: {fmtDate(c.expiresAt)}
//                     </span>
//                   )}
//                 </div>
//               </div>
//               {/* Toggle active */}
//               <button onClick={() => toggleActive(c)}
//                 className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
//                   ${c.isActive ? "bg-green-50 border-green-200 text-green-600 hover:bg-green-100" : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100"}`}>
//                 {c.isActive ? "Active" : "Inactive"}
//               </button>
//               {/* Actions */}
//               <div className="flex items-center gap-1 flex-shrink-0">
//                 <button onClick={() => setEditCoupon(c)}
//                   className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
//                   <Edit2 size={14} />
//                 </button>
//                 <button onClick={() => setDelCoupon(c)}
//                   className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
//                   <Trash2 size={14} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {editCoupon !== undefined && (
//         <CouponModal editCoupon={editCoupon} notes={notes} papers={papers}
//           onClose={() => setEditCoupon(undefined)}
//           onSaved={() => { load(); }}
//           authFetch={authFetch} showToast={showToast} />
//       )}
//       {delCoupon && (
//         <DeleteModal title="Delete Coupon?" message={`Coupon "${delCoupon.code}" will be permanently deleted.`}
//           onClose={() => setDelCoupon(null)} onConfirm={handleDelete} loading={deleting} />
//       )}
//     </div>
//   );
// }

// // ─── Purchases Tab ────────────────────────────────────────────────────────────

// function PurchasesTab({ authFetch }: {
//   authFetch: (url: string, init?: RequestInit) => Promise<Response>;
// }) {
//   const [purchases,   setPurchases]  = useState<Purchase[]>([]);
//   const [loading,     setLoading]    = useState(true);
//   const [search,      setSearch]     = useState("");
//   const [typeFilter,  setTypeFilter] = useState("");
//   const [page,        setPage]       = useState(1);
//   const [total,       setTotal]      = useState(0);
//   const LIMIT = 50;

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const p = new URLSearchParams();
//       if (search)     p.set("search", search);
//       if (typeFilter) p.set("type",   typeFilter);
//       p.set("page",  String(page));
//       p.set("limit", String(LIMIT));
//       const res = await authFetch(`/api/admin/notes/purchases?${p}`);
//       const d   = await res.json();
//       setPurchases(d.purchases || []);
//       setTotal(d.total || 0);
//     } finally { setLoading(false); }
//   }, [authFetch, search, typeFilter, page]);

//   useEffect(() => { load(); }, [load]);

//   const totalRevenue   = purchases.reduce((s, p) => s + p.finalPrice, 0);
//   const totalDiscount  = purchases.reduce((s, p) => s + p.discountApplied, 0);
//   const freeCount      = purchases.filter(p => p.finalPrice === 0).length;
//   const uniqueUsers    = new Set(purchases.map(p => p.userId)).size;

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <div>
//           <h2 className="text-lg font-black text-[#1a1a2e]">Purchases & Access</h2>
//           <p className="text-xs text-gray-400 mt-0.5">{total} total purchases</p>
//         </div>
//         <button onClick={load} className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:bg-gray-50 transition-colors">
//           <RefreshCw size={15} />
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//         <StatCard icon={ShoppingBag}   label="Total Purchases" value={total}                               color="#5b4fcf" />
//         <StatCard icon={DollarSign}    label="Revenue"         value={`₹${totalRevenue.toLocaleString("en-IN")}`}  color="#059669" />
//         <StatCard icon={Users}         label="Unique Buyers"   value={uniqueUsers}                         color="#0891b2" />
//         <StatCard icon={Percent}       label="Discount Saved"  value={`₹${totalDiscount.toLocaleString("en-IN")}`} color="#d97706" />
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-2 items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
//         <div className="relative flex-1 min-w-[200px]">
//           <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by user, email or item…"
//             className="w-full pl-8 pr-3 py-2 border border-gray-100 rounded-lg text-sm outline-none focus:border-[#5b4fcf]/40 bg-gray-50" />
//         </div>
//         <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
//           className="px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 outline-none text-gray-600">
//           <option value="">All Types</option>
//           <option value="note">Notes Only</option>
//           <option value="paper">Papers Only</option>
//         </select>
//         {(search || typeFilter) && (
//           <button onClick={() => { setSearch(""); setTypeFilter(""); }}
//             className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
//             <X size={13} /> Clear
//           </button>
//         )}
//       </div>

//       {/* Table */}
//       {loading ? (
//         <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-[#5b4fcf]" /></div>
//       ) : purchases.length === 0 ? (
//         <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
//           <ShoppingBag size={32} className="mx-auto mb-3 opacity-30" />
//           <p className="font-semibold text-sm">No purchases found</p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="border-b border-gray-100">
//                   {["User", "Item", "Type", "Original", "Discount", "Paid", "Coupon", "Date"].map(h => (
//                     <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {purchases.map((p, i) => (
//                   <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${i < purchases.length - 1 ? "border-b border-gray-50" : ""}`}>
//                     <td className="px-4 py-3">
//                       <p className="text-sm font-bold text-[#1a1a2e]">{p.user.name ?? p.user.email}</p>
//                       <p className="text-xs text-gray-400">{p.user.email}</p>
//                     </td>
//                     <td className="px-4 py-3 max-w-[180px]">
//                       <p className="text-sm font-medium text-[#1a1a2e] truncate">
//                         {p.note?.title ?? p.testPaper?.title ?? "—"}
//                       </p>
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className={`text-[10px] font-bold px-2 py-1 rounded-full
//                         ${p.noteId ? "bg-[#5b4fcf]/10 text-[#5b4fcf]" : "bg-[#0891b2]/10 text-[#0891b2]"}`}>
//                         {p.noteId ? "📚 Note" : "📝 Paper"}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-sm font-medium text-gray-500">
//                       {p.originalPrice === 0 ? "Free" : `₹${p.originalPrice}`}
//                     </td>
//                     <td className="px-4 py-3">
//                       {p.discountApplied > 0
//                         ? <span className="text-xs font-bold text-green-600">-₹{p.discountApplied}</span>
//                         : <span className="text-gray-300 text-xs">—</span>}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className={`text-sm font-black ${p.finalPrice === 0 ? "text-green-600" : "text-[#1a1a2e]"}`}>
//                         {p.finalPrice === 0 ? "Free" : `₹${p.finalPrice}`}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       {p.coupon
//                         ? <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200">{p.coupon.code}</span>
//                         : <span className="text-gray-300 text-xs">—</span>}
//                     </td>
//                     <td className="px-4 py-3 text-xs text-gray-400 font-medium whitespace-nowrap">{fmtDate(p.purchasedAt)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {total > LIMIT && (
//             <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
//               <span className="text-xs text-gray-400 font-medium">
//                 Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}
//               </span>
//               <div className="flex items-center gap-2">
//                 <button onClick={() => setPage(v => Math.max(1, v - 1))} disabled={page === 1}
//                   className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">
//                   ← Prev
//                 </button>
//                 <button onClick={() => setPage(v => v + 1)} disabled={page * LIMIT >= total}
//                   className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">
//                   Next →
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Main ─────────────────────────────────────────────────────────────────────

// export default function NotesLibraryAdmin() {
//   const { token } = useAuth();
//   const [tab,   setTab]   = useState<Tab>("notes");
//   const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

//   const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 4000);
//   }, []);

//   const authFetch = useCallback((url: string, init: RequestInit = {}) => {
//     const headers: Record<string, string> = { "Content-Type": "application/json" };
//     if (token) headers["Authorization"] = `Bearer ${token}`;
//     // Don't set Content-Type for FormData (let browser set boundary)
//     if (init.body instanceof FormData) delete headers["Content-Type"];
//     return fetch(url, { ...init, headers: { ...headers, ...(init.headers ?? {}) } });
//   }, [token]);

//   const TABS: { id: Tab; label: string; icon: any; color: string }[] = [
//     { id: "notes",     label: "Notes",     icon: BookOpen,    color: "#5b4fcf" },
//     { id: "papers",    label: "Test Papers",icon: FileText,    color: "#0891b2" },
//     { id: "coupons",   label: "Coupons",    icon: TicketPercent,color: "#d97706" },
//     { id: "purchases", label: "Purchases",  icon: ShoppingBag, color: "#059669" },
//   ];

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
//       {toast && <Toast msg={toast.msg} type={toast.type} />}

//       {/* Page header */}
//       <div>
//         <h1 className="text-2xl font-black text-[#1a1a2e] tracking-tight">📖 Content Library</h1>
//         <p className="text-sm text-gray-400 mt-0.5">Manage notes, test papers, coupons and track purchases</p>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 w-fit shadow-sm">
//         {TABS.map(t => {
//           const Icon = t.icon;
//           const active = tab === t.id;
//           return (
//             <button key={t.id} onClick={() => setTab(t.id)}
//               className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all
//                 ${active ? "text-white shadow-md" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
//               style={active ? { background: `linear-gradient(135deg, ${t.color}, ${t.color}cc)` } : {}}>
//               <Icon size={14} />
//               {t.label}
//             </button>
//           );
//         })}
//       </div>

//       {/* Tab content */}
//       {tab === "notes"     && <NotesTab     authFetch={authFetch} showToast={showToast} token={token} />}
//       {tab === "papers"    && <PapersTab    authFetch={authFetch} showToast={showToast} token={token} />}
//       {tab === "coupons"   && <CouponsTab   authFetch={authFetch} showToast={showToast} />}
//       {tab === "purchases" && <PurchasesTab authFetch={authFetch} />}
//     </div>
//   );
// }












"use client";

import {
  useState, useCallback, useRef, useEffect,
} from "react";
import {
  BookOpen, FileText, ShoppingBag, Tag, Plus, Search,
  Edit2, Trash2, X, Check, Loader2, AlertCircle,
  CheckCircle2, Eye, Percent, RefreshCw, TicketPercent, FolderOpen,
  Upload, Download, Users, DollarSign, TrendingUp, Package,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NoteCategory    { id: string; name: string; description: string; _count: { notes: number } }
interface PaperCategory   { id: string; name: string; description: string; _count: { papers: number } }

interface Note {
  id: string; serialId: number; title: string; label: string;
  categoryId: string | null; price: number; discountPercent: number | null;
  demoUrl: string | null; demoPath: string | null;
  realUrl: string | null; realPath: string | null;
  createdAt: string;
  category: { id: string; name: string } | null;
  _count: { purchases: number };
}

interface TestPaper {
  id: string; serialId: number; title: string; label: string;
  categoryId: string | null; price: number; discountPercent: number | null;
  demoUrl: string | null; demoPath: string | null;
  realUrl: string | null; realPath: string | null;
  fileUrl?: string; filePath?: string;
  createdAt: string;
  category: { id: string; name: string } | null;
  _count: { purchases: number };
}

interface Coupon {
  id: string; code: string; discountPercent: number;
  scope: "global" | "note" | "test_paper";
  noteId: string | null; testPaperId: string | null;
  maxUses: number | null; usedCount: number;
  expiresAt: string | null; isActive: boolean; createdAt: string;
  note: { id: string; title: string } | null;
  testPaper: { id: string; title: string } | null;
  _count: { purchases: number };
}

interface Purchase {
  id: string; userId: string; noteId: string | null; testPaperId: string | null;
  couponId: string | null; originalPrice: number; finalPrice: number;
  discountApplied: number; purchasedAt: string;
  user: { id: string; name: string | null; email: string };
  note: { id: string; title: string } | null;
  testPaper: { id: string; title: string } | null;
  coupon: { id: string; code: string } | null;
}

type Tab = "notes" | "papers" | "coupons" | "purchases";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function effectivePrice(price: number, discount: number | null) {
  if (!discount) return price;
  return Math.round(price * (1 - discount / 100));
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold border
      ${type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
      {type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
      {msg}
    </div>
  );
}

// ─── PDF Preview Modal ────────────────────────────────────────────────────────

function PdfPreviewModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden"
        style={{ height: "calc(100vh - 80px)" }}
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg">📄</span>
            <span className="font-bold text-sm text-gray-800 truncate">{title}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5b4fcf] text-white text-xs font-bold rounded-lg hover:opacity-90">
              <Eye size={12} /> Open in Tab
            </a>
            <a href={url} download
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:opacity-90">
              <Download size={12} /> Download
            </a>
            <button onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500">
              <X size={16} />
            </button>
          </div>
        </div>
        {/* PDF iframe */}
        <div className="flex-1 bg-gray-600">
          <iframe src={url} className="w-full h-full border-0" title={title} />
        </div>
      </div>
    </div>
  );
}

// ─── Upload Zone with XHR Progress ───────────────────────────────────────────

interface UploadZoneProps {
  label: string;
  accept: string;
  file: File | null;
  existingUrl: string | null;
  uploadedUrl: string | null;  // after successful XHR upload
  progress: number | null;
  uploading: boolean;
  onFile: (f: File) => void;
  onRemove: () => void;
  color?: string;
}

function UploadZone({
  label, accept, file, existingUrl, uploadedUrl,
  progress, uploading, onFile, onRemove, color = "#5b4fcf",
}: UploadZoneProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [previewing, setPreviewing] = useState(false);

  const displayUrl = uploadedUrl ?? existingUrl;
  const hasContent = !!file || !!displayUrl;
  const displayName = file ? file.name : "Existing PDF";

  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>{label}</span>

      {/* Uploading progress */}
      {uploading && (
        <div className="rounded-xl border-2 p-3 space-y-2" style={{ borderColor: `${color}40`, background: `${color}06` }}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
              <Loader2 size={11} className="animate-spin" style={{ color }} />
              Uploading…
            </span>
            <span className="text-xs font-black" style={{ color }}>{progress ?? 0}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{ width: `${progress ?? 0}%`, background: `linear-gradient(90deg, ${color}, ${color}bb)` }}
            />
          </div>
        </div>
      )}

      {/* Uploaded / existing file */}
      {!uploading && hasContent && (
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl border-2 border-green-300 bg-green-50 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span>📄</span>
            <span className="text-xs font-semibold text-green-700 truncate">{displayName}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {displayUrl && (
              <>
                <button
                  onClick={() => setPreviewing(true)}
                  title="Preview PDF"
                  className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                  <Eye size={12} />
                </button>
                <a
                  href={displayUrl}
                  download
                  title="Download PDF"
                  className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                  <Download size={12} />
                </a>
              </>
            )}
            <button
              onClick={onRemove}
              title="Remove"
              className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Upload button */}
      {!uploading && !hasContent && (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="flex flex-col items-center justify-center gap-1 px-3 py-4 rounded-xl border-2 border-dashed transition-all text-gray-400"
          style={{ borderColor: `${color}40` }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = color;
            (e.currentTarget as HTMLElement).style.color = color;
            (e.currentTarget as HTMLElement).style.background = `${color}06`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
            (e.currentTarget as HTMLElement).style.color = "";
            (e.currentTarget as HTMLElement).style.background = "";
          }}
        >
          <Upload size={16} />
          <span className="text-xs font-semibold">Upload {label}</span>
        </button>
      )}

      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} />

      {previewing && displayUrl && (
        <PdfPreviewModal url={displayUrl} title={`${label} — ${displayName}`} onClose={() => setPreviewing(false)} />
      )}
    </div>
  );
}

// ─── useXhrUpload hook ────────────────────────────────────────────────────────

function useXhrUpload(token: string | null, bucket: string) {
  const [file,       setFile]       = useState<File | null>(null);
  const [uploading,  setUploading]  = useState(false);
  const [progress,   setProgress]   = useState<number | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [error,      setError]      = useState<string | null>(null);

  const upload = useCallback((f: File, folder: string): Promise<{ url: string; path: string }> => {
    return new Promise((resolve, reject) => {
      setFile(f);
      setUploading(true);
      setProgress(0);
      setError(null);
      setUploadedUrl(null);
      setUploadedPath(null);

      const ext      = f.name.split(".").pop();
      const path     = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const formData = new FormData();
      formData.append("file",   f);
      formData.append("bucket", bucket);
      formData.append("path",   path);

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      });
      xhr.addEventListener("load", () => {
        setUploading(false);
        setProgress(null);
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadedUrl(data.url);
            setUploadedPath(path);
            resolve({ url: data.url, path });
          } else {
            const msg = data.error ?? "Upload failed";
            setError(msg);
            reject(new Error(msg));
          }
        } catch {
          const msg = "Invalid server response";
          setError(msg);
          reject(new Error(msg));
        }
      });
      xhr.addEventListener("error", () => {
        setUploading(false);
        setProgress(null);
        const msg = "Network error during upload";
        setError(msg);
        reject(new Error(msg));
      });
      xhr.open("POST", "/api/admin/notes/upload-pdf");
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(formData);
    });
  }, [token, bucket]);

  const reset = useCallback(() => {
    setFile(null);
    setUploading(false);
    setProgress(null);
    setUploadedUrl(null);
    setUploadedPath(null);
    setError(null);
  }, []);

  return { file, uploading, progress, uploadedUrl, uploadedPath, error, upload, reset, setFile };
}

// ─── FormField ────────────────────────────────────────────────────────────────

function FF({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</label>
      {children}
    </div>
  );
}

const inputCls  = "w-full px-3 py-2.5 border-2 border-gray-100 rounded-xl text-sm font-medium text-[#1a1a2e] bg-white outline-none focus:border-[#5b4fcf]/40 focus:ring-2 focus:ring-[#5b4fcf]/10 transition-all";
const selectCls = inputCls + " cursor-pointer";

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-xl font-black text-[#1a1a2e]">{value}</p>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteModal({ title, message, onClose, onConfirm, loading }: {
  title: string; message: string; onClose: () => void; onConfirm: () => void; loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <h3 className="font-black text-[#1a1a2e] text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onConfirm} disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl disabled:opacity-60 transition-colors">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
          </button>
          <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Category Manager Modal ───────────────────────────────────────────────────

function CategoryModal({
  mode, onClose, authFetch, showToast,
}: {
  mode: "notes" | "papers"; onClose: () => void;
  authFetch: (url: string, init?: RequestInit) => Promise<Response>;
  showToast: (msg: string, type?: "success" | "error") => void;
}) {
  const [cats, setCats]       = useState<(NoteCategory | PaperCategory)[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName]       = useState("");
  const [desc, setDesc]       = useState("");
  const [editId, setEditId]   = useState<string | null>(null);
  const [saving, setSaving]   = useState(false);
  const [delId, setDelId]     = useState<string | null>(null);

  const base = mode === "notes" ? "/api/admin/notes/note-categories" : "/api/admin/notes/test-papers/test-paper-categories";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch(base);
      const d   = await res.json();
      setCats(d.categories || []);
    } finally { setLoading(false); }
  }, [base, authFetch]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const url    = editId ? `${base}/${editId}` : base;
      const method = editId ? "PATCH" : "POST";
      const res    = await authFetch(url, {
        method, body: JSON.stringify({ name: name.trim(), description: desc.trim() }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(editId ? "Category updated!" : "Category created!");
      setName(""); setDesc(""); setEditId(null);
      load();
    } catch (e: any) { showToast(e.message, "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setDelId(id);
    try {
      const res = await authFetch(`${base}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast("Category deleted.");
      load();
    } catch (e: any) { showToast(e.message, "error"); }
    finally { setDelId(null); }
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-[#5b4fcf] to-[#7c3aed] rounded-xl flex items-center justify-center">
              <FolderOpen size={15} className="text-white" />
            </div>
            <h2 className="font-black text-[#1a1a2e]">{mode === "notes" ? "Note" : "Test Paper"} Categories</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={17} /></button>
        </div>

        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">{editId ? "Edit Category" : "New Category"}</p>
          <div className="flex gap-2 mb-2">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Category name…" className={inputCls + " flex-1"} />
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description (optional)" className={inputCls + " flex-[2]"} />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving || !name.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#5b4fcf] hover:bg-[#7c3aed] text-white text-xs font-bold rounded-lg disabled:opacity-50 transition-colors">
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              {editId ? "Save Changes" : "Add"}
            </button>
            {editId && (
              <button onClick={() => { setEditId(null); setName(""); setDesc(""); }}
                className="px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 size={22} className="animate-spin text-[#5b4fcf]" /></div>
          ) : cats.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No categories yet.</div>
          ) : cats.map(c => (
            <div key={c.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl">
              <FolderOpen size={15} className="text-[#5b4fcf] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#1a1a2e]">{c.name}</p>
                {c.description && <p className="text-xs text-gray-400 truncate">{c.description}</p>}
              </div>
              <span className="text-xs text-gray-400 font-medium flex-shrink-0">
                {"_count" in c ? (c._count as any).notes ?? (c._count as any).papers ?? 0 : 0} items
              </span>
              <button onClick={() => { setEditId(c.id); setName(c.name); setDesc(c.description); }}
                className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                <Edit2 size={13} />
              </button>
              <button onClick={() => handleDelete(c.id)} disabled={delId === c.id}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                {delId === c.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Note Modal ───────────────────────────────────────────────────────────────

function NoteModal({
  editNote, categories, nextSerial, onClose, onSaved, authFetch, showToast, token,
}: {
  editNote: Note | null; categories: NoteCategory[]; nextSerial: number;
  onClose: () => void; onSaved: (n: Note) => void;
  authFetch: (url: string, init?: RequestInit) => Promise<Response>;
  showToast: (msg: string, type?: "success" | "error") => void;
  token: string | null;
}) {
  const isEdit = !!editNote;

  const [title,    setTitle]    = useState(editNote?.title    ?? "");
  const [label,    setLabel]    = useState(editNote?.label    ?? "");
  const [serialId, setSerialId] = useState<number>(editNote?.serialId ?? nextSerial);
  const [catId,    setCatId]    = useState(editNote?.categoryId ?? "");
  const [price,    setPrice]    = useState<number>(editNote?.price ?? 0);
  const [discount, setDiscount] = useState<number | "">(editNote?.discountPercent ?? "");

  const [keepDemo, setKeepDemo] = useState(!!editNote?.demoUrl);
  const [keepReal, setKeepReal] = useState(!!editNote?.realUrl);

  const demo = useXhrUpload(token, "notes-pdfs");
  const real = useXhrUpload(token, "notes-pdfs");

  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const handleDemoFile = (f: File) => {
    setKeepDemo(false);
    demo.upload(f, "demo").catch(() => {});
  };
  const handleRealFile = (f: File) => {
    setKeepReal(false);
    real.upload(f, "real").catch(() => {});
  };

  const handleSave = async () => {
    setError("");
    if (!title.trim()) return setError("Title is required.");

    const hasDemoFinal = keepDemo || !!demo.uploadedUrl;
    const hasRealFinal = keepReal || !!real.uploadedUrl;
    if (!hasDemoFinal && !hasRealFinal) return setError("Upload at least one PDF (Demo or Real).");
    if (demo.uploading || real.uploading) return setError("Please wait for uploads to complete.");

    setSaving(true);
    try {
      const demoUrl  = keepDemo ? (editNote?.demoUrl  ?? null) : (demo.uploadedUrl  ?? null);
      const demoPath = keepDemo ? (editNote?.demoPath ?? null) : (demo.uploadedPath ?? null);
      const realUrl  = keepReal ? (editNote?.realUrl  ?? null) : (real.uploadedUrl  ?? null);
      const realPath = keepReal ? (editNote?.realPath ?? null) : (real.uploadedPath ?? null);

      const body: Record<string, any> = {
        serialId, title: title.trim(), label: label.trim(),
        categoryId: catId || null, price,
        discountPercent: discount !== "" ? Number(discount) : null,
        demoUrl, demoPath, realUrl, realPath,
      };
      if (isEdit) {
        body.removeDemo = !keepDemo && !demo.uploadedUrl;
        body.removeReal = !keepReal && !real.uploadedUrl;
      }

      const url    = isEdit ? `/api/admin/notes/${editNote!.id}` : "/api/admin/notes";
      const method = isEdit ? "PATCH" : "POST";
      const res    = await authFetch(url, { method, body: JSON.stringify(body) });
      const d      = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed");
      showToast(isEdit ? "Note updated!" : "Note created!");
      onSaved(d.note);
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally { setSaving(false); }
  };

  const effPrice = typeof discount === "number" && discount > 0 ? effectivePrice(price, discount) : price;

  return (
    <div className="fixed inset-0 z-[9990] flex justify-center overflow-y-auto p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl h-fit mt-12 mb-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-[#5b4fcf] to-[#7c3aed] rounded-xl flex items-center justify-center">
              <BookOpen size={15} className="text-white" />
            </div>
            <h2 className="font-black text-[#1a1a2e]">{isEdit ? "Edit Note" : "Add Note"}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={17} /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <FF label="Serial # (auto)">
              <input type="number" min={1} value={serialId} onChange={e => setSerialId(+e.target.value)} className={inputCls} />
            </FF>
            <div className="col-span-3">
              <FF label="Title *">
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Abacus Level 1 – Unit 2" className={inputCls} />
              </FF>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FF label="Label / Tag">
              <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Week 3, Advanced" className={inputCls} />
            </FF>
            <FF label="Category">
              <select value={catId} onChange={e => setCatId(e.target.value)} className={selectCls}>
                <option value="">— None —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </FF>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pricing</p>
            <div className="grid grid-cols-2 gap-3">
              <FF label="Price ₹ (0 = Free)">
                <input type="number" min={0} value={price} onChange={e => setPrice(+e.target.value)} className={inputCls} />
              </FF>
              <FF label="Discount % (optional)">
                <input type="number" min={1} max={100} value={discount}
                  onChange={e => setDiscount(e.target.value === "" ? "" : +e.target.value)}
                  placeholder="e.g. 20" className={inputCls} />
              </FF>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {price === 0 ? (
                <span className="text-green-600 font-bold">🆓 Free</span>
              ) : (
                <>
                  <span className="font-bold text-[#5b4fcf]">₹{price}</span>
                  {typeof discount === "number" && discount > 0 && (
                    <>
                      <span className="text-gray-300">→</span>
                      <span className="font-black text-green-600">₹{effPrice}</span>
                      <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">{discount}% off</span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* PDF Uploads */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">PDF Files — at least one required</p>
            <div className="grid grid-cols-2 gap-3">
              <UploadZone
                label="Demo Version (preview)"
                accept="application/pdf"
                file={demo.file}
                existingUrl={keepDemo ? (editNote?.demoUrl ?? null) : null}
                uploadedUrl={demo.uploadedUrl}
                progress={demo.progress}
                uploading={demo.uploading}
                onFile={handleDemoFile}
                onRemove={() => { demo.reset(); setKeepDemo(false); }}
                color="#2563eb"
              />
              <UploadZone
                label="Real Version (full)"
                accept="application/pdf"
                file={real.file}
                existingUrl={keepReal ? (editNote?.realUrl ?? null) : null}
                uploadedUrl={real.uploadedUrl}
                progress={real.progress}
                uploading={real.uploading}
                onFile={handleRealFile}
                onRemove={() => { real.reset(); setKeepReal(false); }}
                color="#059669"
              />
            </div>
            {(demo.error || real.error) && (
              <div className="text-xs text-red-600 font-semibold">
                {demo.error && <p>Demo: {demo.error}</p>}
                {real.error && <p>Real: {real.error}</p>}
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-semibold">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving || demo.uploading || real.uploading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5b4fcf] to-[#7c3aed] text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {isEdit ? "Save Changes" : "Create Note"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Paper Modal (now with Demo + Real like Notes) ────────────────────────────

function PaperModal({
  editPaper, categories, nextSerial, onClose, onSaved, authFetch, showToast, token,
}: {
  editPaper: TestPaper | null; categories: PaperCategory[]; nextSerial: number;
  onClose: () => void; onSaved: (p: TestPaper) => void;
  authFetch: (url: string, init?: RequestInit) => Promise<Response>;
  showToast: (msg: string, type?: "success" | "error") => void;
  token: string | null;
}) {
  const isEdit = !!editPaper;

  const [title,    setTitle]    = useState(editPaper?.title    ?? "");
  const [label,    setLabel]    = useState(editPaper?.label    ?? "");
  const [serialId, setSerialId] = useState<number>(editPaper?.serialId ?? nextSerial);
  const [catId,    setCatId]    = useState(editPaper?.categoryId ?? "");
  const [price,    setPrice]    = useState<number>(editPaper?.price ?? 0);
  const [discount, setDiscount] = useState<number | "">(editPaper?.discountPercent ?? "");

  const [keepDemo, setKeepDemo] = useState(!!editPaper?.demoUrl);
  const [keepReal, setKeepReal] = useState(!!(editPaper?.realUrl || editPaper?.fileUrl));

  const demo = useXhrUpload(token, "test-papers");
  const real = useXhrUpload(token, "test-papers");

  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const handleDemoFile = (f: File) => {
    setKeepDemo(false);
    demo.upload(f, "demo").catch(() => {});
  };
  const handleRealFile = (f: File) => {
    setKeepReal(false);
    real.upload(f, "real").catch(() => {});
  };

  const handleSave = async () => {
    setError("");
    if (!title.trim()) return setError("Title is required.");

    const hasDemoFinal = keepDemo || !!demo.uploadedUrl;
    const hasRealFinal = keepReal || !!real.uploadedUrl;
    if (!hasDemoFinal && !hasRealFinal) return setError("Upload at least one PDF (Demo or Real).");
    if (demo.uploading || real.uploading) return setError("Please wait for uploads to complete.");

    setSaving(true);
    try {
      const demoUrl  = keepDemo ? (editPaper?.demoUrl  ?? null) : (demo.uploadedUrl  ?? null);
      const demoPath = keepDemo ? (editPaper?.demoPath ?? null) : (demo.uploadedPath ?? null);
      // Real: prefer new realUrl/realPath; fall back to legacy fileUrl for edit
      const realUrl  = keepReal ? (editPaper?.realUrl ?? editPaper?.fileUrl ?? null) : (real.uploadedUrl  ?? null);
      const realPath = keepReal ? (editPaper?.realPath ?? editPaper?.filePath ?? null) : (real.uploadedPath ?? null);

      const body: Record<string, any> = {
        serialId, title: title.trim(), label: label.trim(),
        categoryId: catId || null, price,
        discountPercent: discount !== "" ? Number(discount) : null,
        demoUrl, demoPath, realUrl, realPath,
        // Also set fileUrl/filePath for backward compat
        fileUrl:  realUrl,
        filePath: realPath,
      };
      if (isEdit) {
        body.removeDemo = !keepDemo && !demo.uploadedUrl;
        body.removeReal = !keepReal && !real.uploadedUrl;
      }

      const url    = isEdit ? `/api/admin/notes/test-papers/${editPaper!.id}` : "/api/admin/notes/test-papers";
      const method = isEdit ? "PATCH" : "POST";
      const res    = await authFetch(url, { method, body: JSON.stringify(body) });
      const d      = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed");
      showToast(isEdit ? "Test paper updated!" : "Test paper created!");
      onSaved(d.paper);
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally { setSaving(false); }
  };

  const effPrice = typeof discount === "number" && discount > 0 ? effectivePrice(price, discount) : price;

  return (
    <div className="fixed inset-0 z-[9990] flex justify-center overflow-y-auto p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl h-fit mt-12 mb-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0891b2] to-[#0e7490] rounded-xl flex items-center justify-center">
              <FileText size={15} className="text-white" />
            </div>
            <h2 className="font-black text-[#1a1a2e]">{isEdit ? "Edit Test Paper" : "Add Test Paper"}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={17} /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <FF label="Serial # (auto)">
              <input type="number" min={1} value={serialId} onChange={e => setSerialId(+e.target.value)} className={inputCls} />
            </FF>
            <div className="col-span-3">
              <FF label="Title *">
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. SOF Olympiad 2024" className={inputCls} />
              </FF>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FF label="Label / Tag">
              <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Class 3–5" className={inputCls} />
            </FF>
            <FF label="Category">
              <select value={catId} onChange={e => setCatId(e.target.value)} className={selectCls}>
                <option value="">— None —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </FF>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pricing</p>
            <div className="grid grid-cols-2 gap-3">
              <FF label="Price ₹ (0 = Free)">
                <input type="number" min={0} value={price} onChange={e => setPrice(+e.target.value)} className={inputCls} />
              </FF>
              <FF label="Discount % (optional)">
                <input type="number" min={1} max={100} value={discount}
                  onChange={e => setDiscount(e.target.value === "" ? "" : +e.target.value)}
                  placeholder="e.g. 15" className={inputCls} />
              </FF>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {price === 0 ? (
                <span className="text-green-600 font-bold">🆓 Free</span>
              ) : (
                <>
                  <span className="font-bold text-[#0891b2]">₹{price}</span>
                  {typeof discount === "number" && discount > 0 && (
                    <>
                      <span className="text-gray-300">→</span>
                      <span className="font-black text-green-600">₹{effPrice}</span>
                      <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">{discount}% off</span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* PDF Uploads — same as notes now */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">PDF Files — at least one required</p>
            <div className="grid grid-cols-2 gap-3">
              <UploadZone
                label="Demo Version (preview)"
                accept="application/pdf"
                file={demo.file}
                existingUrl={keepDemo ? (editPaper?.demoUrl ?? null) : null}
                uploadedUrl={demo.uploadedUrl}
                progress={demo.progress}
                uploading={demo.uploading}
                onFile={handleDemoFile}
                onRemove={() => { demo.reset(); setKeepDemo(false); }}
                color="#2563eb"
              />
              <UploadZone
                label="Real Version (full)"
                accept="application/pdf"
                file={real.file}
                existingUrl={keepReal ? (editPaper?.realUrl ?? editPaper?.fileUrl ?? null) : null}
                uploadedUrl={real.uploadedUrl}
                progress={real.progress}
                uploading={real.uploading}
                onFile={handleRealFile}
                onRemove={() => { real.reset(); setKeepReal(false); }}
                color="#059669"
              />
            </div>
            {(demo.error || real.error) && (
              <div className="text-xs text-red-600 font-semibold">
                {demo.error && <p>Demo: {demo.error}</p>}
                {real.error && <p>Real: {real.error}</p>}
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-semibold">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving || demo.uploading || real.uploading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0891b2] to-[#0e7490] text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {isEdit ? "Save Changes" : "Add Test Paper"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Coupon Modal ─────────────────────────────────────────────────────────────

function CouponModal({
  editCoupon, notes, papers, onClose, onSaved, authFetch, showToast,
}: {
  editCoupon: Coupon | null;
  notes: Note[]; papers: TestPaper[];
  onClose: () => void; onSaved: (c: Coupon) => void;
  authFetch: (url: string, init?: RequestInit) => Promise<Response>;
  showToast: (msg: string, type?: "success" | "error") => void;
}) {
  const isEdit = !!editCoupon;
  const [code,      setCode]      = useState(editCoupon?.code             ?? "");
  const [discount,  setDiscount]  = useState<number>(editCoupon?.discountPercent ?? 10);
  const [scope,     setScope]     = useState<"global"|"note"|"test_paper">(editCoupon?.scope ?? "global");
  const [noteId,    setNoteId]    = useState(editCoupon?.noteId       ?? "");
  const [paperId,   setPaperId]   = useState(editCoupon?.testPaperId  ?? "");
  const [maxUses,   setMaxUses]   = useState<number | "">(editCoupon?.maxUses ?? "");
  const [expiresAt, setExpiresAt] = useState(editCoupon?.expiresAt ? editCoupon.expiresAt.slice(0, 10) : "");
  const [isActive,  setIsActive]  = useState(editCoupon?.isActive    ?? true);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState("");

  const handleSave = async () => {
    setError("");
    if (!code.trim())                   return setError("Code is required.");
    if (discount < 1 || discount > 100) return setError("Discount must be 1–100.");
    if (scope === "note" && !noteId)    return setError("Select a note for this coupon.");
    if (scope === "test_paper" && !paperId) return setError("Select a test paper.");
    setSaving(true);
    try {
      const body = {
        code: code.trim().toUpperCase(), discountPercent: discount, scope,
        noteId: scope === "note" ? noteId : null,
        testPaperId: scope === "test_paper" ? paperId : null,
        maxUses: maxUses !== "" ? Number(maxUses) : null,
        expiresAt: expiresAt || null, isActive,
      };
      const url    = isEdit ? `/api/admin/notes/coupons/${editCoupon!.id}` : "/api/admin/notes/coupons";
      const method = isEdit ? "PATCH" : "POST";
      const res    = await authFetch(url, { method, body: JSON.stringify(body) });
      const d      = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed");
      showToast(isEdit ? "Coupon updated!" : "Coupon created!");
      onSaved(d.coupon);
      onClose();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[9990] flex justify-center overflow-y-auto p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-fit mt-12 mb-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-[#d97706] to-[#b45309] rounded-xl flex items-center justify-center">
              <TicketPercent size={15} className="text-white" />
            </div>
            <h2 className="font-black text-[#1a1a2e]">{isEdit ? "Edit Coupon" : "Create Coupon"}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={17} /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FF label="Coupon Code *">
              <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. SAVE50"
                className={inputCls + " uppercase font-mono tracking-widest"} disabled={isEdit} />
            </FF>
            <FF label="Discount %">
              <input type="number" min={1} max={100} value={discount}
                onChange={e => setDiscount(+e.target.value)} className={inputCls} />
            </FF>
          </div>

          <FF label="Scope — what does this coupon apply to?">
            <div className="grid grid-cols-3 gap-2">
              {(["global", "note", "test_paper"] as const).map(s => (
                <button key={s} type="button" onClick={() => !isEdit && setScope(s)}
                  className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all
                    ${scope === s ? "border-[#d97706] bg-[#d97706]/10 text-[#b45309]" : "border-gray-100 text-gray-400 hover:border-gray-200"}
                    ${isEdit ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}>
                  {s === "global" ? "🌐 Global" : s === "note" ? "📚 Note" : "📝 Paper"}
                </button>
              ))}
            </div>
            {isEdit && <p className="text-[10px] text-gray-400 mt-1">Scope cannot be changed after creation.</p>}
          </FF>

          {scope === "note" && (
            <FF label="Specific Note">
              <select value={noteId} onChange={e => setNoteId(e.target.value)} className={selectCls} disabled={isEdit}>
                <option value="">— Select Note —</option>
                {notes.map(n => <option key={n.id} value={n.id}>#{n.serialId} {n.title}</option>)}
              </select>
            </FF>
          )}

          {scope === "test_paper" && (
            <FF label="Specific Test Paper">
              <select value={paperId} onChange={e => setPaperId(e.target.value)} className={selectCls} disabled={isEdit}>
                <option value="">— Select Paper —</option>
                {papers.map(p => <option key={p.id} value={p.id}>#{p.serialId} {p.title}</option>)}
              </select>
            </FF>
          )}

          <div className="grid grid-cols-2 gap-3">
            <FF label="Max Uses (blank = unlimited)">
              <input type="number" min={1} value={maxUses}
                onChange={e => setMaxUses(e.target.value === "" ? "" : +e.target.value)}
                placeholder="Unlimited" className={inputCls} />
            </FF>
            <FF label="Expires At (optional)">
              <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className={inputCls} />
            </FF>
          </div>

          {/* Active toggle — always show, not just on edit */}
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-100 hover:border-[#d97706]/30 transition-colors">
            <div
              className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${isActive ? "bg-[#d97706]" : "bg-gray-200"}`}
              onClick={() => setIsActive(v => !v)}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${isActive ? "left-4" : "left-0.5"}`} />
            </div>
            <span className="text-sm font-semibold text-[#1a1a2e]">{isActive ? "Active" : "Inactive"}</span>
          </label>

          {/* Coupon usage info */}
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 font-medium space-y-1">
            <p className="font-bold">💡 How coupons work for users:</p>
            <p>• Users enter the code at checkout in the payment modal</p>
            <p>• Global coupons work on any note or test paper</p>
            <p>• Note/Paper coupons only apply to that specific item</p>
            <p>• Coupon stacks on top of existing item discounts</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-semibold">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d97706] to-[#b45309] text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {isEdit ? "Save Changes" : "Create Coupon"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Notes Tab ────────────────────────────────────────────────────────────────

function NotesTab({ authFetch, showToast, token }: {
  authFetch: (url: string, init?: RequestInit) => Promise<Response>;
  showToast: (msg: string, type?: "success" | "error") => void;
  token: string | null;
}) {
  const [notes,       setNotes]       = useState<Note[]>([]);
  const [categories,  setCategories]  = useState<NoteCategory[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [catFilter,   setCatFilter]   = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [availFilter, setAvailFilter] = useState("");
  const [editNote,    setEditNote]    = useState<Note | null | undefined>(undefined);
  const [delNote,     setDelNote]     = useState<Note | null>(null);
  const [deleting,    setDeleting]    = useState(false);
  const [showCatMgr,  setShowCatMgr]  = useState(false);
  const [previewing,  setPreviewing]  = useState<{ url: string; title: string } | null>(null);

  // Next serial = max serialId + 1
  const nextSerial = notes.length > 0 ? Math.max(...notes.map(n => n.serialId)) + 1 : 1;

  const loadCats = useCallback(async () => {
    const res = await authFetch("/api/admin/notes/note-categories");
    const d   = await res.json();
    setCategories(d.categories || []);
  }, [authFetch]);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (search)      p.set("search",       search);
      if (catFilter)   p.set("categoryId",   catFilter);
      if (priceFilter) p.set("price",        priceFilter);
      if (availFilter) p.set("availability", availFilter);
      const res = await authFetch(`/api/admin/notes?${p}`);
      const d   = await res.json();
      setNotes(d.notes || []);
    } finally { setLoading(false); }
  }, [authFetch, search, catFilter, priceFilter, availFilter]);

  useEffect(() => { loadCats(); }, [loadCats]);
  useEffect(() => { loadNotes(); }, [loadNotes]);

  const handleDelete = async () => {
    if (!delNote) return;
    setDeleting(true);
    try {
      const res = await authFetch(`/api/admin/notes/${delNote.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast("Note deleted.");
      setDelNote(null);
      loadNotes();
    } catch (e: any) { showToast(e.message, "error"); }
    finally { setDeleting(false); }
  };

  const clearFilters = () => { setSearch(""); setCatFilter(""); setPriceFilter(""); setAvailFilter(""); };
  const hasFilters = !!(search || catFilter || priceFilter || availFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-black text-[#1a1a2e]">Notes Library</h2>
          <p className="text-xs text-gray-400 mt-0.5">{notes.length} notes · next serial #{nextSerial}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowCatMgr(true)}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors text-gray-600">
            <FolderOpen size={14} /> Categories
          </button>
          <button onClick={() => setEditNote(null)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#5b4fcf] to-[#7c3aed] text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity">
            <Plus size={14} /> Add Note
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes…"
            className="w-full pl-8 pr-3 py-2 border border-gray-100 rounded-lg text-sm outline-none focus:border-[#5b4fcf]/40 bg-gray-50" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 outline-none focus:border-[#5b4fcf]/40 text-gray-600">
          <option value="">All Categories</option>
          <option value="uncategorized">Uncategorized</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}
          className="px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 outline-none focus:border-[#5b4fcf]/40 text-gray-600">
          <option value="">Any Price</option>
          <option value="free">Free Only</option>
          <option value="paid">Paid Only</option>
        </select>
        <select value={availFilter} onChange={e => setAvailFilter(e.target.value)}
          className="px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 outline-none focus:border-[#5b4fcf]/40 text-gray-600">
          <option value="">All Versions</option>
          <option value="both">Demo + Real</option>
          <option value="demo_only">Demo Only</option>
          <option value="real_only">Real Only</option>
        </select>
        <button onClick={loadNotes} className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
          <RefreshCw size={14} />
        </button>
        {hasFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-[#5b4fcf]" /></div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
          <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-sm">No notes found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {notes.map((note, i) => {
            const effP = effectivePrice(note.price, note.discountPercent);
            return (
              <div key={note.id}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${i < notes.length - 1 ? "border-b border-gray-50" : ""}`}>
                <div className="w-9 h-9 rounded-xl bg-[#5b4fcf]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-black text-[#5b4fcf]">#{note.serialId}</span>
                </div>
                <BookOpen size={18} className="text-[#5b4fcf]/40 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#1a1a2e] truncate">{note.title}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {note.category && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5b4fcf]/10 text-[#5b4fcf]">
                        {note.category.name}
                      </span>
                    )}
                    {note.label && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">{note.label}</span>
                    )}
                    <span className="text-[10px] text-gray-400 font-medium">🛒 {note._count.purchases} sold</span>
                  </div>
                </div>
                {/* PDF preview buttons */}
                <div className="flex gap-1.5 flex-shrink-0">
                  {note.demoUrl ? (
                    <button
                      onClick={() => setPreviewing({ url: note.demoUrl!, title: `${note.title} (Demo)` })}
                      className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 transition-colors">
                      <Eye size={10} /> Demo
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border bg-gray-50 border-gray-100 text-gray-300">
                      — Demo
                    </span>
                  )}
                  {note.realUrl ? (
                    <button
                      onClick={() => setPreviewing({ url: note.realUrl!, title: `${note.title} (Real)` })}
                      className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border bg-green-50 border-green-200 text-green-600 hover:bg-green-100 transition-colors">
                      <Eye size={10} /> Real
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border bg-gray-50 border-gray-100 text-gray-300">
                      — Real
                    </span>
                  )}
                </div>
                {/* Price */}
                <div className="text-right flex-shrink-0 min-w-[60px]">
                  {note.price === 0 ? (
                    <span className="text-xs font-black text-green-600">Free</span>
                  ) : (
                    <div>
                      {note.discountPercent ? (
                        <>
                          <span className="text-xs line-through text-gray-300 block">₹{note.price}</span>
                          <span className="text-xs font-black text-[#5b4fcf]">₹{effP}</span>
                        </>
                      ) : (
                        <span className="text-xs font-black text-[#5b4fcf]">₹{note.price}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => setEditNote(note)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDelNote(note)}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editNote !== undefined && (
        <NoteModal editNote={editNote} categories={categories} nextSerial={nextSerial}
          onClose={() => setEditNote(undefined)}
          onSaved={saved => {
            setNotes(ns => editNote ? ns.map(n => n.id === saved.id ? saved : n) : [saved, ...ns]);
            loadNotes(); // reload to get correct ordering
          }}
          authFetch={authFetch} showToast={showToast} token={token} />
      )}
      {delNote && (
        <DeleteModal title="Delete Note?" message={`"${delNote.title}" will be permanently deleted.`}
          onClose={() => setDelNote(null)} onConfirm={handleDelete} loading={deleting} />
      )}
      {showCatMgr && (
        <CategoryModal mode="notes" onClose={() => { setShowCatMgr(false); loadCats(); }}
          authFetch={authFetch} showToast={showToast} />
      )}
      {previewing && (
        <PdfPreviewModal url={previewing.url} title={previewing.title} onClose={() => setPreviewing(null)} />
      )}
    </div>
  );
}

// ─── Papers Tab ───────────────────────────────────────────────────────────────

function PapersTab({ authFetch, showToast, token }: {
  authFetch: (url: string, init?: RequestInit) => Promise<Response>;
  showToast: (msg: string, type?: "success" | "error") => void;
  token: string | null;
}) {
  const [papers,      setPapers]      = useState<TestPaper[]>([]);
  const [categories,  setCategories]  = useState<PaperCategory[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [catFilter,   setCatFilter]   = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [editPaper,   setEditPaper]   = useState<TestPaper | null | undefined>(undefined);
  const [delPaper,    setDelPaper]    = useState<TestPaper | null>(null);
  const [deleting,    setDeleting]    = useState(false);
  const [showCatMgr,  setShowCatMgr]  = useState(false);
  const [previewing,  setPreviewing]  = useState<{ url: string; title: string } | null>(null);

  const nextSerial = papers.length > 0 ? Math.max(...papers.map(p => p.serialId)) + 1 : 1;

  const loadCats = useCallback(async () => {
    const res = await authFetch("/api/admin/notes/test-papers/test-paper-categories");
    const d   = await res.json();
    setCategories(d.categories || []);
  }, [authFetch]);

  const loadPapers = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (search)      p.set("search",     search);
      if (catFilter)   p.set("categoryId", catFilter);
      if (priceFilter) p.set("price",      priceFilter);
      const res = await authFetch(`/api/admin/notes/test-papers?${p}`);
      const d   = await res.json();
      setPapers(d.papers || []);
    } finally { setLoading(false); }
  }, [authFetch, search, catFilter, priceFilter]);

  useEffect(() => { loadCats(); }, [loadCats]);
  useEffect(() => { loadPapers(); }, [loadPapers]);

  const handleDelete = async () => {
    if (!delPaper) return;
    setDeleting(true);
    try {
      const res = await authFetch(`/api/admin/notes/test-papers/${delPaper.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast("Test paper deleted.");
      setDelPaper(null);
      loadPapers();
    } catch (e: any) { showToast(e.message, "error"); }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-black text-[#1a1a2e]">Test Papers</h2>
          <p className="text-xs text-gray-400 mt-0.5">{papers.length} papers · next serial #{nextSerial}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowCatMgr(true)}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors text-gray-600">
            <FolderOpen size={14} /> Categories
          </button>
          <button onClick={() => setEditPaper(null)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#0891b2] to-[#0e7490] text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity">
            <Plus size={14} /> Add Paper
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search papers…"
            className="w-full pl-8 pr-3 py-2 border border-gray-100 rounded-lg text-sm outline-none focus:border-[#0891b2]/40 bg-gray-50" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 outline-none focus:border-[#0891b2]/40 text-gray-600">
          <option value="">All Categories</option>
          <option value="uncategorized">Uncategorized</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}
          className="px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 outline-none focus:border-[#0891b2]/40 text-gray-600">
          <option value="">Any Price</option>
          <option value="free">Free Only</option>
          <option value="paid">Paid Only</option>
        </select>
        <button onClick={loadPapers} className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
          <RefreshCw size={14} />
        </button>
        {(search || catFilter || priceFilter) && (
          <button onClick={() => { setSearch(""); setCatFilter(""); setPriceFilter(""); }}
            className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-[#0891b2]" /></div>
      ) : papers.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
          <FileText size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-sm">No test papers found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {papers.map((paper, i) => {
            const effP = effectivePrice(paper.price, paper.discountPercent);
            // Support both old fileUrl and new realUrl
            const realUrl = paper.realUrl ?? paper.fileUrl ?? null;
            return (
              <div key={paper.id}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${i < papers.length - 1 ? "border-b border-gray-50" : ""}`}>
                <div className="w-9 h-9 rounded-xl bg-[#0891b2]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-black text-[#0891b2]">#{paper.serialId}</span>
                </div>
                <FileText size={18} className="text-[#0891b2]/40 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#1a1a2e] truncate">{paper.title}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {paper.category && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0891b2]/10 text-[#0891b2]">
                        {paper.category.name}
                      </span>
                    )}
                    {paper.label && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">{paper.label}</span>
                    )}
                    <span className="text-[10px] text-gray-400 font-medium">⬇️ {paper._count.purchases} purchased</span>
                  </div>
                </div>
                {/* PDF preview buttons */}
                <div className="flex gap-1.5 flex-shrink-0">
                  {paper.demoUrl ? (
                    <button
                      onClick={() => setPreviewing({ url: paper.demoUrl!, title: `${paper.title} (Demo)` })}
                      className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 transition-colors">
                      <Eye size={10} /> Demo
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border bg-gray-50 border-gray-100 text-gray-300">
                      — Demo
                    </span>
                  )}
                  {realUrl ? (
                    <button
                      onClick={() => setPreviewing({ url: realUrl, title: `${paper.title} (Full)` })}
                      className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border bg-green-50 border-green-200 text-green-600 hover:bg-green-100 transition-colors">
                      <Eye size={10} /> Full
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border bg-gray-50 border-gray-100 text-gray-300">
                      — Full
                    </span>
                  )}
                </div>
                <div className="text-right flex-shrink-0 min-w-[60px]">
                  {paper.price === 0 ? (
                    <span className="text-xs font-black text-green-600">Free</span>
                  ) : (
                    <div>
                      {paper.discountPercent ? (
                        <>
                          <span className="text-xs line-through text-gray-300 block">₹{paper.price}</span>
                          <span className="text-xs font-black text-[#0891b2]">₹{effP}</span>
                        </>
                      ) : (
                        <span className="text-xs font-black text-[#0891b2]">₹{paper.price}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => setEditPaper(paper)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDelPaper(paper)}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editPaper !== undefined && (
        <PaperModal editPaper={editPaper} categories={categories} nextSerial={nextSerial}
          onClose={() => setEditPaper(undefined)}
          onSaved={() => loadPapers()}
          authFetch={authFetch} showToast={showToast} token={token} />
      )}
      {delPaper && (
        <DeleteModal title="Delete Test Paper?" message={`"${delPaper.title}" will be permanently deleted.`}
          onClose={() => setDelPaper(null)} onConfirm={handleDelete} loading={deleting} />
      )}
      {showCatMgr && (
        <CategoryModal mode="papers" onClose={() => { setShowCatMgr(false); loadCats(); }}
          authFetch={authFetch} showToast={showToast} />
      )}
      {previewing && (
        <PdfPreviewModal url={previewing.url} title={previewing.title} onClose={() => setPreviewing(null)} />
      )}
    </div>
  );
}

// ─── Coupons Tab ──────────────────────────────────────────────────────────────

function CouponsTab({ authFetch, showToast }: {
  authFetch: (url: string, init?: RequestInit) => Promise<Response>;
  showToast: (msg: string, type?: "success" | "error") => void;
}) {
  const [coupons,    setCoupons]    = useState<Coupon[]>([]);
  const [notes,      setNotes]      = useState<Note[]>([]);
  const [papers,     setPapers]     = useState<TestPaper[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [editCoupon, setEditCoupon] = useState<Coupon | null | undefined>(undefined);
  const [delCoupon,  setDelCoupon]  = useState<Coupon | null>(null);
  const [deleting,   setDeleting]   = useState(false);
  const [scopeFilter,setScopeFilter]= useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (scopeFilter) p.set("scope",  scopeFilter);
      if (activeOnly)  p.set("active", "true");
      const [cr, nr, pr] = await Promise.all([
        authFetch(`/api/admin/notes/coupons?${p}`),
        authFetch("/api/admin/notes?limit=200"),
        authFetch("/api/admin/notes/test-papers?limit=200"),
      ]);
      const [cd, nd, pd] = await Promise.all([cr.json(), nr.json(), pr.json()]);
      setCoupons(cd.coupons || []);
      setNotes(nd.notes || []);
      setPapers(pd.papers || []);
    } finally { setLoading(false); }
  }, [authFetch, scopeFilter, activeOnly]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!delCoupon) return;
    setDeleting(true);
    try {
      const res = await authFetch(`/api/admin/notes/coupons/${delCoupon.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast("Coupon deleted.");
      setDelCoupon(null);
      load();
    } catch (e: any) { showToast(e.message, "error"); }
    finally { setDeleting(false); }
  };

  const toggleActive = async (c: Coupon) => {
    try {
      await authFetch(`/api/admin/notes/coupons/${c.id}`, {
        method: "PATCH", body: JSON.stringify({ isActive: !c.isActive }),
      });
      load();
    } catch {}
  };

  const scopeColor: Record<string, string> = {
    global: "#5b4fcf", note: "#059669", test_paper: "#0891b2",
  };
  const scopeLabel: Record<string, string> = {
    global: "🌐 Global", note: "📚 Note", test_paper: "📝 Paper",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-black text-[#1a1a2e]">Coupons</h2>
          <p className="text-xs text-gray-400 mt-0.5">{coupons.length} coupons · users enter these at checkout</p>
        </div>
        <button onClick={() => setEditCoupon(null)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#d97706] to-[#b45309] text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity">
          <Plus size={14} /> Create Coupon
        </button>
      </div>

      {/* Info banner */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-medium flex items-start gap-2">
        <span className="text-base mt-0.5">💡</span>
        <div>
          <span className="font-bold">Coupon flow:</span> Users click "Unlock" on any note/paper → payment modal opens → they enter a coupon code → discount is applied live before paying.
          Global coupons work anywhere; note/paper coupons only on that item.
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
        <select value={scopeFilter} onChange={e => setScopeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 outline-none text-gray-600">
          <option value="">All Scopes</option>
          <option value="global">Global</option>
          <option value="note">Note-specific</option>
          <option value="test_paper">Paper-specific</option>
        </select>
        <label className="flex items-center gap-2 cursor-pointer px-3 py-2 border border-gray-100 rounded-lg bg-gray-50">
          <input type="checkbox" checked={activeOnly} onChange={e => setActiveOnly(e.target.checked)}
            className="accent-[#d97706]" />
          <span className="text-sm font-medium text-gray-600">Active only</span>
        </label>
        <button onClick={load} className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
          <RefreshCw size={14} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-[#d97706]" /></div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
          <TicketPercent size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-sm">No coupons yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {coupons.map((c, i) => (
            <div key={c.id}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${i < coupons.length - 1 ? "border-b border-gray-50" : ""}`}>
              {/* Code */}
              <div className="flex-shrink-0">
                <span className="font-mono text-sm font-black tracking-widest px-3 py-1.5 rounded-lg border-2"
                  style={{ color: scopeColor[c.scope] ?? "#5b4fcf", borderColor: `${scopeColor[c.scope] ?? "#5b4fcf"}30`, background: `${scopeColor[c.scope] ?? "#5b4fcf"}08` }}>
                  {c.code}
                </span>
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-black text-[#1a1a2e]">{c.discountPercent}% off</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${scopeColor[c.scope]}18`, color: scopeColor[c.scope] }}>
                    {scopeLabel[c.scope] ?? c.scope}
                  </span>
                  {c.note && <span className="text-[10px] text-gray-500 font-medium truncate max-w-[140px]" title={c.note.title}>→ {c.note.title}</span>}
                  {c.testPaper && <span className="text-[10px] text-gray-500 font-medium truncate max-w-[140px]" title={c.testPaper.title}>→ {c.testPaper.title}</span>}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-gray-400 font-medium">
                    Used: <span className="font-bold text-gray-600">{c.usedCount}</span>{c.maxUses ? `/${c.maxUses}` : " (unlimited)"}
                  </span>
                  {c.expiresAt && (
                    <span className={`text-[10px] font-medium ${new Date(c.expiresAt) < new Date() ? "text-red-500 font-bold" : "text-gray-400"}`}>
                      Expires: {fmtDate(c.expiresAt)}
                      {new Date(c.expiresAt) < new Date() ? " ⚠ Expired" : ""}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400">{c._count.purchases} purchases used this</span>
                </div>
              </div>
              {/* Toggle active */}
              <button onClick={() => toggleActive(c)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                  ${c.isActive ? "bg-green-50 border-green-200 text-green-600 hover:bg-green-100" : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100"}`}>
                {c.isActive ? "Active" : "Inactive"}
              </button>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => setEditCoupon(c)}
                  className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => setDelCoupon(c)}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editCoupon !== undefined && (
        <CouponModal editCoupon={editCoupon} notes={notes} papers={papers}
          onClose={() => setEditCoupon(undefined)}
          onSaved={() => load()}
          authFetch={authFetch} showToast={showToast} />
      )}
      {delCoupon && (
        <DeleteModal title="Delete Coupon?" message={`Coupon "${delCoupon.code}" will be permanently deleted.`}
          onClose={() => setDelCoupon(null)} onConfirm={handleDelete} loading={deleting} />
      )}
    </div>
  );
}

// ─── Purchases Tab ────────────────────────────────────────────────────────────

function PurchasesTab({ authFetch }: {
  authFetch: (url: string, init?: RequestInit) => Promise<Response>;
}) {
  const [purchases,  setPurchases]  = useState<Purchase[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page,       setPage]       = useState(1);
  const [total,      setTotal]      = useState(0);
  const LIMIT = 50;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (search)     p.set("search", search);
      if (typeFilter) p.set("type",   typeFilter);
      p.set("page",  String(page));
      p.set("limit", String(LIMIT));
      const res = await authFetch(`/api/admin/notes/purchases?${p}`);
      const d   = await res.json();
      setPurchases(d.purchases || []);
      setTotal(d.total || 0);
    } finally { setLoading(false); }
  }, [authFetch, search, typeFilter, page]);

  useEffect(() => { load(); }, [load]);

  // Derived stats from this page
  const totalRevenue  = purchases.reduce((s, p) => s + p.finalPrice, 0);
  const totalDiscount = purchases.reduce((s, p) => s + p.discountApplied, 0);
  const uniqueUsers   = new Set(purchases.map(p => p.userId)).size;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-black text-[#1a1a2e]">Purchases & Access</h2>
          <p className="text-xs text-gray-400 mt-0.5">{total} total purchases</p>
        </div>
        <button onClick={load} className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:bg-gray-50 transition-colors">
          <RefreshCw size={15} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={ShoppingBag} label="Total Purchases" value={total}                                          color="#5b4fcf" />
        <StatCard icon={DollarSign}  label="Revenue (page)"  value={`₹${totalRevenue.toLocaleString("en-IN")}`}    color="#059669" />
        <StatCard icon={Users}       label="Unique Buyers"   value={uniqueUsers}                                    color="#0891b2" />
        <StatCard icon={Percent}     label="Discount Given"  value={`₹${totalDiscount.toLocaleString("en-IN")}`}   color="#d97706" />
      </div>

      <div className="flex flex-wrap gap-2 items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by user, email or item…"
            className="w-full pl-8 pr-3 py-2 border border-gray-100 rounded-lg text-sm outline-none focus:border-[#5b4fcf]/40 bg-gray-50" />
        </div>
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 outline-none text-gray-600">
          <option value="">All Types</option>
          <option value="note">Notes Only</option>
          <option value="paper">Papers Only</option>
        </select>
        {(search || typeFilter) && (
          <button onClick={() => { setSearch(""); setTypeFilter(""); setPage(1); }}
            className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-[#5b4fcf]" /></div>
      ) : purchases.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
          <ShoppingBag size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-sm">No purchases found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  {["User", "Item", "Type", "Original", "Discount", "Paid", "Coupon", "Date"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {purchases.map((p, i) => (
                  <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${i < purchases.length - 1 ? "border-b border-gray-50" : ""}`}>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold text-[#1a1a2e]">{p.user.name ?? "—"}</p>
                      <p className="text-xs text-gray-400">{p.user.email}</p>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <p className="text-sm font-medium text-[#1a1a2e] truncate">
                        {p.note?.title ?? p.testPaper?.title ?? "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full
                        ${p.noteId ? "bg-[#5b4fcf]/10 text-[#5b4fcf]" : "bg-[#0891b2]/10 text-[#0891b2]"}`}>
                        {p.noteId ? "📚 Note" : "📝 Paper"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-500">
                      {p.originalPrice === 0 ? "Free" : `₹${p.originalPrice}`}
                    </td>
                    <td className="px-4 py-3">
                      {p.discountApplied > 0
                        ? <span className="text-xs font-bold text-green-600">-₹{p.discountApplied}</span>
                        : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-black ${p.finalPrice === 0 ? "text-green-600" : "text-[#1a1a2e]"}`}>
                        {p.finalPrice === 0 ? "Free 🎉" : `₹${p.finalPrice}`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.coupon
                        ? <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200">{p.coupon.code}</span>
                        : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 font-medium whitespace-nowrap">{fmtDate(p.purchasedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {total > LIMIT && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-400 font-medium">
                Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(v => Math.max(1, v - 1))} disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">
                  ← Prev
                </button>
                <button onClick={() => setPage(v => v + 1)} disabled={page * LIMIT >= total}
                  className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function NotesLibraryAdmin() {
  const { token } = useAuth();
  const [tab,   setTab]   = useState<Tab>("notes");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const authFetch = useCallback((url: string, init: RequestInit = {}) => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (init.body instanceof FormData) delete headers["Content-Type"];
    return fetch(url, { ...init, headers: { ...headers, ...(init.headers as Record<string, string> ?? {}) } });
  }, [token]);

  const TABS: { id: Tab; label: string; icon: any; color: string }[] = [
    { id: "notes",     label: "Notes",      icon: BookOpen,     color: "#5b4fcf" },
    { id: "papers",    label: "Test Papers", icon: FileText,     color: "#0891b2" },
    { id: "coupons",   label: "Coupons",     icon: TicketPercent,color: "#d97706" },
    { id: "purchases", label: "Purchases",   icon: ShoppingBag,  color: "#059669" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div>
        <h1 className="text-2xl font-black text-[#1a1a2e] tracking-tight">📖 Content Library</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage notes, test papers, coupons and track purchases</p>
      </div>

      <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 w-fit shadow-sm">
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all
                ${active ? "text-white shadow-md" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
              style={active ? { background: `linear-gradient(135deg, ${t.color}, ${t.color}cc)` } : {}}>
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "notes"     && <NotesTab     authFetch={authFetch} showToast={showToast} token={token} />}
      {tab === "papers"    && <PapersTab    authFetch={authFetch} showToast={showToast} token={token} />}
      {tab === "coupons"   && <CouponsTab   authFetch={authFetch} showToast={showToast} />}
      {tab === "purchases" && <PurchasesTab authFetch={authFetch} />}
    </div>
  );
}