




// "use client";

// import { useEffect, useRef, useState } from "react";
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

// async function getAuthHeaders(): Promise<Record<string, string>> {
//   const { data: { session } } = await supabase.auth.getSession();
//   return { Authorization: `Bearer ${session?.access_token ?? ""}` };
// }

// const API = {
//   list: async (type?: NoteType, search?: string): Promise<Note[]> => {
//     const params = new URLSearchParams();
//     if (type) params.set("type", type);
//     if (search) params.set("search", search);
//     const headers = await getAuthHeaders();
//     const res = await fetch(`/api/admin/notes?${params.toString()}`, { headers });
//     const json = await res.json();
//     if (!res.ok) throw new Error(json.error);
//     return json.notes as Note[];
//   },

//   create: async (
//     fields: { title: string; label: string; type: NoteType; serialId: number },
//     file: File
//   ): Promise<Note> => {
//     const fd = new FormData();
//     fd.append("file", file);
//     fd.append("title", fields.title);
//     fd.append("label", fields.label);
//     fd.append("type", fields.type);
//     fd.append("serialId", String(fields.serialId));
//     const headers = await getAuthHeaders();
//     const res = await fetch("/api/admin/notes", { method: "POST", headers, body: fd });
//     const json = await res.json();
//     if (!res.ok) throw new Error(json.error);
//     return json.note as Note;
//   },

//   update: async (
//     id: string,
//     fields: { title?: string; label?: string; type?: NoteType; serialId?: number },
//     file?: File | null
//   ): Promise<Note> => {
//     const fd = new FormData();
//     // Always send all fields
//     if (fields.title !== undefined) fd.append("title", fields.title);
//     if (fields.label !== undefined) fd.append("label", fields.label);
//     if (fields.type !== undefined) fd.append("type", fields.type);
//     if (fields.serialId !== undefined) fd.append("serialId", String(fields.serialId));
//     // Only append file if a new one was chosen
//     if (file) fd.append("file", file);
//     const headers = await getAuthHeaders();
//     const res = await fetch(`/api/admin/notes/${id}`, { method: "PATCH", headers, body: fd });
//     // Handle non-JSON or empty responses gracefully
//     const text = await res.text();
//     let json: { note?: Note; error?: string } = {};
//     try { json = JSON.parse(text); } catch { /* empty body */ }
//     if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
//     return json.note as Note;
//   },

//   delete: async (id: string): Promise<void> => {
//     const headers = await getAuthHeaders();
//     const res = await fetch(`/api/admin/notes/${id}`, { method: "DELETE", headers });
//     if (!res.ok) {
//       const json = await res.json();
//       throw new Error(json.error);
//     }
//   },
// };

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// // Extract a readable filename from a Supabase storage path like "1234567890-My_File.pdf"
// function storagePathToName(storagePath: string): string {
//   // Remove the timestamp prefix (digits + dash)
//   return storagePath.replace(/^\d+-/, "").replace(/_/g, " ");
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
//       position: "fixed", inset: 0, zIndex: 1000,
//       background: "rgba(20,18,14,0.80)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       backdropFilter: "blur(6px)", padding: 20, boxSizing: "border-box",
//     }}>
//       <div onClick={(e) => e.stopPropagation()} style={{
//         background: "#FFFDF7", borderRadius: 16,
//         width: "100%", maxWidth: 960,
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
//             fontWeight: 700, fontSize: 15, color: "#2C2A22",
//             fontFamily: "'Georgia', serif",
//             overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
//           }}>
//             📄 {title}
//           </span>
//           <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
//             <a href={url} target="_blank" rel="noopener noreferrer" style={{
//               padding: "7px 16px", borderRadius: 8,
//               background: "#2C2A22", color: "#FFFDF7",
//               fontSize: 12, fontWeight: 600, textDecoration: "none",
//             }}>
//               Open in Tab ↗
//             </a>
//             <button onClick={onClose} style={{
//               padding: "7px 16px", borderRadius: 8,
//               background: "#F0EBE0", color: "#555",
//               border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
//             }}>
//               ✕ Close
//             </button>
//           </div>
//         </div>
//         <div style={{ flex: 1, position: "relative", background: "#525659", overflow: "hidden" }}>
//           {loading && !loadError && (
//             <div style={{
//               position: "absolute", inset: 0,
//               display: "flex", flexDirection: "column",
//               alignItems: "center", justifyContent: "center",
//               color: "#CCC", fontSize: 14, gap: 12, zIndex: 1,
//             }}>
//               <div style={{
//                 width: 36, height: 36,
//                 border: "3px solid #666", borderTopColor: "#FFF",
//                 borderRadius: "50%", animation: "spin 0.8s linear infinite",
//               }} />
//               <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//               Loading PDF…
//             </div>
//           )}
//           {loadError ? (
//             <div style={{
//               position: "absolute", inset: 0,
//               display: "flex", flexDirection: "column",
//               alignItems: "center", justifyContent: "center",
//               color: "#EEE", gap: 16, padding: 32, textAlign: "center",
//             }}>
//               <div style={{ fontSize: 48 }}>⚠️</div>
//               <div style={{ fontSize: 16, fontWeight: 700 }}>PDF could not be loaded</div>
//               <a href={url} target="_blank" rel="noopener noreferrer" style={{
//                 padding: "10px 24px", borderRadius: 8,
//                 background: "#2C2A22", color: "#FFFDF7",
//                 fontSize: 13, fontWeight: 600, textDecoration: "none",
//               }}>
//                 Open in Tab ↗
//               </a>
//             </div>
//           ) : (
//             <iframe
//               key={url}
//               src={url}
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

