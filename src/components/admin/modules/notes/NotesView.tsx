


// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type NoteType = "DEMO" | "REAL";

// interface Note {
//   id: string;
//   serialId: number;
//   title: string;
//   label: string;
//   type: NoteType;
//   pdfUrl: string;
//   storagePath: string;
//   createdAt: string;
//   updatedAt: string;
// }

// // ─── Supabase Storage config ──────────────────────────────────────────────────
// const BUCKET = "notes-pdfs";

// /**
//  * Uploads a PDF file DIRECTLY from the browser to Supabase Storage.
//  * This completely bypasses the Vercel serverless function,
//  * so there is no 4.5 MB payload limit.
//  *
//  * Uses the anon key + RLS policies (bucket must be public or have INSERT policy).
//  */
// async function uploadPdfToSupabase(
//   file: File,
//   onProgress?: (pct: number) => void
// ): Promise<{ pdfUrl: string; storagePath: string }> {
//   const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
//   const storagePath = `notes/${Date.now()}-${safeName}`;

//   // Report progress at start
//   onProgress?.(10);

//   const { error } = await supabase.storage
//     .from(BUCKET)
//     .upload(storagePath, file, {
//       contentType: "application/pdf",
//       upsert: false,
//     });

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

// // ─── API helpers (metadata only — no file payloads) ───────────────────────────
// const API = {
//   list: async (): Promise<Note[]> => {
//     const headers = await getAuthHeaders();
//     const res = await fetch("/api/admin/notes", { headers });
//     const text = await res.text();
//     let json: { notes?: Note[]; error?: string } = {};
//     try { json = JSON.parse(text); } catch { throw new Error("Invalid server response"); }
//     if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
//     return json.notes ?? [];
//   },

//   create: async (fields: {
//     title: string; label: string; type: NoteType;
//     serialId: number; pdfUrl: string; storagePath: string;
//   }): Promise<Note> => {
//     const headers = await getAuthHeaders();
//     const res = await fetch("/api/admin/notes", {
//       method: "POST",
//       headers,
//       body: JSON.stringify(fields),
//     });
//     const text = await res.text();
//     let json: { note?: Note; error?: string } = {};
//     try { json = JSON.parse(text); } catch { throw new Error(`Server error ${res.status}: ${text.slice(0, 120)}`); }
//     if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
//     return json.note as Note;
//   },

//   update: async (
//     id: string,
//     fields: {
//       title?: string; label?: string; type?: NoteType;
//       serialId?: number; pdfUrl?: string; storagePath?: string;
//     }
//   ): Promise<Note> => {
//     const headers = await getAuthHeaders();
//     const res = await fetch(`/api/admin/notes/${id}`, {
//       method: "PATCH",
//       headers,
//       body: JSON.stringify(fields),
//     });
//     const text = await res.text();
//     let json: { note?: Note; error?: string } = {};
//     try { json = JSON.parse(text); } catch { throw new Error(`Server error ${res.status}: ${text.slice(0, 120)}`); }
//     if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
//     return json.note as Note;
//   },

//   delete: async (id: string): Promise<void> => {
//     const headers = await getAuthHeaders();
//     const res = await fetch(`/api/admin/notes/${id}`, { method: "DELETE", headers });
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
//     }}>
//       {text}
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
//       letterSpacing: 0.5, textTransform: "uppercase",
//     }}>
//       {isDemo ? "Demo" : "Real"}
//     </span>
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
//     return () => {
//       document.removeEventListener("keydown", handler);
//       document.body.style.overflow = "";
//     };
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
//           }}>
//             📄 {title}
//           </span>
//           <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
//             <a href={url} target="_blank" rel="noopener noreferrer" style={{
//               padding: "7px 16px", borderRadius: 8, background: "#2C2A22", color: "#FFFDF7",
//               fontSize: 12, fontWeight: 600, textDecoration: "none",
//             }}>
//               Open in Tab ↗
//             </a>
//             <button onClick={onClose} style={{
//               padding: "7px 16px", borderRadius: 8, background: "#F0EBE0", color: "#555",
//               border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
//             }}>
//               ✕ Close
//             </button>
//           </div>
//         </div>
//         <div style={{ flex: 1, position: "relative", background: "#525659", overflow: "hidden" }}>
//           {loading && !loadError && (
//             <div style={{
//               position: "absolute", inset: 0, display: "flex", flexDirection: "column",
//               alignItems: "center", justifyContent: "center", color: "#CCC", fontSize: 14, gap: 12, zIndex: 1,
//             }}>
//               <div style={{
//                 width: 36, height: 36, border: "3px solid #666", borderTopColor: "#FFF",
//                 borderRadius: "50%", animation: "spin 0.8s linear infinite",
//               }} />
//               Loading PDF…
//             </div>
//           )}
//           {loadError ? (
//             <div style={{
//               position: "absolute", inset: 0, display: "flex", flexDirection: "column",
//               alignItems: "center", justifyContent: "center",
//               color: "#EEE", gap: 16, padding: 32, textAlign: "center",
//             }}>
//               <div style={{ fontSize: 48 }}>⚠️</div>
//               <div style={{ fontSize: 16, fontWeight: 700 }}>PDF could not be loaded</div>
//               <a href={url} target="_blank" rel="noopener noreferrer" style={{
//                 padding: "10px 24px", borderRadius: 8, background: "#2C2A22", color: "#FFFDF7",
//                 fontSize: 13, fontWeight: 600, textDecoration: "none",
//               }}>
//                 Open in Tab ↗
//               </a>
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
//     <div style={{
//       padding: "12px 14px", borderRadius: 10,
//       background: "#EAF4FF", border: "1.5px solid #A8CCEE",
//       marginBottom: 8,
//     }}>
//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
//         <span style={{ fontSize: 12, fontWeight: 700, color: "#1A6FB5" }}>
//           ⬆️ Uploading {filename}…
//         </span>
//         <span style={{ fontSize: 12, fontWeight: 700, color: "#1A6FB5" }}>{pct}%</span>
//       </div>
//       <div style={{ height: 6, background: "#C8E0F8", borderRadius: 3, overflow: "hidden" }}>
//         <div style={{
//           height: "100%", borderRadius: 3,
//           background: "#1A6FB5",
//           width: `${pct}%`,
//           transition: "width 0.3s ease",
//         }} />
//       </div>
//     </div>
//   );
// }

// // ─── Add / Edit Modal ─────────────────────────────────────────────────────────
// function NoteFormModal({
//   editNote, onClose, onSaved,
// }: {
//   editNote?: Note | null; onClose: () => void; onSaved: () => void;
// }) {
//   const isEdit = !!editNote;
//   const [title, setTitle] = useState(editNote?.title ?? "");
//   const [label, setLabel] = useState(editNote?.label ?? "");
//   const [type, setType] = useState<NoteType>(editNote?.type ?? "REAL");
//   const [serialId, setSerialId] = useState<number>(editNote?.serialId ?? 1);
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

//     // ── Step 1: Upload PDF directly to Supabase from browser ─────────────────
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

//     // ── Step 2: Save metadata to DB via API ───────────────────────────────────
//     setSaving(true);
//     try {
//       if (isEdit) {
//         await API.update(editNote!.id, { title, label, type, serialId, pdfUrl, storagePath });
//       } else {
//         await API.create({ title, label, type, serialId, pdfUrl: pdfUrl!, storagePath: storagePath! });
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
//     textTransform: "uppercase", marginBottom: 6, display: "block",
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
//               placeholder="e.g. Physics, Maths, week1…"
//               style={input} disabled={isBusy}
//             />
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

//             {/* Upload progress */}
//             {uploading && newFile && (
//               <UploadProgress pct={uploadPct} filename={newFile.name} />
//             )}

//             {/* Current PDF (edit, no new file) */}
//             {isEdit && !newFile && !uploading && currentPdfName && (
//               <div style={{
//                 display: "flex", alignItems: "center", gap: 10,
//                 padding: "10px 14px", borderRadius: 8,
//                 background: "#F0FBF3", border: "1.5px solid #8ED4A8", marginBottom: 8,
//               }}>
//                 <span style={{ fontSize: 18 }}>📄</span>
//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <div style={{ fontSize: 12, fontWeight: 700, color: "#1A7A3A" }}>Current PDF</div>
//                   <div style={{ fontSize: 13, color: "#2C2A22", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                     {currentPdfName}
//                   </div>
//                 </div>
//                 <button onClick={() => fileRef.current?.click()} disabled={isBusy} style={{
//                   padding: "5px 12px", borderRadius: 6, background: "#2C2A22", color: "#FFFDF7",
//                   border: "none", fontSize: 11, fontWeight: 700,
//                   cursor: isBusy ? "not-allowed" : "pointer", flexShrink: 0,
//                 }}>
//                   Replace
//                 </button>
//               </div>
//             )}

//             {/* New file selected (not yet uploading) */}
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
//                   <div style={{ fontSize: 13, color: "#2C2A22", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                     {newFile.name}
//                   </div>
//                   <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
//                     {(newFile.size / 1024 / 1024).toFixed(2)} MB
//                   </div>
//                 </div>
//                 <button onClick={() => setNewFile(null)} style={{
//                   padding: "5px 10px", borderRadius: 6, background: "#FDECEC", color: "#C0392B",
//                   border: "1px solid #FFAAAA", fontSize: 11, fontWeight: 700,
//                   cursor: "pointer", flexShrink: 0,
//                 }}>
//                   ✕
//                 </button>
//               </div>
//             )}

//             {/* Drop zone */}
//             {!uploading && !(isEdit && !newFile && currentPdfName) && (
//               <div onClick={() => !isBusy && fileRef.current?.click()} style={{
//                 border: "2px dashed #CCC8BE", borderRadius: 10, padding: "18px",
//                 cursor: isBusy ? "not-allowed" : "pointer",
//                 background: "#FAF7EE", color: "#888",
//                 fontSize: 13, fontWeight: 600, textAlign: "center",
//                 opacity: isBusy ? 0.5 : 1,
//               }}>
//                 📂 Click to {isEdit ? "replace" : "select"} PDF
//                 <div style={{ fontSize: 11, marginTop: 4, color: "#BBB" }}>
//                   PDF only · Uploaded directly to storage (no size limit)
//                 </div>
//               </div>
//             )}

//             <input ref={fileRef} type="file" accept="application/pdf" style={{ display: "none" }}
//               onChange={(e) => { setNewFile(e.target.files?.[0] ?? null); e.target.value = ""; }}
//             />
//           </div>
//         </div>

//         {error && (
//           <p style={{ color: "#C0392B", fontSize: 13, marginTop: 12, marginBottom: 0 }}>⚠️ {error}</p>
//         )}

//         {/* Status message */}
//         {(uploading || saving) && (
//           <p style={{ color: "#1A6FB5", fontSize: 13, marginTop: 10, marginBottom: 0, fontWeight: 600 }}>
//             {uploading ? `⬆️ Uploading PDF… ${uploadPct}%` : "💾 Saving note…"}
//           </p>
//         )}

//         <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
//           <button onClick={handleSubmit} disabled={isBusy} style={{
//             flex: 1, padding: "12px 0", borderRadius: 10,
//             background: isBusy ? "#AAA" : "#2C2A22",
//             color: "#FFFDF7", border: "none",
//             fontWeight: 800, fontSize: 15, cursor: isBusy ? "not-allowed" : "pointer",
//           }}>
//             {uploading ? (
//               <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
//                 <span style={{
//                   width: 14, height: 14, border: "2px solid #fff6", borderTopColor: "#fff",
//                   borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block",
//                 }} />
//                 Uploading… {uploadPct}%
//               </span>
//             ) : saving ? (
//               <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
//                 <span style={{
//                   width: 14, height: 14, border: "2px solid #fff6", borderTopColor: "#fff",
//                   borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block",
//                 }} />
//                 Saving…
//               </span>
//             ) : (isEdit ? "Save Changes" : "Upload Note")}
//           </button>
//           <button onClick={isBusy ? undefined : onClose} style={{
//             padding: "12px 20px", borderRadius: 10, background: "#F0EBE0", color: "#555",
//             border: "none", fontWeight: 700, fontSize: 15,
//             cursor: isBusy ? "not-allowed" : "pointer", opacity: isBusy ? 0.5 : 1,
//           }}>
//             Cancel
//           </button>
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
//       }}>
//         📄
//       </div>
//       <div style={{ flex: 1, minWidth: 140 }}>
//         <div style={{ fontWeight: 700, fontSize: 15, color: "#2C2A22", marginBottom: 5 }}>{note.title}</div>
//         <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//           <TypePill type={note.type} />
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
//         transition: "all .15s", whiteSpace: "nowrap",
//       }}
//     >
//       {emoji} {label}
//     </button>
//   );
// }