// // ─── Add / Edit Modal ─────────────────────────────────────────────────────────
// interface NoteFormModalProps {
//   editNote?: Note | null;
//   onClose: () => void;
//   onSaved: () => void;
// }

// function NoteFormModal({ editNote, onClose, onSaved }: NoteFormModalProps) {
//   const isEdit = !!editNote;

//   const [title, setTitle] = useState(editNote?.title ?? "");
//   const [label, setLabel] = useState(editNote?.label ?? "");
//   const [type, setType] = useState<NoteType>(editNote?.type ?? "REAL");
//   const [serialId, setSerialId] = useState<number>(editNote?.serialId ?? 1);

//   // null  = no new file chosen (keep existing in edit mode)
//   // File  = user picked a new file
//   const [newFile, setNewFile] = useState<File | null>(null);

//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const fileRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => { document.body.style.overflow = ""; };
//   }, []);

//   // Derive the display label for the current/chosen PDF
//   const currentPdfName = editNote?.storagePath
//     ? storagePathToName(editNote.storagePath)
//     : null;

//   const handleSubmit = async () => {
//     if (!title.trim()) return setError("Title is required.");
//     if (!isEdit && !newFile) return setError("Please upload a PDF.");
//     setSaving(true);
//     setError("");
//     try {
//       if (isEdit) {
//         // newFile is null → server keeps existing PDF; newFile is set → server replaces it
//         await API.update(editNote!.id, { title, label, type, serialId }, newFile);
//       } else {
//         await API.create({ title, label, type, serialId }, newFile!);
//       }
//       onSaved();
//       onClose();
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : "Something went wrong.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const inputStyle: React.CSSProperties = {
//     width: "100%", padding: "10px 14px", borderRadius: 8,
//     border: "1.5px solid #DDD8CC", background: "#FFFDF7", color: "#2C2A22",
//     fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
//   };
//   const labelStyle: React.CSSProperties = {
//     fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: 0.6,
//     textTransform: "uppercase", marginBottom: 6, display: "block",
//   };

//   return (
//     <div onClick={onClose} style={{
//       position: "fixed", inset: 0, zIndex: 999,
//       background: "rgba(20,18,14,0.6)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       backdropFilter: "blur(3px)", padding: 20, boxSizing: "border-box",
//     }}>
//       <div onClick={(e) => e.stopPropagation()} style={{
//         background: "#FFFDF7", borderRadius: 18,
//         width: "100%", maxWidth: 520, padding: 32,
//         boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
//         maxHeight: "90vh", overflowY: "auto",
//       }}>
//         <h2 style={{
//           margin: "0 0 24px", fontSize: 20, fontWeight: 800, color: "#2C2A22",
//           fontFamily: "'Georgia', serif",
//         }}>
//           {isEdit ? "✏️ Edit Note" : "➕ Add New Note"}
//         </h2>

//         <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//           <div>
//             <label style={labelStyle}>Serial ID (sort order)</label>
//             <input
//               type="number" min={1} value={serialId}
//               onChange={(e) => setSerialId(Number(e.target.value))}
//               style={{ ...inputStyle, width: 100 }}
//             />
//           </div>

//           <div>
//             <label style={labelStyle}>Title</label>
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="e.g. Chapter 1 – Introduction"
//               style={inputStyle}
//             />
//           </div>

//           <div>
//             <label style={labelStyle}>Label (optional tag)</label>
//             <input
//               value={label}
//               onChange={(e) => setLabel(e.target.value)}
//               placeholder="e.g. Physics, Maths, Important…"
//               style={inputStyle}
//             />
//           </div>

//           <div>
//             <label style={labelStyle}>Section</label>
//             <div style={{ display: "flex", gap: 10 }}>
//               {(["DEMO", "REAL"] as NoteType[]).map((t) => (
//                 <button key={t} onClick={() => setType(t)} style={{
//                   flex: 1, padding: "10px 0", borderRadius: 8,
//                   border: type === t ? "2px solid #2C2A22" : "2px solid #DDD8CC",
//                   background: type === t ? "#2C2A22" : "#FAF7EE",
//                   color: type === t ? "#FFFDF7" : "#555",
//                   fontWeight: 700, fontSize: 14, cursor: "pointer",
//                 }}>
//                   {t === "DEMO" ? "🎓 Demo" : "📚 Real"}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* PDF Upload — shows current file when editing */}
//           <div>
//             <label style={labelStyle}>PDF File</label>

//             {/* Current PDF indicator (edit mode only, when no new file chosen) */}
//             {isEdit && !newFile && currentPdfName && (
//               <div style={{
//                 display: "flex", alignItems: "center", gap: 10,
//                 padding: "10px 14px", borderRadius: 8,
//                 background: "#F0FBF3", border: "1.5px solid #8ED4A8",
//                 marginBottom: 8,
//               }}>
//                 <span style={{ fontSize: 18 }}>📄</span>
//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <div style={{ fontSize: 12, fontWeight: 700, color: "#1A7A3A" }}>
//                     Current PDF
//                   </div>
//                   <div style={{
//                     fontSize: 13, color: "#2C2A22",
//                     overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
//                   }}>
//                     {currentPdfName}
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => fileRef.current?.click()}
//                   style={{
//                     padding: "5px 12px", borderRadius: 6,
//                     background: "#2C2A22", color: "#FFFDF7",
//                     border: "none", fontSize: 11, fontWeight: 700,
//                     cursor: "pointer", flexShrink: 0,
//                   }}
//                 >
//                   Replace
//                 </button>
//               </div>
//             )}

//             {/* New file chosen */}
//             {newFile && (
//               <div style={{
//                 display: "flex", alignItems: "center", gap: 10,
//                 padding: "10px 14px", borderRadius: 8,
//                 background: "#EAF4FF", border: "1.5px solid #A8CCEE",
//                 marginBottom: 8,
//               }}>
//                 <span style={{ fontSize: 18 }}>📋</span>
//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <div style={{ fontSize: 12, fontWeight: 700, color: "#1A6FB5" }}>
//                     New PDF selected {isEdit && "(will replace current)"}
//                   </div>
//                   <div style={{
//                     fontSize: 13, color: "#2C2A22",
//                     overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
//                   }}>
//                     {newFile.name}
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setNewFile(null)}
//                   title="Remove new file"
//                   style={{
//                     padding: "5px 10px", borderRadius: 6,
//                     background: "#FDECEC", color: "#C0392B",
//                     border: "1px solid #FFAAAA", fontSize: 11, fontWeight: 700,
//                     cursor: "pointer", flexShrink: 0,
//                   }}
//                 >
//                   ✕
//                 </button>
//               </div>
//             )}

//             {/* Drop zone — shown when adding new, or replacing in edit mode */}
//             {(!isEdit || newFile === null) && (
//               <div
//                 onClick={() => fileRef.current?.click()}
//                 style={{
//                   border: "2px dashed #CCC8BE", borderRadius: 10,
//                   padding: "16px", cursor: "pointer",
//                   background: "#FAF7EE", color: "#888",
//                   fontSize: 13, fontWeight: 600, textAlign: "center",
//                   transition: "background .15s",
//                   display: isEdit && !newFile ? "none" : "block", // hide when showing "Replace" btn
//                 }}
//               >
//                 📂 Click to {isEdit ? "replace" : "select"} PDF
//               </div>
//             )}

//             <input
//               ref={fileRef} type="file" accept="application/pdf"
//               style={{ display: "none" }}
//               onChange={(e) => {
//                 const f = e.target.files?.[0] ?? null;
//                 setNewFile(f);
//                 // Reset input so same file can be re-selected if needed
//                 e.target.value = "";
//               }}
//             />
//           </div>
//         </div>

//         {error && (
//           <p style={{ color: "#C0392B", fontSize: 13, marginTop: 12, marginBottom: 0 }}>
//             ⚠️ {error}
//           </p>
//         )}