// // ─── Delete Confirm ───────────────────────────────────────────────────────────
// function DeleteConfirmModal({ note, onClose, onConfirm, deleting }: {
//   note: Note; onClose: () => void; onConfirm: () => void; deleting: boolean;
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
//         <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: "#2C2A22" }}>Delete Note?</h3>
//         <p style={{ color: "#666", fontSize: 14, margin: "0 0 24px" }}>
//           "<strong>{note.title}</strong>" will be permanently deleted along with its PDF.
//         </p>
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
//           }}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Main View ────────────────────────────────────────────────────────────────
// export default function NotesView() {
//   const [allNotes, setAllNotes] = useState<Note[]>([]);
//   const [activeTab, setActiveTab] = useState<NoteType | "all">("all");
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [loadError, setLoadError] = useState("");
//   const [viewingNote, setViewingNote] = useState<Note | null>(null);
//   const [editingNote, setEditingNote] = useState<Note | null | undefined>(undefined);
//   const [deletingNote, setDeletingNote] = useState<Note | null>(null);
//   const [deleting, setDeleting] = useState(false);
//   const [search, setSearch] = useState("");

//   const loadNotes = useCallback(async (isRefresh = false) => {
//     if (isRefresh) setRefreshing(true);
//     else setLoading(true);
//     setLoadError("");
//     try {
//       const data = await API.list();
//       setAllNotes(data);
//     } catch (e) {
//       setLoadError(e instanceof Error ? e.message : "Failed to load notes");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => { loadNotes(); }, [loadNotes]);

//   const handleDelete = async () => {
//     if (!deletingNote) return;
//     setDeleting(true);
//     try {
//       await API.delete(deletingNote.id);
//       setDeletingNote(null);
//       loadNotes(true);
//     } catch { /* ignore */ }
//     finally { setDeleting(false); }
//   };

//   const filtered = allNotes
//     .filter((n) => activeTab === "all" || n.type === activeTab)
//     .filter((n) => {
//       const q = search.trim().toLowerCase();
//       if (!q) return true;
//       return n.title.toLowerCase().includes(q) || n.label.toLowerCase().includes(q);
//     });

//   const counts = {
//     all: allNotes.length,
//     DEMO: allNotes.filter((n) => n.type === "DEMO").length,
//     REAL: allNotes.filter((n) => n.type === "REAL").length,
//   };

//   return (
//     <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: 860, margin: "0 auto" }}>
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
//         <div style={{ display: "flex", gap: 8 }}>
//           <button onClick={() => loadNotes(true)} disabled={refreshing} title="Refresh" style={{
//             display: "flex", alignItems: "center", gap: 6,
//             padding: "11px 16px", borderRadius: 10, background: "#F0EBE0", color: "#555",
//             border: "1.5px solid #DDD8CC", fontWeight: 700, fontSize: 14,
//             cursor: refreshing ? "not-allowed" : "pointer",
//           }}>
//             <span style={{ display: "inline-block", animation: refreshing ? "spin 0.7s linear infinite" : "none" }}>
//               🔄
//             </span>
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

//       {/* Tabs + Search */}
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
//               {counts[tab]}
//             </span>
//           </button>
//         ))}
//         <div style={{ marginLeft: "auto", position: "relative" }}>
//           <input
//             value={search} onChange={(e) => setSearch(e.target.value)}
//             placeholder="🔍  Search by title or label…"
//             style={{
//               padding: "8px 36px 8px 14px", border: "1.5px solid #DDD8CC", borderRadius: 30,
//               background: "#FAF7EE", color: "#2C2A22",
//               fontSize: 13, outline: "none", fontFamily: "inherit", minWidth: 220,
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
//           <button onClick={() => loadNotes()} style={{
//             padding: "6px 14px", borderRadius: 8, background: "#C0392B", color: "#fff",
//             border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer",
//           }}>Retry</button>
//         </div>
//       )}

//       {loading ? (
//         <div style={{ textAlign: "center", padding: "60px 0", color: "#BBB", fontSize: 15 }}>
//           <div style={{
//             width: 32, height: 32, border: "3px solid #DDD", borderTopColor: "#888",
//             borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
//           }} />
//           Loading notes…
//         </div>
//       ) : filtered.length === 0 && !loadError ? (
//         <div style={{
//           textAlign: "center", padding: "60px 0", color: "#CCC", fontSize: 15,
//           border: "2px dashed #EEE9DC", borderRadius: 14,
//         }}>
//           {search.trim()
//             ? `No notes match "${search}".`
//             : "No notes yet. Click ➕ Add Note to get started."}
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

//       {viewingNote && (
//         <PdfModal url={viewingNote.pdfUrl} title={viewingNote.title} onClose={() => setViewingNote(null)} />
//       )}
//       {editingNote !== undefined && (
//         <NoteFormModal editNote={editingNote} onClose={() => setEditingNote(undefined)} onSaved={() => loadNotes(true)} />
//       )}
//       {deletingNote && (
//         <DeleteConfirmModal note={deletingNote} onClose={() => setDeletingNote(null)} onConfirm={handleDelete} deleting={deleting} />
//       )}
//     </div>
//   );
// }











"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// ─── Types ────────────────────────────────────────────────────────────────────
type NoteType = "DEMO" | "REAL";

interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  _count?: { notes: number };
}

interface Note {
  id: string;
  serialId: number;
  title: string;
  label: string;
  type: NoteType;
  pdfUrl: string;
  storagePath: string;
  categoryId: string | null;
  category?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Supabase Storage config ──────────────────────────────────────────────────
const BUCKET = "notes-pdfs";

async function uploadPdfToSupabase(
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ pdfUrl: string; storagePath: string }> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `notes/${Date.now()}-${safeName}`;
  onProgress?.(10);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, { contentType: "application/pdf", upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);
  onProgress?.(90);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  onProgress?.(100);
  return { pdfUrl: data.publicUrl, storagePath };
}

// ─── Auth helper ──────────────────────────────────────────────────────────────
async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    Authorization: `Bearer ${session?.access_token ?? ""}`,
    "Content-Type": "application/json",
  };
}