//         <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
//           <button
//             onClick={handleSubmit}
//             disabled={saving}
//             style={{
//               flex: 1, padding: "12px 0", borderRadius: 10,
//               background: saving ? "#AAA" : "#2C2A22",
//               color: "#FFFDF7", border: "none",
//               fontWeight: 800, fontSize: 15,
//               cursor: saving ? "not-allowed" : "pointer",
//             }}
//           >
//             {saving ? "Saving…" : isEdit ? "Save Changes" : "Upload Note"}
//           </button>
//           <button onClick={onClose} style={{
//             padding: "12px 20px", borderRadius: 10,
//             background: "#F0EBE0", color: "#555",
//             border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer",
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
//   note: Note;
//   onView: (n: Note) => void;
//   onEdit: (n: Note) => void;
//   onDelete: (n: Note) => void;
// }) {
//   const [hovered, setHovered] = useState(false);
//   return (
//     <div
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{
//         background: hovered ? "#FFF9EE" : "#FFFDF7",
//         border: "1.5px solid #EEE9DC", borderRadius: 14,
//         padding: "16px 20px", display: "flex", alignItems: "center",
//         gap: 14, transition: "all .15s ease", flexWrap: "wrap",
//         boxShadow: hovered ? "0 4px 18px rgba(0,0,0,0.07)" : "0 1px 4px rgba(0,0,0,0.04)",
//       }}
//     >
//       <div style={{
//         width: 38, height: 38, borderRadius: 10,
//         background: "#F5F0E4", display: "flex", alignItems: "center",
//         justifyContent: "center", fontWeight: 800, fontSize: 13,
//         color: "#8B7D5A", flexShrink: 0, border: "1.5px solid #E8E1CF",
//       }}>
//         #{note.serialId}
//       </div>
//       <div style={{
//         width: 40, height: 40, borderRadius: 10,
//         background: "#FFE8E8", display: "flex", alignItems: "center",
//         justifyContent: "center", fontSize: 20, flexShrink: 0,
//         border: "1.5px solid #FFCCCC",
//       }}>
//         📄
//       </div>
//       <div style={{ flex: 1, minWidth: 140 }}>
//         <div style={{ fontWeight: 700, fontSize: 15, color: "#2C2A22", marginBottom: 5 }}>
//           {note.title}
//         </div>
//         <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//           <TypePill type={note.type} />
//           <Badge text={note.label} />
//         </div>
//       </div>
//       <div style={{ fontSize: 11, color: "#AAA", flexShrink: 0, textAlign: "right", minWidth: 80 }}>
//         {new Date(note.createdAt).toLocaleDateString("en-IN", {
//           day: "2-digit", month: "short", year: "numeric",
//         })}
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
//     <button
//       title={label} onClick={onClick}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{
//         display: "flex", alignItems: "center", gap: 4,
//         padding: "6px 12px", borderRadius: 8,
//         background: hovered ? color : bg,
//         color: hovered ? "#fff" : color,
//         border: `1.5px solid ${color}22`,
//         cursor: "pointer", fontWeight: 700, fontSize: 12,
//         transition: "all .15s", whiteSpace: "nowrap",
//       }}
//     >
//       {emoji} {label}
//     </button>
//   );
// }

// // ─── Delete Confirm Modal ─────────────────────────────────────────────────────
// function DeleteConfirmModal({ note, onClose, onConfirm, deleting }: {
//   note: Note; onClose: () => void; onConfirm: () => void; deleting: boolean;
// }) {
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => { document.body.style.overflow = ""; };
//   }, []);

//   return (
//     <div onClick={onClose} style={{
//       position: "fixed", inset: 0, zIndex: 1001,
//       background: "rgba(20,18,14,0.6)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       backdropFilter: "blur(3px)", padding: 20, boxSizing: "border-box",
//     }}>
//       <div onClick={(e) => e.stopPropagation()} style={{
//         background: "#FFFDF7", borderRadius: 16, padding: 32,
//         width: "100%", maxWidth: 420,
//         boxShadow: "0 20px 60px rgba(0,0,0,0.25)", textAlign: "center",
//       }}>
//         <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
//         <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: "#2C2A22" }}>
//           Delete Note?
//         </h3>
//         <p style={{ color: "#666", fontSize: 14, margin: "0 0 24px" }}>
//           "<strong>{note.title}</strong>" will be permanently deleted along with its PDF.
//         </p>
//         <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
//           <button onClick={onConfirm} disabled={deleting} style={{
//             padding: "10px 24px", borderRadius: 10,
//             background: deleting ? "#AAA" : "#C0392B",
//             color: "#fff", border: "none",
//             fontWeight: 800, fontSize: 14, cursor: deleting ? "not-allowed" : "pointer",
//           }}>
//             {deleting ? "Deleting…" : "Yes, Delete"}
//           </button>
//           <button onClick={onClose} style={{
//             padding: "10px 24px", borderRadius: 10,
//             background: "#F0EBE0", color: "#555",
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
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [activeTab, setActiveTab] = useState<NoteType | "all">("all");
//   const [loading, setLoading] = useState(true);
//   const [viewingNote, setViewingNote] = useState<Note | null>(null);
//   const [editingNote, setEditingNote] = useState<Note | null | undefined>(undefined);
//   const [deletingNote, setDeletingNote] = useState<Note | null>(null);
//   const [deleting, setDeleting] = useState(false);
//   const [search, setSearch] = useState("");

//   const loadNotes = async () => {
//     setLoading(true);
//     try {
//       const data = await API.list();
//       setNotes(data);
//     } catch { /* ignore */ }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { loadNotes(); }, []);

//   const handleDelete = async () => {
//     if (!deletingNote) return;
//     setDeleting(true);
//     try {
//       await API.delete(deletingNote.id);
//       setDeletingNote(null);
//       loadNotes();
//     } catch { /* ignore */ }
//     finally { setDeleting(false); }
//   };

//   const filtered = notes
//     .filter((n) => activeTab === "all" || n.type === activeTab)
//     .filter((n) =>
//       !search.trim() ||
//       n.title.toLowerCase().includes(search.toLowerCase()) ||
//       n.label.toLowerCase().includes(search.toLowerCase())
//     );

//   const counts = {
//     all: notes.length,
//     DEMO: notes.filter((n) => n.type === "DEMO").length,
//     REAL: notes.filter((n) => n.type === "REAL").length,
//   };

//   return (
//     <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: 860, margin: "0 auto" }}>
//       <div style={{
//         display: "flex", justifyContent: "space-between", alignItems: "flex-start",
//         marginBottom: 24, flexWrap: "wrap", gap: 12,
//       }}>
//         <div>
//           <h1 style={{
//             margin: 0, fontSize: 26, fontWeight: 900, color: "#2C2A22",
//             fontFamily: "'Georgia', serif",
//           }}>
//             📚 Notes Library
//           </h1>
//           <p style={{ margin: "4px 0 0", color: "#999", fontSize: 13 }}>
//             Upload and manage PDF notes for students
//           </p>
//         </div>
//         <button onClick={() => setEditingNote(null)} style={{
//           display: "flex", alignItems: "center", gap: 8,
//           padding: "11px 20px", borderRadius: 10,
//           background: "#2C2A22", color: "#FFFDF7",
//           border: "none", fontWeight: 800, fontSize: 14,
//           cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//         }}>
//           ➕ Add Note
//         </button>
//       </div>

//       <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
//         {(["all", "DEMO", "REAL"] as const).map((tab) => (
//           <button key={tab} onClick={() => setActiveTab(tab)} style={{
//             padding: "8px 18px", borderRadius: 30,
//             background: activeTab === tab ? "#2C2A22" : "#F0EBE0",
//             color: activeTab === tab ? "#FFFDF7" : "#666",
//             border: "none", fontWeight: 700, fontSize: 13,
//             cursor: "pointer", transition: "all .15s",
//           }}>
//             {tab === "all" ? "All" : tab === "DEMO" ? "🎓 Demo" : "📚 Real"}
//             <span style={{
//               marginLeft: 6, padding: "1px 7px", borderRadius: 10,
//               background: activeTab === tab ? "rgba(255,255,255,0.2)" : "#DDD8CC",
//               color: activeTab === tab ? "#fff" : "#888",
//               fontSize: 11, fontWeight: 800,
//             }}>
//               {counts[tab]}
//             </span>
//           </button>
//         ))}
//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="🔍  Search by title or label…"
//           style={{
//             marginLeft: "auto", padding: "8px 14px",
//             border: "1.5px solid #DDD8CC", borderRadius: 30,
//             background: "#FAF7EE", color: "#2C2A22",
//             fontSize: 13, outline: "none", fontFamily: "inherit", minWidth: 200,
//           }}
//         />
//       </div>

//       {loading ? (
//         <div style={{ textAlign: "center", padding: "60px 0", color: "#BBB", fontSize: 15 }}>
//           Loading notes…
//         </div>
//       ) : filtered.length === 0 ? (
//         <div style={{
//           textAlign: "center", padding: "60px 0",
//           color: "#CCC", fontSize: 15,
//           border: "2px dashed #EEE9DC", borderRadius: 14,
//         }}>
//           {search ? "No notes match your search." : "No notes yet. Click ➕ Add Note to get started."}
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           {filtered.map((note) => (
//             <NoteCard
//               key={note.id} note={note}
//               onView={setViewingNote}
//               onEdit={setEditingNote}
//               onDelete={setDeletingNote}
//             />
//           ))}
//         </div>
//       )}

//       {viewingNote && (
//         <PdfModal url={viewingNote.pdfUrl} title={viewingNote.title} onClose={() => setViewingNote(null)} />
//       )}
//       {editingNote !== undefined && (
//         <NoteFormModal editNote={editingNote} onClose={() => setEditingNote(undefined)} onSaved={loadNotes} />
//       )}
//       {deletingNote && (
//         <DeleteConfirmModal
//           note={deletingNote}
//           onClose={() => setDeletingNote(null)}
//           onConfirm={handleDelete}
//           deleting={deleting}
//         />
//       )}
//     </div>
//   );
// }













"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// ─── Types ────────────────────────────────────────────────────────────────────
type NoteType = "DEMO" | "REAL";

interface Note {
  id: string;
  serialId: number;
  title: string;
  label: string;
  type: NoteType;
  pdfUrl: string;
  storagePath: string;
  createdAt: string;
  updatedAt: string;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  return { Authorization: `Bearer ${session?.access_token ?? ""}` };
}

// ─── API helpers ──────────────────────────────────────────────────────────────
const API = {
  list: async (search?: string): Promise<Note[]> => {
    const params = new URLSearchParams();
    if (search?.trim()) params.set("search", search.trim());
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/admin/notes?${params.toString()}`, { headers });
    const text = await res.text();
    let json: { notes?: Note[]; error?: string } = {};
    try { json = JSON.parse(text); } catch { throw new Error("Invalid server response"); }
    if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
    return json.notes ?? [];
  },

  create: async (
    fields: { title: string; label: string; type: NoteType; serialId: number },
    file: File
  ): Promise<Note> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", fields.title);
    fd.append("label", fields.label);
    fd.append("type", fields.type);
    fd.append("serialId", String(fields.serialId));
    const headers = await getAuthHeaders();
    const res = await fetch("/api/admin/notes", { method: "POST", headers, body: fd });
    const text = await res.text();
    let json: { note?: Note; error?: string } = {};
    try { json = JSON.parse(text); } catch { throw new Error(`Server error ${res.status}: ${text.slice(0, 100)}`); }
    if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
    return json.note as Note;
  },

  update: async (
    id: string,
    fields: { title?: string; label?: string; type?: NoteType; serialId?: number },
    file?: File | null
  ): Promise<Note> => {
    const fd = new FormData();
    if (fields.title !== undefined) fd.append("title", fields.title);
    if (fields.label !== undefined) fd.append("label", fields.label);
    if (fields.type !== undefined) fd.append("type", fields.type);
    if (fields.serialId !== undefined) fd.append("serialId", String(fields.serialId));
    if (file) fd.append("file", file);
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/admin/notes/${id}`, { method: "PATCH", headers, body: fd });
    const text = await res.text();
    let json: { note?: Note; error?: string } = {};
    try { json = JSON.parse(text); } catch { throw new Error(`Server error ${res.status}: ${text.slice(0, 100)}`); }
    if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
    return json.note as Note;
  },

  delete: async (id: string): Promise<void> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/admin/notes/${id}`, { method: "DELETE", headers });
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
  // Strip leading folder prefix and timestamp: "notes/1234567890-My_File.pdf" → "My File.pdf"
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
    }}>
      {text}
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
      letterSpacing: 0.5, textTransform: "uppercase",
    }}>
      {isDemo ? "Demo" : "Real"}
    </span>
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
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(20,18,14,0.82)",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(6px)", padding: 20, boxSizing: "border-box",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#FFFDF7", borderRadius: 16,
        width: "100%", maxWidth: 960,
        height: "calc(100vh - 40px)", maxHeight: 860,
        display: "flex", flexDirection: "column",
        overflow: "hidden", boxShadow: "0 32px 100px rgba(0,0,0,0.45)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px", borderBottom: "1px solid #EEE9DC",
          background: "#FAF7EE", flexShrink: 0, gap: 12,
        }}>
          <span style={{
            fontWeight: 700, fontSize: 15, color: "#2C2A22",
            fontFamily: "'Georgia', serif",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
          }}>
            📄 {title}
          </span>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <a href={url} target="_blank" rel="noopener noreferrer" style={{
              padding: "7px 16px", borderRadius: 8,
              background: "#2C2A22", color: "#FFFDF7",
              fontSize: 12, fontWeight: 600, textDecoration: "none",
            }}>
              Open in Tab ↗
            </a>
            <button onClick={onClose} style={{
              padding: "7px 16px", borderRadius: 8,
              background: "#F0EBE0", color: "#555",
              border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            }}>
              ✕ Close
            </button>
          </div>
        </div>

        {/* PDF body */}
        <div style={{ flex: 1, position: "relative", background: "#525659", overflow: "hidden" }}>
          {loading && !loadError && (
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              flexDirection: "column", alignItems: "center", justifyContent: "center",
              color: "#CCC", fontSize: 14, gap: 12, zIndex: 1,
            }}>
              <div style={{
                width: 36, height: 36, border: "3px solid #666", borderTopColor: "#FFF",
                borderRadius: "50%", animation: "spin 0.8s linear infinite",
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              Loading PDF…
            </div>
          )}
          {loadError ? (
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              flexDirection: "column", alignItems: "center", justifyContent: "center",
              color: "#EEE", gap: 16, padding: 32, textAlign: "center",
            }}>
              <div style={{ fontSize: 48 }}>⚠️</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>PDF could not be loaded</div>
              <a href={url} target="_blank" rel="noopener noreferrer" style={{
                padding: "10px 24px", borderRadius: 8,
                background: "#2C2A22", color: "#FFFDF7",
                fontSize: 13, fontWeight: 600, textDecoration: "none",
              }}>
                Open in Tab ↗
              </a>
            </div>
          ) : (
            <iframe
              key={url} src={url}
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

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
function NoteFormModal({
  editNote, onClose, onSaved,
}: {
  editNote?: Note | null; onClose: () => void; onSaved: () => void;
}) {
  const isEdit = !!editNote;
  const [title, setTitle] = useState(editNote?.title ?? "");
  const [label, setLabel] = useState(editNote?.label ?? "");
  const [type, setType] = useState<NoteType>(editNote?.type ?? "REAL");
  const [serialId, setSerialId] = useState<number>(editNote?.serialId ?? 1);
  const [newFile, setNewFile] = useState<File | null>(null);
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
    if (!isEdit && !newFile) return setError("Please upload a PDF.");
    setSaving(true);
    setError("");
    try {
      if (isEdit) {
        await API.update(editNote!.id, { title, label, type, serialId }, newFile);
      } else {
        await API.create({ title, label, type, serialId }, newFile!);
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
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
    textTransform: "uppercase", marginBottom: 6, display: "block",
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(20,18,14,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(3px)", padding: 20, boxSizing: "border-box",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#FFFDF7", borderRadius: 18,
        width: "100%", maxWidth: 520, padding: 32,
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 800, color: "#2C2A22", fontFamily: "'Georgia', serif" }}>
          {isEdit ? "✏️ Edit Note" : "➕ Add New Note"}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Serial ID */}
          <div>
            <label style={lbl}>Serial ID (sort order)</label>
            <input type="number" min={1} value={serialId}
              onChange={(e) => setSerialId(Number(e.target.value))}
              style={{ ...input, width: 100 }}
            />
          </div>

          {/* Title */}
          <div>
            <label style={lbl}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 1 – Introduction" style={input} />
          </div>

          {/* Label */}
          <div>
            <label style={lbl}>Label (optional tag)</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Physics, Maths, week1…" style={input} />
          </div>

          {/* Section */}
          <div>
            <label style={lbl}>Section</label>
            <div style={{ display: "flex", gap: 10 }}>
              {(["DEMO", "REAL"] as NoteType[]).map((t) => (
                <button key={t} onClick={() => setType(t)} style={{
                  flex: 1, padding: "10px 0", borderRadius: 8,
                  border: type === t ? "2px solid #2C2A22" : "2px solid #DDD8CC",
                  background: type === t ? "#2C2A22" : "#FAF7EE",
                  color: type === t ? "#FFFDF7" : "#555",
                  fontWeight: 700, fontSize: 14, cursor: "pointer",
                }}>
                  {t === "DEMO" ? "🎓 Demo" : "📚 Real"}
                </button>
              ))}
            </div>
          </div>

          {/* PDF */}
          <div>
            <label style={lbl}>PDF File</label>

            {/* Current PDF (edit mode, no new file yet) */}
            {isEdit && !newFile && currentPdfName && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderRadius: 8,
                background: "#F0FBF3", border: "1.5px solid #8ED4A8", marginBottom: 8,
              }}>
                <span style={{ fontSize: 18 }}>📄</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1A7A3A" }}>Current PDF</div>
                  <div style={{ fontSize: 13, color: "#2C2A22", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {currentPdfName}
                  </div>
                </div>
                <button onClick={() => fileRef.current?.click()} style={{
                  padding: "5px 12px", borderRadius: 6,
                  background: "#2C2A22", color: "#FFFDF7",
                  border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0,
                }}>
                  Replace
                </button>
              </div>
            )}

            {/* New file selected */}
            {newFile && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderRadius: 8,
                background: "#EAF4FF", border: "1.5px solid #A8CCEE", marginBottom: 8,
              }}>
                <span style={{ fontSize: 18 }}>📋</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1A6FB5" }}>
                    New PDF {isEdit ? "(will replace current)" : "selected"}
                  </div>
                  <div style={{ fontSize: 13, color: "#2C2A22", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {newFile.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                    {(newFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                <button onClick={() => setNewFile(null)} style={{
                  padding: "5px 10px", borderRadius: 6,
                  background: "#FDECEC", color: "#C0392B",
                  border: "1px solid #FFAAAA", fontSize: 11, fontWeight: 700,
                  cursor: "pointer", flexShrink: 0,
                }}>
                  ✕
                </button>
              </div>
            )}

            {/* Drop zone — hide in edit mode when showing the current PDF card */}
            {!(isEdit && !newFile && currentPdfName) && (
              <div onClick={() => fileRef.current?.click()} style={{
                border: "2px dashed #CCC8BE", borderRadius: 10,
                padding: "18px", cursor: "pointer",
                background: "#FAF7EE", color: "#888",
                fontSize: 13, fontWeight: 600, textAlign: "center",
              }}>
                📂 Click to {isEdit ? "replace" : "select"} PDF (max 50 MB)
              </div>
            )}

            <input
              ref={fileRef} type="file" accept="application/pdf"
              style={{ display: "none" }}
              onChange={(e) => { setNewFile(e.target.files?.[0] ?? null); e.target.value = ""; }}
            />
          </div>
        </div>

        {error && (
          <p style={{ color: "#C0392B", fontSize: 13, marginTop: 12, marginBottom: 0 }}>⚠️ {error}</p>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={handleSubmit} disabled={saving} style={{
            flex: 1, padding: "12px 0", borderRadius: 10,
            background: saving ? "#AAA" : "#2C2A22",
            color: "#FFFDF7", border: "none",
            fontWeight: 800, fontSize: 15, cursor: saving ? "not-allowed" : "pointer",
          }}>
            {saving ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{
                  width: 14, height: 14, border: "2px solid #fff6", borderTopColor: "#fff",
                  borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block",
                }} />
                {isEdit ? "Saving…" : "Uploading…"}
              </span>
            ) : (isEdit ? "Save Changes" : "Upload Note")}
          </button>
          <button onClick={onClose} style={{
            padding: "12px 20px", borderRadius: 10,
            background: "#F0EBE0", color: "#555",
            border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer",
          }}>
            Cancel
          </button>
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
        background: hovered ? "#FFF9EE" : "#FFFDF7",
        border: "1.5px solid #EEE9DC", borderRadius: 14,
        padding: "16px 20px", display: "flex", alignItems: "center",
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
      }}>
        📄
      </div>
      <div style={{ flex: 1, minWidth: 140 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#2C2A22", marginBottom: 5 }}>{note.title}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <TypePill type={note.type} />
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
        transition: "all .15s", whiteSpace: "nowrap",
      }}
    >
      {emoji} {label}
    </button>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteConfirmModal({ note, onClose, onConfirm, deleting }: {
  note: Note; onClose: () => void; onConfirm: () => void; deleting: boolean;
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
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: "#2C2A22" }}>Delete Note?</h3>
        <p style={{ color: "#666", fontSize: 14, margin: "0 0 24px" }}>
          "<strong>{note.title}</strong>" will be permanently deleted along with its PDF.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onConfirm} disabled={deleting} style={{
            padding: "10px 24px", borderRadius: 10,
            background: deleting ? "#AAA" : "#C0392B", color: "#fff",
            border: "none", fontWeight: 800, fontSize: 14, cursor: deleting ? "not-allowed" : "pointer",
          }}>
            {deleting ? "Deleting…" : "Yes, Delete"}
          </button>
          <button onClick={onClose} style={{
            padding: "10px 24px", borderRadius: 10, background: "#F0EBE0", color: "#555",
            border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────
export default function NotesView() {
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [activeTab, setActiveTab] = useState<NoteType | "all">("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null | undefined>(undefined);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  // ── Load all notes once; filtering is done client-side for instant search ──
  const loadNotes = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setLoadError("");
    try {
      const data = await API.list(); // fetch all, filter client-side
      setAllNotes(data);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load notes");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  const handleDelete = async () => {
    if (!deletingNote) return;
    setDeleting(true);
    try {
      await API.delete(deletingNote.id);
      setDeletingNote(null);
      loadNotes(true);
    } catch { /* ignore */ }
    finally { setDeleting(false); }
  };

  // ── Client-side filtering (instant, no server round-trip) ──────────────────
  const filtered = allNotes
    .filter((n) => activeTab === "all" || n.type === activeTab)
    .filter((n) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.label.toLowerCase().includes(q)
      );
    });

  const counts = {
    all: allNotes.length,
    DEMO: allNotes.filter((n) => n.type === "DEMO").length,
    REAL: allNotes.filter((n) => n.type === "REAL").length,
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: 860, margin: "0 auto" }}>
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
        <div style={{ display: "flex", gap: 8 }}>
          {/* Refresh button */}
          <button
            onClick={() => loadNotes(true)}
            disabled={refreshing}
            title="Refresh notes"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "11px 16px", borderRadius: 10,
              background: "#F0EBE0", color: "#555",
              border: "1.5px solid #DDD8CC", fontWeight: 700, fontSize: 14,
              cursor: refreshing ? "not-allowed" : "pointer",
            }}
          >
            <span style={{
              display: "inline-block",
              animation: refreshing ? "spin 0.7s linear infinite" : "none",
            }}>
              🔄
            </span>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>

          {/* Add Note button */}
          <button onClick={() => setEditingNote(null)} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "11px 20px", borderRadius: 10,
            background: "#2C2A22", color: "#FFFDF7",
            border: "none", fontWeight: 800, fontSize: 14,
            cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}>
            ➕ Add Note
          </button>
        </div>
      </div>

      {/* Tabs + Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {(["all", "DEMO", "REAL"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "8px 18px", borderRadius: 30,
            background: activeTab === tab ? "#2C2A22" : "#F0EBE0",
            color: activeTab === tab ? "#FFFDF7" : "#666",
            border: "none", fontWeight: 700, fontSize: 13,
            cursor: "pointer", transition: "all .15s",
          }}>
            {tab === "all" ? "All" : tab === "DEMO" ? "🎓 Demo" : "📚 Real"}
            <span style={{
              marginLeft: 6, padding: "1px 7px", borderRadius: 10,
              background: activeTab === tab ? "rgba(255,255,255,0.2)" : "#DDD8CC",
              color: activeTab === tab ? "#fff" : "#888", fontSize: 11, fontWeight: 800,
            }}>
              {counts[tab]}
            </span>
          </button>
        ))}

        {/* Search */}
        <div style={{ marginLeft: "auto", position: "relative" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search by title or label…"
            style={{
              padding: "8px 36px 8px 14px",
              border: "1.5px solid #DDD8CC", borderRadius: 30,
              background: "#FAF7EE", color: "#2C2A22",
              fontSize: 13, outline: "none", fontFamily: "inherit", minWidth: 220,
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "#AAA", fontSize: 14, padding: 0, lineHeight: 1,
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Search result count when searching */}
      {search.trim() && !loading && (
        <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
          {filtered.length === 0
            ? `No results for "${search}"`
            : `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`}
        </div>
      )}

      {/* Error state */}
      {loadError && (
        <div style={{
          padding: "16px 20px", borderRadius: 12, background: "#FFF0F0",
          border: "1.5px solid #FFCCCC", color: "#C0392B",
          fontSize: 14, marginBottom: 16,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <span>⚠️ {loadError}</span>
          <button onClick={() => loadNotes()} style={{
            padding: "6px 14px", borderRadius: 8, background: "#C0392B", color: "#fff",
            border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer",
          }}>
            Retry
          </button>
        </div>
      )}

      {/* Notes list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#BBB", fontSize: 15 }}>
          <div style={{
            width: 32, height: 32, border: "3px solid #DDD", borderTopColor: "#888",
            borderRadius: "50%", animation: "spin 0.8s linear infinite",
            margin: "0 auto 12px",
          }} />
          Loading notes…
        </div>
      ) : filtered.length === 0 && !loadError ? (
        <div style={{
          textAlign: "center", padding: "60px 0",
          color: "#CCC", fontSize: 15,
          border: "2px dashed #EEE9DC", borderRadius: 14,
        }}>
          {search.trim()
            ? `No notes match "${search}".`
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
        <NoteFormModal editNote={editingNote} onClose={() => setEditingNote(undefined)} onSaved={() => loadNotes(true)} />
      )}
      {deletingNote && (
        <DeleteConfirmModal
          note={deletingNote}
          onClose={() => setDeletingNote(null)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}
    </div>
  );
}