// ─── API helpers ──────────────────────────────────────────────────────────────
const API = {
  // Notes
  listNotes: async (params?: { categoryId?: string; type?: NoteType | "all"; search?: string }): Promise<Note[]> => {
    const headers = await getAuthHeaders();
    const qs = new URLSearchParams();
    if (params?.categoryId) qs.set("categoryId", params.categoryId);
    if (params?.type && params.type !== "all") qs.set("type", params.type);
    if (params?.search) qs.set("search", params.search);
    const res = await fetch(`/api/admin/notes?${qs}`, { headers });
    const text = await res.text();
    let json: { notes?: Note[]; error?: string } = {};
    try { json = JSON.parse(text); } catch { throw new Error("Invalid server response"); }
    if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
    return json.notes ?? [];
  },

  createNote: async (fields: {
    title: string; label: string; type: NoteType;
    serialId: number; pdfUrl: string; storagePath: string; categoryId?: string | null;
  }): Promise<Note> => {
    const headers = await getAuthHeaders();
    const res = await fetch("/api/admin/notes", { method: "POST", headers, body: JSON.stringify(fields) });
    const text = await res.text();
    let json: { note?: Note; error?: string } = {};
    try { json = JSON.parse(text); } catch { throw new Error(`Server error ${res.status}`); }
    if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
    return json.note as Note;
  },

  updateNote: async (id: string, fields: Partial<{
    title: string; label: string; type: NoteType;
    serialId: number; pdfUrl: string; storagePath: string; categoryId: string | null;
  }>): Promise<Note> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/admin/notes/${id}`, { method: "PATCH", headers, body: JSON.stringify(fields) });
    const text = await res.text();
    let json: { note?: Note; error?: string } = {};
    try { json = JSON.parse(text); } catch { throw new Error(`Server error ${res.status}`); }
    if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
    return json.note as Note;
  },

  deleteNote: async (id: string): Promise<void> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/admin/notes/${id}`, { method: "DELETE", headers });
    if (!res.ok) {
      const text = await res.text();
      let json: { error?: string } = {};
      try { json = JSON.parse(text); } catch { /* ignore */ }
      throw new Error(json.error ?? `Server error ${res.status}`);
    }
  },

  // Categories
  listCategories: async (): Promise<Category[]> => {
    const headers = await getAuthHeaders();
    const res = await fetch("/api/admin/categories", { headers });
    const text = await res.text();
    let json: { categories?: Category[]; error?: string } = {};
    try { json = JSON.parse(text); } catch { throw new Error("Invalid server response"); }
    if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
    return json.categories ?? [];
  },

  createCategory: async (fields: { name: string; description?: string }): Promise<Category> => {
    const headers = await getAuthHeaders();
    const res = await fetch("/api/admin/categories", { method: "POST", headers, body: JSON.stringify(fields) });
    const text = await res.text();
    let json: { category?: Category; error?: string } = {};
    try { json = JSON.parse(text); } catch { throw new Error(`Server error ${res.status}`); }
    if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
    return json.category as Category;
  },

  updateCategory: async (id: string, fields: { name?: string; description?: string }): Promise<Category> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/admin/categories/${id}`, { method: "PATCH", headers, body: JSON.stringify(fields) });
    const text = await res.text();
    let json: { category?: Category; error?: string } = {};
    try { json = JSON.parse(text); } catch { throw new Error(`Server error ${res.status}`); }
    if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
    return json.category as Category;
  },

  deleteCategory: async (id: string): Promise<void> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE", headers });
    if (!res.ok) {
      const text = await res.text();
      let json: { error?: string } = {};
      try { json = JSON.parse(text); } catch { /* ignore */ }
      throw new Error(json.error ?? `Server error ${res.status}`);
    }
  },
};

// ─── Small helpers ────────────────────────────────────────────────────────────
function storagePathToName(storagePath: string): string {
  const filename = storagePath.split("/").pop() ?? storagePath;
  return filename.replace(/^\d+-/, "").replace(/_/g, " ");
}

function Badge({ text }: { text: string }) {
  if (!text) return null;
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 20,
      background: "#FFF3CD", color: "#92660A", fontSize: 11, fontWeight: 600,
      letterSpacing: 0.4, border: "1px solid #F0D080",
    }}>{text}</span>
  );
}

function CategoryBadge({ name }: { name: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 10px", borderRadius: 20,
      background: "#F3EEFF", color: "#6B35C8", fontSize: 11, fontWeight: 600,
      letterSpacing: 0.4, border: "1px solid #C8A8F0",
    }}>
      📁 {name}
    </span>
  );
}

function TypePill({ type }: { type: NoteType }) {
  const isDemo = type === "DEMO";
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 20,
      background: isDemo ? "#EAF4FF" : "#EDFBF0",
      color: isDemo ? "#1A6FB5" : "#1A7A3A", fontSize: 11, fontWeight: 700,
      border: `1px solid ${isDemo ? "#A8CCEE" : "#8ED4A8"}`,
      letterSpacing: 0.5, textTransform: "uppercase" as const,
    }}>
      {isDemo ? "Demo" : "Real"}
    </span>
  );
}

function ActionBtn({ label, emoji, color, bg, onClick }: {
  label: string; emoji: string; color: string; bg: string; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button title={label} onClick={onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8,
        background: hovered ? color : bg, color: hovered ? "#fff" : color,
        border: `1.5px solid ${color}22`, cursor: "pointer", fontWeight: 700, fontSize: 12,
        transition: "all .15s", whiteSpace: "nowrap" as const,
      }}
    >
      {emoji} {label}
    </button>
  );
}

// ─── PDF Viewer Modal ─────────────────────────────────────────────────────────
function PdfModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000, background: "rgba(20,18,14,0.82)",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(6px)", padding: 20, boxSizing: "border-box",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#FFFDF7", borderRadius: 16, width: "100%", maxWidth: 960,
        height: "calc(100vh - 40px)", maxHeight: 860,
        display: "flex", flexDirection: "column",
        overflow: "hidden", boxShadow: "0 32px 100px rgba(0,0,0,0.45)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px", borderBottom: "1px solid #EEE9DC",
          background: "#FAF7EE", flexShrink: 0, gap: 12,
        }}>
          <span style={{
            fontWeight: 700, fontSize: 15, color: "#2C2A22", fontFamily: "'Georgia', serif",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
          }}>📄 {title}</span>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <a href={url} target="_blank" rel="noopener noreferrer" style={{
              padding: "7px 16px", borderRadius: 8, background: "#2C2A22", color: "#FFFDF7",
              fontSize: 12, fontWeight: 600, textDecoration: "none",
            }}>Open in Tab ↗</a>
            <button onClick={onClose} style={{
              padding: "7px 16px", borderRadius: 8, background: "#F0EBE0", color: "#555",
              border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            }}>✕ Close</button>
          </div>
        </div>
        <div style={{ flex: 1, position: "relative", background: "#525659", overflow: "hidden" }}>
          {loading && !loadError && (
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", color: "#CCC", fontSize: 14, gap: 12, zIndex: 1,
            }}>
              <div style={{ width: 36, height: 36, border: "3px solid #666", borderTopColor: "#FFF", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              Loading PDF…
            </div>
          )}
          {loadError ? (
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", color: "#EEE", gap: 16, padding: 32, textAlign: "center",
            }}>
              <div style={{ fontSize: 48 }}>⚠️</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>PDF could not be loaded</div>
              <a href={url} target="_blank" rel="noopener noreferrer" style={{
                padding: "10px 24px", borderRadius: 8, background: "#2C2A22", color: "#FFFDF7",
                fontSize: 13, fontWeight: 600, textDecoration: "none",
              }}>Open in Tab ↗</a>
            </div>
          ) : (
            <iframe key={url} src={url}
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              title={title}
              onLoad={() => setLoading(false)}
              onError={() => { setLoading(false); setLoadError(true); }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Upload Progress Bar ──────────────────────────────────────────────────────
function UploadProgress({ pct, filename }: { pct: number; filename: string }) {
  return (
    <div style={{ padding: "12px 14px", borderRadius: 10, background: "#EAF4FF", border: "1.5px solid #A8CCEE", marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#1A6FB5" }}>⬆️ Uploading {filename}…</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#1A6FB5" }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: "#C8E0F8", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 3, background: "#1A6FB5", width: `${pct}%`, transition: "width 0.3s ease" }} />
      </div>
    </div>
  );
}

// ─── Category Form Modal ──────────────────────────────────────────────────────
function CategoryFormModal({
  editCategory, onClose, onSaved,
}: {
  editCategory?: Category | null; onClose: () => void; onSaved: () => void;
}) {
  const isEdit = !!editCategory;
  const [name, setName] = useState(editCategory?.name ?? "");
  const [description, setDescription] = useState(editCategory?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return setError("Category name is required.");
    setError("");
    setSaving(true);
    try {
      if (isEdit) {
        await API.updateCategory(editCategory!.id, { name, description });
      } else {
        await API.createCategory({ name, description });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const input: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1.5px solid #DDD8CC", background: "#FFFDF7", color: "#2C2A22",
    fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: 0.6,
    textTransform: "uppercase" as const, marginBottom: 6, display: "block",
  };

  return (
    <div onClick={saving ? undefined : onClose} style={{
      position: "fixed", inset: 0, zIndex: 999, background: "rgba(20,18,14,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(3px)", padding: 20, boxSizing: "border-box",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#FFFDF7", borderRadius: 18, width: "100%", maxWidth: 460, padding: 32,
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
      }}>
        <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 800, color: "#2C2A22", fontFamily: "'Georgia', serif" }}>
          {isEdit ? "✏️ Edit Category" : "📁 New Category"}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={lbl}>Category Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vedic Maths, Physics, Biology…"
              style={input} disabled={saving}
            />
          </div>
          <div>
            <label style={lbl}>Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this category…"
              rows={3}
              style={{ ...input, resize: "vertical", lineHeight: 1.5 }}
              disabled={saving}
            />
          </div>
        </div>

        {error && <p style={{ color: "#C0392B", fontSize: 13, marginTop: 12, marginBottom: 0 }}>⚠️ {error}</p>}

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={handleSubmit} disabled={saving} style={{
            flex: 1, padding: "12px 0", borderRadius: 10,
            background: saving ? "#AAA" : "#2C2A22",
            color: "#FFFDF7", border: "none", fontWeight: 800, fontSize: 15,
            cursor: saving ? "not-allowed" : "pointer",
          }}>
            {saving ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{ width: 14, height: 14, border: "2px solid #fff6", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                Saving…
              </span>
            ) : (isEdit ? "Save Changes" : "Create Category")}
          </button>
          <button onClick={saving ? undefined : onClose} style={{
            padding: "12px 20px", borderRadius: 10, background: "#F0EBE0", color: "#555",
            border: "none", fontWeight: 700, fontSize: 15, cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.5 : 1,
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Add / Edit Note Modal ────────────────────────────────────────────────────
function NoteFormModal({
  editNote, categories, onClose, onSaved,
}: {
  editNote?: Note | null; categories: Category[]; onClose: () => void; onSaved: () => void;
}) {
  const isEdit = !!editNote;
  const [title, setTitle] = useState(editNote?.title ?? "");
  const [label, setLabel] = useState(editNote?.label ?? "");
  const [type, setType] = useState<NoteType>(editNote?.type ?? "REAL");
  const [serialId, setSerialId] = useState<number>(editNote?.serialId ?? 1);
  const [categoryId, setCategoryId] = useState<string>(editNote?.categoryId ?? "");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [uploadPct, setUploadPct] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const currentPdfName = editNote?.storagePath ? storagePathToName(editNote.storagePath) : null;

  const handleSubmit = async () => {
    if (!title.trim()) return setError("Title is required.");
    if (!isEdit && !newFile) return setError("Please select a PDF file.");
    setError("");

    let pdfUrl = editNote?.pdfUrl;
    let storagePath = editNote?.storagePath;

    if (newFile) {
      setUploading(true);
      setUploadPct(0);
      try {
        const result = await uploadPdfToSupabase(newFile, setUploadPct);
        pdfUrl = result.pdfUrl;
        storagePath = result.storagePath;
      } catch (err) {
        setUploading(false);
        setError(err instanceof Error ? err.message : "Upload failed");
        return;
      }
      setUploading(false);
    }

    setSaving(true);
    try {
      const catId = categoryId || null;
      if (isEdit) {
        await API.updateNote(editNote!.id, { title, label, type, serialId, pdfUrl, storagePath, categoryId: catId });
      } else {
        await API.createNote({ title, label, type, serialId, pdfUrl: pdfUrl!, storagePath: storagePath!, categoryId: catId });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const isBusy = uploading || saving;

  const input: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1.5px solid #DDD8CC", background: "#FFFDF7", color: "#2C2A22",
    fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: 0.6,
    textTransform: "uppercase" as const, marginBottom: 6, display: "block",
  };

  return (
    <div onClick={isBusy ? undefined : onClose} style={{
      position: "fixed", inset: 0, zIndex: 999, background: "rgba(20,18,14,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(3px)", padding: 20, boxSizing: "border-box",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#FFFDF7", borderRadius: 18, width: "100%", maxWidth: 520, padding: 32,
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)", maxHeight: "90vh", overflowY: "auto",
      }}>
        <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 800, color: "#2C2A22", fontFamily: "'Georgia', serif" }}>
          {isEdit ? "✏️ Edit Note" : "➕ Add New Note"}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={lbl}>Serial ID (sort order)</label>
            <input type="number" min={1} value={serialId}
              onChange={(e) => setSerialId(Number(e.target.value))}
              style={{ ...input, width: 100 }} disabled={isBusy}
            />
          </div>

          <div>
            <label style={lbl}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 1 – Introduction"
              style={input} disabled={isBusy}
            />
          </div>

          <div>
            <label style={lbl}>Label (optional tag)</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Physics, Maths, Week 1…"
              style={input} disabled={isBusy}
            />
          </div>

          {/* Category selector */}
          <div>
            <label style={lbl}>Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isBusy}
              style={{ ...input, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 36, cursor: "pointer" }}
            >
              <option value="">— No category —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {categories.length === 0 && (
              <p style={{ fontSize: 11, color: "#AAA", marginTop: 4 }}>
                No categories yet. Create one in Manage Categories.
              </p>
            )}
          </div>

          <div>
            <label style={lbl}>Section</label>
            <div style={{ display: "flex", gap: 10 }}>
              {(["DEMO", "REAL"] as NoteType[]).map((t) => (
                <button key={t} onClick={() => !isBusy && setType(t)} style={{
                  flex: 1, padding: "10px 0", borderRadius: 8,
                  border: type === t ? "2px solid #2C2A22" : "2px solid #DDD8CC",
                  background: type === t ? "#2C2A22" : "#FAF7EE",
                  color: type === t ? "#FFFDF7" : "#555",
                  fontWeight: 700, fontSize: 14,
                  cursor: isBusy ? "not-allowed" : "pointer",
                  opacity: isBusy ? 0.6 : 1,
                }}>
                  {t === "DEMO" ? "🎓 Demo" : "📚 Real"}
                </button>
              ))}
            </div>
          </div>

          {/* PDF section */}
          <div>
            <label style={lbl}>PDF File</label>

            {uploading && newFile && <UploadProgress pct={uploadPct} filename={newFile.name} />}

            {isEdit && !newFile && !uploading && currentPdfName && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderRadius: 8,
                background: "#F0FBF3", border: "1.5px solid #8ED4A8", marginBottom: 8,
              }}>
                <span style={{ fontSize: 18 }}>📄</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1A7A3A" }}>Current PDF</div>
                  <div style={{ fontSize: 13, color: "#2C2A22", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentPdfName}</div>
                </div>
                <button onClick={() => fileRef.current?.click()} disabled={isBusy} style={{
                  padding: "5px 12px", borderRadius: 6, background: "#2C2A22", color: "#FFFDF7",
                  border: "none", fontSize: 11, fontWeight: 700, cursor: isBusy ? "not-allowed" : "pointer", flexShrink: 0,
                }}>Replace</button>
              </div>
            )}

            {newFile && !uploading && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderRadius: 8,
                background: "#EAF4FF", border: "1.5px solid #A8CCEE", marginBottom: 8,
              }}>
                <span style={{ fontSize: 18 }}>📋</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1A6FB5" }}>
                    {isEdit ? "New PDF (will replace current)" : "PDF selected"}
                  </div>
                  <div style={{ fontSize: 13, color: "#2C2A22", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{newFile.name}</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{(newFile.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                <button onClick={() => setNewFile(null)} style={{
                  padding: "5px 10px", borderRadius: 6, background: "#FDECEC", color: "#C0392B",
                  border: "1px solid #FFAAAA", fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0,
                }}>✕</button>
              </div>
            )}

            {!uploading && !(isEdit && !newFile && currentPdfName) && (
              <div onClick={() => !isBusy && fileRef.current?.click()} style={{
                border: "2px dashed #CCC8BE", borderRadius: 10, padding: "18px",
                cursor: isBusy ? "not-allowed" : "pointer",
                background: "#FAF7EE", color: "#888", fontSize: 13, fontWeight: 600, textAlign: "center",
                opacity: isBusy ? 0.5 : 1,
              }}>
                📂 Click to {isEdit ? "replace" : "select"} PDF
                <div style={{ fontSize: 11, marginTop: 4, color: "#BBB" }}>PDF only · No size limit</div>
              </div>
            )}

            <input ref={fileRef} type="file" accept="application/pdf" style={{ display: "none" }}
              onChange={(e) => { setNewFile(e.target.files?.[0] ?? null); e.target.value = ""; }}
            />
          </div>
        </div>

        {error && <p style={{ color: "#C0392B", fontSize: 13, marginTop: 12, marginBottom: 0 }}>⚠️ {error}</p>}

        {(uploading || saving) && (
          <p style={{ color: "#1A6FB5", fontSize: 13, marginTop: 10, marginBottom: 0, fontWeight: 600 }}>
            {uploading ? `⬆️ Uploading PDF… ${uploadPct}%` : "💾 Saving note…"}
          </p>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={handleSubmit} disabled={isBusy} style={{
            flex: 1, padding: "12px 0", borderRadius: 10,
            background: isBusy ? "#AAA" : "#2C2A22",
            color: "#FFFDF7", border: "none", fontWeight: 800, fontSize: 15,
            cursor: isBusy ? "not-allowed" : "pointer",
          }}>
            {uploading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{ width: 14, height: 14, border: "2px solid #fff6", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                Uploading… {uploadPct}%
              </span>
            ) : saving ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{ width: 14, height: 14, border: "2px solid #fff6", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                Saving…
              </span>
            ) : (isEdit ? "Save Changes" : "Upload Note")}
          </button>
          <button onClick={isBusy ? undefined : onClose} style={{
            padding: "12px 20px", borderRadius: 10, background: "#F0EBE0", color: "#555",
            border: "none", fontWeight: 700, fontSize: 15,
            cursor: isBusy ? "not-allowed" : "pointer", opacity: isBusy ? 0.5 : 1,
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Note Card ────────────────────────────────────────────────────────────────
function NoteCard({ note, onView, onEdit, onDelete }: {
  note: Note; onView: (n: Note) => void; onEdit: (n: Note) => void; onDelete: (n: Note) => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#FFF9EE" : "#FFFDF7", border: "1.5px solid #EEE9DC",
        borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center",
        gap: 14, transition: "all .15s ease", flexWrap: "wrap",
        boxShadow: hovered ? "0 4px 18px rgba(0,0,0,0.07)" : "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10, background: "#F5F0E4",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, fontSize: 13, color: "#8B7D5A", flexShrink: 0, border: "1.5px solid #E8E1CF",
      }}>
        #{note.serialId}
      </div>
      <div style={{
        width: 40, height: 40, borderRadius: 10, background: "#FFE8E8",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, flexShrink: 0, border: "1.5px solid #FFCCCC",
      }}>📄</div>
      <div style={{ flex: 1, minWidth: 140 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#2C2A22", marginBottom: 5 }}>{note.title}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <TypePill type={note.type} />
          {note.category && <CategoryBadge name={note.category.name} />}
          <Badge text={note.label} />
        </div>
      </div>
      <div style={{ fontSize: 11, color: "#AAA", flexShrink: 0, textAlign: "right", minWidth: 80 }}>
        {new Date(note.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
      </div>
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <ActionBtn label="View"   emoji="👁"  color="#1A6FB5" bg="#EAF4FF" onClick={() => onView(note)} />
        <ActionBtn label="Edit"   emoji="✏️"  color="#7A5C1A" bg="#FFF3CD" onClick={() => onEdit(note)} />
        <ActionBtn label="Delete" emoji="🗑"  color="#C0392B" bg="#FDECEC" onClick={() => onDelete(note)} />
      </div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteConfirmModal({ title, message, onClose, onConfirm, deleting }: {
  title: string; message: React.ReactNode;
  onClose: () => void; onConfirm: () => void; deleting: boolean;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1001, background: "rgba(20,18,14,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(3px)", padding: 20, boxSizing: "border-box",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#FFFDF7", borderRadius: 16, padding: 32, width: "100%", maxWidth: 420,
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)", textAlign: "center",
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: "#2C2A22" }}>{title}</h3>
        <p style={{ color: "#666", fontSize: 14, margin: "0 0 24px" }}>{message}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onConfirm} disabled={deleting} style={{
            padding: "10px 24px", borderRadius: 10, background: deleting ? "#AAA" : "#C0392B",
            color: "#fff", border: "none", fontWeight: 800, fontSize: 14,
            cursor: deleting ? "not-allowed" : "pointer",
          }}>
            {deleting ? "Deleting…" : "Yes, Delete"}
          </button>
          <button onClick={onClose} style={{
            padding: "10px 24px", borderRadius: 10, background: "#F0EBE0", color: "#555",
            border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Category Management Panel ────────────────────────────────────────────────
function CategoryPanel({
  categories, onAdd, onEdit, onDelete,
}: {
  categories: Category[];
  onAdd: () => void;
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
}) {
  return (
    <div style={{
      background: "#FAF7EE", border: "1.5px solid #EEE9DC", borderRadius: 14,
      padding: "20px 24px", marginBottom: 24,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#2C2A22", fontFamily: "'Georgia', serif" }}>
            📁 Manage Categories
          </h2>
          <p style={{ margin: "2px 0 0", color: "#999", fontSize: 12 }}>
            Organise your notes into folders
          </p>
        </div>
        <button onClick={onAdd} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
          background: "#6B35C8", color: "#fff", border: "none", fontWeight: 700, fontSize: 13,
          cursor: "pointer",
        }}>
          ＋ New Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "24px 0", color: "#CCC", fontSize: 13,
          border: "2px dashed #EEE9DC", borderRadius: 10,
        }}>
          No categories yet. Click ＋ New Category to create one.
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {categories.map((cat) => (
            <div key={cat.id} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 14px", borderRadius: 10,
              background: "#F3EEFF", border: "1.5px solid #C8A8F0",
            }}>
              <span style={{ fontSize: 16 }}>📁</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#2C2A22" }}>{cat.name}</div>
                <div style={{ fontSize: 11, color: "#888" }}>
                  {cat._count?.notes ?? 0} note{(cat._count?.notes ?? 0) !== 1 ? "s" : ""}
                  {cat.description ? ` · ${cat.description}` : ""}
                </div>
              </div>
              <div style={{ display: "flex", gap: 4, marginLeft: 4 }}>
                <button title="Edit" onClick={() => onEdit(cat)} style={{
                  padding: "4px 8px", borderRadius: 6, background: "#FFF3CD", color: "#7A5C1A",
                  border: "1px solid #F0D080", cursor: "pointer", fontSize: 12, fontWeight: 700,
                }}>✏️</button>
                <button title="Delete" onClick={() => onDelete(cat)} style={{
                  padding: "4px 8px", borderRadius: 6, background: "#FDECEC", color: "#C0392B",
                  border: "1px solid #FFAAAA", cursor: "pointer", fontSize: 12, fontWeight: 700,
                }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────
export default function NotesView() {
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<NoteType | "all">("all");
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [showCategoryPanel, setShowCategoryPanel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");

  // Modal states
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null | undefined>(undefined);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null | undefined>(undefined);
  const [deleting, setDeleting] = useState(false);

  const loadAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setLoadError("");
    try {
      const [notesData, catsData] = await Promise.all([
        API.listNotes(),
        API.listCategories(),
      ]);
      setAllNotes(notesData);
      setCategories(catsData);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleDeleteNote = async () => {
    if (!deletingNote) return;
    setDeleting(true);
    try {
      await API.deleteNote(deletingNote.id);
      setDeletingNote(null);
      loadAll(true);
    } catch { /* ignore */ }
    finally { setDeleting(false); }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    setDeleting(true);
    try {
      await API.deleteCategory(deletingCategory.id);
      if (activeCategoryId === deletingCategory.id) setActiveCategoryId("all");
      setDeletingCategory(null);
      loadAll(true);
    } catch { /* ignore */ }
    finally { setDeleting(false); }
  };

  // Filtering
  const filtered = allNotes
    .filter((n) => activeTab === "all" || n.type === activeTab)
    .filter((n) => {
      if (activeCategoryId === "all") return true;
      if (activeCategoryId === "uncategorized") return !n.categoryId;
      return n.categoryId === activeCategoryId;
    })
    .filter((n) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return n.title.toLowerCase().includes(q) || n.label.toLowerCase().includes(q);
    });

  const typeCounts = {
    all: allNotes.length,
    DEMO: allNotes.filter((n) => n.type === "DEMO").length,
    REAL: allNotes.filter((n) => n.type === "REAL").length,
  };

  const uncategorizedCount = allNotes.filter((n) => !n.categoryId).length;

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: 900, margin: "0 auto" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        marginBottom: 24, flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#2C2A22", fontFamily: "'Georgia', serif" }}>
            📚 Notes Library
          </h1>
          <p style={{ margin: "4px 0 0", color: "#999", fontSize: 13 }}>
            Upload and manage PDF notes for students
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => setShowCategoryPanel((v) => !v)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "11px 16px", borderRadius: 10,
            background: showCategoryPanel ? "#6B35C8" : "#F0EBE0",
            color: showCategoryPanel ? "#fff" : "#555",
            border: "1.5px solid #DDD8CC", fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}>
            📁 {showCategoryPanel ? "Hide" : "Manage"} Categories
          </button>
          <button onClick={() => loadAll(true)} disabled={refreshing} title="Refresh" style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "11px 16px", borderRadius: 10, background: "#F0EBE0", color: "#555",
            border: "1.5px solid #DDD8CC", fontWeight: 700, fontSize: 14,
            cursor: refreshing ? "not-allowed" : "pointer",
          }}>
            <span style={{ display: "inline-block", animation: refreshing ? "spin 0.7s linear infinite" : "none" }}>🔄</span>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          <button onClick={() => setEditingNote(null)} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 10,
            background: "#2C2A22", color: "#FFFDF7", border: "none", fontWeight: 800, fontSize: 14,
            cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}>
            ➕ Add Note
          </button>
        </div>
      </div>

      {/* Category Panel */}
      {showCategoryPanel && (
        <CategoryPanel
          categories={categories}
          onAdd={() => setEditingCategory(null)}
          onEdit={setEditingCategory}
          onDelete={setDeletingCategory}
        />
      )}

      {/* Category filter tabs */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#AAA", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 }}>
          Filter by Category
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => setActiveCategoryId("all")} style={{
            padding: "7px 16px", borderRadius: 30,
            background: activeCategoryId === "all" ? "#6B35C8" : "#F3EEFF",
            color: activeCategoryId === "all" ? "#fff" : "#6B35C8",
            border: "1.5px solid #C8A8F0", fontWeight: 700, fontSize: 12, cursor: "pointer",
          }}>
            📚 All
            <span style={{ marginLeft: 5, padding: "1px 6px", borderRadius: 8, background: activeCategoryId === "all" ? "rgba(255,255,255,0.25)" : "#C8A8F0", fontSize: 11, fontWeight: 800 }}>
              {allNotes.length}
            </span>
          </button>

          {categories.map((cat) => {
            const count = allNotes.filter((n) => n.categoryId === cat.id).length;
            const isActive = activeCategoryId === cat.id;
            return (
              <button key={cat.id} onClick={() => setActiveCategoryId(cat.id)} style={{
                padding: "7px 16px", borderRadius: 30,
                background: isActive ? "#6B35C8" : "#F3EEFF",
                color: isActive ? "#fff" : "#6B35C8",
                border: "1.5px solid #C8A8F0", fontWeight: 700, fontSize: 12, cursor: "pointer",
              }}>
                📁 {cat.name}
                <span style={{ marginLeft: 5, padding: "1px 6px", borderRadius: 8, background: isActive ? "rgba(255,255,255,0.25)" : "#C8A8F0", fontSize: 11, fontWeight: 800 }}>
                  {count}
                </span>
              </button>
            );
          })}

          {uncategorizedCount > 0 && (
            <button onClick={() => setActiveCategoryId("uncategorized")} style={{
              padding: "7px 16px", borderRadius: 30,
              background: activeCategoryId === "uncategorized" ? "#888" : "#F0EBE0",
              color: activeCategoryId === "uncategorized" ? "#fff" : "#888",
              border: "1.5px solid #DDD8CC", fontWeight: 700, fontSize: 12, cursor: "pointer",
            }}>
              📄 Uncategorized
              <span style={{ marginLeft: 5, padding: "1px 6px", borderRadius: 8, background: activeCategoryId === "uncategorized" ? "rgba(255,255,255,0.25)" : "#DDD8CC", fontSize: 11, fontWeight: 800 }}>
                {uncategorizedCount}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Type Tabs + Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {(["all", "DEMO", "REAL"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "8px 18px", borderRadius: 30,
            background: activeTab === tab ? "#2C2A22" : "#F0EBE0",
            color: activeTab === tab ? "#FFFDF7" : "#666",
            border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all .15s",
          }}>
            {tab === "all" ? "All" : tab === "DEMO" ? "🎓 Demo" : "📚 Real"}
            <span style={{
              marginLeft: 6, padding: "1px 7px", borderRadius: 10,
              background: activeTab === tab ? "rgba(255,255,255,0.2)" : "#DDD8CC",
              color: activeTab === tab ? "#fff" : "#888", fontSize: 11, fontWeight: 800,
            }}>
              {typeCounts[tab]}
            </span>
          </button>
        ))}
        <div style={{ marginLeft: "auto", position: "relative" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search by title or label…"
            style={{
              padding: "8px 36px 8px 14px", border: "1.5px solid #DDD8CC", borderRadius: 30,
              background: "#FAF7EE", color: "#2C2A22", fontSize: 13, outline: "none",
              fontFamily: "inherit", minWidth: 220,
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", color: "#AAA", fontSize: 14, padding: 0,
            }}>✕</button>
          )}
        </div>
      </div>

      {search.trim() && !loading && (
        <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
          {filtered.length === 0
            ? `No results for "${search}"`
            : `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`}
        </div>
      )}

      {loadError && (
        <div style={{
          padding: "16px 20px", borderRadius: 12, background: "#FFF0F0",
          border: "1.5px solid #FFCCCC", color: "#C0392B", fontSize: 14, marginBottom: 16,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <span>⚠️ {loadError}</span>
          <button onClick={() => loadAll()} style={{
            padding: "6px 14px", borderRadius: 8, background: "#C0392B", color: "#fff",
            border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer",
          }}>Retry</button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#BBB", fontSize: 15 }}>
          <div style={{ width: 32, height: 32, border: "3px solid #DDD", borderTopColor: "#888", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          Loading…
        </div>
      ) : filtered.length === 0 && !loadError ? (
        <div style={{
          textAlign: "center", padding: "60px 0", color: "#CCC", fontSize: 15,
          border: "2px dashed #EEE9DC", borderRadius: 14,
        }}>
          {search.trim()
            ? `No notes match "${search}".`
            : activeCategoryId !== "all"
              ? "No notes in this category yet."
              : "No notes yet. Click ➕ Add Note to get started."}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((note) => (
            <NoteCard key={note.id} note={note}
              onView={setViewingNote} onEdit={setEditingNote} onDelete={setDeletingNote}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {viewingNote && (
        <PdfModal url={viewingNote.pdfUrl} title={viewingNote.title} onClose={() => setViewingNote(null)} />
      )}
      {editingNote !== undefined && (
        <NoteFormModal
          editNote={editingNote}
          categories={categories}
          onClose={() => setEditingNote(undefined)}
          onSaved={() => loadAll(true)}
        />
      )}
      {deletingNote && (
        <DeleteConfirmModal
          title="Delete Note?"
          message={<>"{deletingNote.title}" will be permanently deleted along with its PDF.</>}
          onClose={() => setDeletingNote(null)}
          onConfirm={handleDeleteNote}
          deleting={deleting}
        />
      )}
      {editingCategory !== undefined && (
        <CategoryFormModal
          editCategory={editingCategory}
          onClose={() => setEditingCategory(undefined)}
          onSaved={() => loadAll(true)}
        />
      )}
      {deletingCategory && (
        <DeleteConfirmModal
          title="Delete Category?"
          message={
            <>
              "<strong>{deletingCategory.name}</strong>" will be deleted.{" "}
              {(deletingCategory._count?.notes ?? 0) > 0
                ? `${deletingCategory._count!.notes} note(s) will become uncategorized.`
                : ""}
            </>
          }
          onClose={() => setDeletingCategory(null)}
          onConfirm={handleDeleteCategory}
          deleting={deleting}
        />
      )}
    </div>
  );
}